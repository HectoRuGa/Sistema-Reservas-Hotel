from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime, timezone

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, index=True)
    reserva_id = Column(Integer, ForeignKey("reservas.id"), nullable=False)
    fecha_emision = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    cargo_habitacion = Column(Float, default=0)
    consumos_total = Column(Float, default=0)
    total = Column(Float, default=0)
    estado = Column(String, default="pendiente")
    metodo_pago = Column(String, nullable=True)

    reserva = relationship("Reserva")
