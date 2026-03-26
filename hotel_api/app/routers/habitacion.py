from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.habitacion import Habitacion
from app.schemas.habitacion import HabitacionCreate, HabitacionResponse

router = APIRouter(prefix="/habitaciones", tags=["Habitaciones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=HabitacionResponse)
def crear_habitacion(habitacion: HabitacionCreate, db: Session = Depends(get_db)):
    nueva = Habitacion(**habitacion.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=list[HabitacionResponse])
def listar_habitaciones(db: Session = Depends(get_db)):
    return db.query(Habitacion).all()

@router.put("/{id}", response_model=HabitacionResponse)
def editar_habitacion(id: int, habitacion: HabitacionCreate, db: Session = Depends(get_db)):
    db_habitacion = db.query(Habitacion).filter(Habitacion.id == id).first()
    if db_habitacion:
        for key, value in habitacion.dict().items():
            setattr(db_habitacion, key, value)
        db.commit()
        db.refresh(db_habitacion)
    return db_habitacion