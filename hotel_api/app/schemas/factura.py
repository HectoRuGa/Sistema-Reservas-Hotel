from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FacturaUpdate(BaseModel):
    estado: str
    metodo_pago: Optional[str] = None

class FacturaResponse(BaseModel):
    id: int
    reserva_id: int
    fecha_emision: datetime
    cargo_habitacion: float
    consumos_total: float
    total: float
    estado: str
    metodo_pago: Optional[str] = None

    class Config:
        from_attributes = True

class FacturaListResponse(BaseModel):
    id: int
    reserva_id: int
    fecha_emision: datetime
    cargo_habitacion: float
    consumos_total: float
    total: float
    estado: str
    cliente_nombre: str
    habitacion_tipo: str
