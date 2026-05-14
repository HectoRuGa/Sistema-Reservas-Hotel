from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime, timezone

class Consumo(Base):
    __tablename__ = "consumos"

    id = Column(Integer, primary_key=True, index=True)
    reserva_id = Column(Integer, ForeignKey("reservas.id"), nullable=False)
    descripcion = Column(String, nullable=False)
    monto = Column(Float, nullable=False)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reserva = relationship("Reserva", back_populates="consumos")
