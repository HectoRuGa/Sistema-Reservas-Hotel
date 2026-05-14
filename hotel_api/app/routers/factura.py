from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.factura import Factura
from app.schemas.factura import FacturaResponse, FacturaListResponse, FacturaUpdate

router = APIRouter(prefix="/facturas", tags=["Facturas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[FacturaListResponse])
def listar_facturas(db: Session = Depends(get_db)):
    facturas = db.query(Factura).order_by(Factura.fecha_emision.desc()).all()
    resultado = []
    for f in facturas:
        resultado.append(FacturaListResponse(
            id=f.id,
            reserva_id=f.reserva_id,
            fecha_emision=f.fecha_emision,
            cargo_habitacion=f.cargo_habitacion,
            consumos_total=f.consumos_total,
            total=f.total,
            estado=f.estado,
            cliente_nombre=f.reserva.cliente.nombre if f.reserva and f.reserva.cliente else "—",
            habitacion_tipo=f"#{f.reserva.habitacion.id} - {f.reserva.habitacion.tipo}" if f.reserva and f.reserva.habitacion else "—",
        ))
    return resultado

@router.get("/{id}", response_model=FacturaResponse)
def obtener_factura(id: int, db: Session = Depends(get_db)):
    factura = db.query(Factura).filter(Factura.id == id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura

@router.put("/{id}", response_model=FacturaResponse)
def actualizar_factura(id: int, data: FacturaUpdate, db: Session = Depends(get_db)):
    factura = db.query(Factura).filter(Factura.id == id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    factura.estado = data.estado
    if data.metodo_pago:
        factura.metodo_pago = data.metodo_pago
    db.commit()
    db.refresh(factura)
    return factura
