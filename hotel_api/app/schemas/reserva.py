from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class ReservaCreate(BaseModel):
    cliente_id: int
    habitacion_id: int
    fecha_entrada: Optional[date] = None
    fecha_salida: Optional[date] = None

class ConsumoResponse(BaseModel):
    id: int
    reserva_id: int
    descripcion: str
    monto: float
    fecha: datetime

    class Config:
        from_attributes = True

class ReservaResponse(BaseModel):
    id: int
    cliente_id: int
    habitacion_id: int
    fecha_entrada: Optional[date] = None
    fecha_salida: Optional[date] = None
    fecha_check_in: Optional[datetime] = None
    fecha_check_out: Optional[datetime] = None
    estado: str
    fecha_creacion: datetime
    consumos: list[ConsumoResponse] = []

    class Config:
        from_attributes = True

class ReservaListResponse(BaseModel):
    id: int
    cliente_id: int
    habitacion_id: int
    fecha_entrada: Optional[date] = None
    fecha_salida: Optional[date] = None
    fecha_check_in: Optional[datetime] = None
    fecha_check_out: Optional[datetime] = None
    estado: str
    fecha_creacion: datetime
    cliente_nombre: str
    habitacion_tipo: str
    total_consumos: float = 0

class ConsumoCreate(BaseModel):
    descripcion: str
    monto: float

class HabitacionDisponible(BaseModel):
    id: int
    tipo: str
    precio: float
