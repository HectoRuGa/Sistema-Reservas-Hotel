from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database.connection import SessionLocal
from app.models.reserva import Reserva
from app.models.consumo import Consumo
from app.models.habitacion import Habitacion
from app.models.cliente import Cliente
from app.models.factura import Factura
from app.schemas.factura import FacturaResponse
from app.schemas.reserva import (
    ReservaCreate,
    ReservaResponse,
    ReservaListResponse,
    ConsumoCreate,
    ConsumoResponse,
    HabitacionDisponible,
)
from datetime import datetime, timezone, date

router = APIRouter(prefix="/reservas", tags=["Reservas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/disponibilidad", response_model=list[HabitacionDisponible])
def buscar_disponibilidad(
    fecha_entrada: date = Query(...),
    fecha_salida: date = Query(...),
    db: Session = Depends(get_db),
):
    if fecha_entrada >= fecha_salida:
        raise HTTPException(status_code=400, detail="La fecha de salida debe ser posterior a la de entrada")

    habitaciones_disponibles = db.query(Habitacion).filter(
        Habitacion.estado == "disponible"
    ).all()

    reservas_solapadas = db.query(Reserva).filter(
        Reserva.estado.in_(["pendiente", "activa"]),
        Reserva.fecha_entrada.isnot(None),
        Reserva.fecha_salida.isnot(None),
        Reserva.fecha_entrada < fecha_salida,
        Reserva.fecha_salida > fecha_entrada,
    ).all()

    ids_ocupadas = {r.habitacion_id for r in reservas_solapadas}

    return [
        HabitacionDisponible(id=h.id, tipo=h.tipo, precio=h.precio)
        for h in habitaciones_disponibles
        if h.id not in ids_ocupadas
    ]

@router.post("/", response_model=ReservaResponse)
def crear_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == reserva.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    habitacion = db.query(Habitacion).filter(Habitacion.id == reserva.habitacion_id).first()
    if not habitacion:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    if habitacion.estado != "disponible":
        raise HTTPException(status_code=400, detail="La habitación no está disponible")

    if reserva.fecha_entrada and reserva.fecha_salida:
        if reserva.fecha_entrada >= reserva.fecha_salida:
            raise HTTPException(status_code=400, detail="La fecha de salida debe ser posterior a la de entrada")

        solapada = db.query(Reserva).filter(
            Reserva.estado.in_(["pendiente", "activa"]),
            Reserva.habitacion_id == reserva.habitacion_id,
            Reserva.fecha_entrada.isnot(None),
            Reserva.fecha_salida.isnot(None),
            Reserva.fecha_entrada < reserva.fecha_salida,
            Reserva.fecha_salida > reserva.fecha_entrada,
        ).first()
        if solapada:
            raise HTTPException(
                status_code=400,
                detail="La habitación ya tiene una reserva en esas fechas",
            )

    nueva = Reserva(
        cliente_id=reserva.cliente_id,
        habitacion_id=reserva.habitacion_id,
        fecha_entrada=reserva.fecha_entrada,
        fecha_salida=reserva.fecha_salida,
        estado="pendiente",
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=list[ReservaListResponse])
def listar_reservas(db: Session = Depends(get_db)):
    reservas = db.query(Reserva).order_by(Reserva.fecha_creacion.desc()).all()
    resultado = []
    for r in reservas:
        total = sum(c.monto for c in r.consumos) if r.consumos else 0
        resultado.append(ReservaListResponse(
            id=r.id,
            cliente_id=r.cliente_id,
            habitacion_id=r.habitacion_id,
            fecha_entrada=r.fecha_entrada,
            fecha_salida=r.fecha_salida,
            fecha_check_in=r.fecha_check_in,
            fecha_check_out=r.fecha_check_out,
            estado=r.estado,
            fecha_creacion=r.fecha_creacion,
            cliente_nombre=r.cliente.nombre if r.cliente else "—",
            habitacion_tipo=f"#{r.habitacion.id} - {r.habitacion.tipo}" if r.habitacion else "—",
            total_consumos=total,
        ))
    return resultado

@router.get("/{id}", response_model=ReservaResponse)
def obtener_reserva(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva

@router.put("/{id}", response_model=ReservaResponse)
def editar_reserva(id: int, data: ReservaCreate, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != "pendiente":
        raise HTTPException(status_code=400, detail="Solo se pueden editar reservas pendientes")

    if data.habitacion_id != reserva.habitacion_id:
        habitacion = db.query(Habitacion).filter(Habitacion.id == data.habitacion_id).first()
        if not habitacion:
            raise HTTPException(status_code=404, detail="Habitación no encontrada")
        if habitacion.estado != "disponible":
            raise HTTPException(status_code=400, detail="La habitación no está disponible")

    reserva.cliente_id = data.cliente_id
    reserva.habitacion_id = data.habitacion_id
    reserva.fecha_entrada = data.fecha_entrada
    reserva.fecha_salida = data.fecha_salida
    db.commit()
    db.refresh(reserva)
    return reserva

@router.delete("/{id}")
def eliminar_reserva(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado == "activa":
        raise HTTPException(status_code=400, detail="No se puede eliminar una reserva activa")
    db.delete(reserva)
    db.commit()
    return {"ok": True}

@router.post("/{id}/check-in", response_model=ReservaResponse)
def registrar_check_in(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != "pendiente":
        raise HTTPException(status_code=400, detail="La reserva no está pendiente")

    habitacion = db.query(Habitacion).filter(Habitacion.id == reserva.habitacion_id).first()
    if not habitacion or habitacion.estado != "disponible":
        raise HTTPException(status_code=400, detail="La habitación no está disponible")

    reserva.estado = "activa"
    reserva.fecha_check_in = datetime.now(timezone.utc)
    habitacion.estado = "ocupada"

    db.commit()
    db.refresh(reserva)
    return reserva

def _generar_factura(reserva: Reserva, db: Session) -> Factura:
    noches = 0
    if reserva.fecha_entrada and reserva.fecha_salida:
        noches = max(0, (reserva.fecha_salida - reserva.fecha_entrada).days)
    precio = reserva.habitacion.precio if reserva.habitacion else 0
    cargo_habitacion = precio * noches
    consumos_total = sum(c.monto for c in reserva.consumos) if reserva.consumos else 0
    total = cargo_habitacion + consumos_total

    factura = Factura(
        reserva_id=reserva.id,
        cargo_habitacion=cargo_habitacion,
        consumos_total=consumos_total,
        total=total,
        estado="pendiente",
    )
    db.add(factura)
    return factura

@router.post("/{id}/check-out", response_model=ReservaResponse)
def registrar_check_out(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != "activa":
        raise HTTPException(status_code=400, detail="La reserva no está activa")

    habitacion = db.query(Habitacion).filter(Habitacion.id == reserva.habitacion_id).first()
    if habitacion:
        habitacion.estado = "disponible"

    _generar_factura(reserva, db)

    reserva.estado = "finalizada"
    reserva.fecha_check_out = datetime.now(timezone.utc)

    db.commit()
    db.refresh(reserva)
    return reserva

@router.post("/{id}/inactivar", response_model=ReservaResponse)
def marcar_inactivo(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != "pendiente":
        raise HTTPException(status_code=400, detail="Solo se pueden inactivar reservas pendientes")

    habitacion = db.query(Habitacion).filter(Habitacion.id == reserva.habitacion_id).first()
    if habitacion:
        habitacion.estado = "disponible"

    _generar_factura(reserva, db)

    reserva.estado = "inactivo"

    db.commit()
    db.refresh(reserva)
    return reserva

@router.post("/{id}/consumos", response_model=ConsumoResponse)
def agregar_consumo(id: int, consumo: ConsumoCreate, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != "activa":
        raise HTTPException(status_code=400, detail="Solo se pueden agregar consumos a reservas activas")

    nuevo = Consumo(
        reserva_id=id,
        descripcion=consumo.descripcion,
        monto=consumo.monto,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/{id}/consumos", response_model=list[ConsumoResponse])
def listar_consumos(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva.consumos

@router.delete("/{id}/consumos/{consumo_id}")
def eliminar_consumo(id: int, consumo_id: int, db: Session = Depends(get_db)):
    consumo = db.query(Consumo).filter(Consumo.id == consumo_id, Consumo.reserva_id == id).first()
    if not consumo:
        raise HTTPException(status_code=404, detail="Consumo no encontrado")
    db.delete(consumo)
    db.commit()
    return {"ok": True}

@router.get("/{id}/factura", response_model=FacturaResponse)
def obtener_factura_por_reserva(id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    factura = db.query(Factura).filter(Factura.reserva_id == id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura
