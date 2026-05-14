from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime, timezone

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    habitacion_id = Column(Integer, ForeignKey("habitaciones.id"), nullable=False)
    fecha_entrada = Column(Date, nullable=True)
    fecha_salida = Column(Date, nullable=True)
    fecha_check_in = Column(DateTime, nullable=True)
    fecha_check_out = Column(DateTime, nullable=True)
    estado = Column(String, default="pendiente")
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    cliente = relationship("Cliente")
    habitacion = relationship("Habitacion")
    consumos = relationship("Consumo", back_populates="reserva", cascade="all, delete-orphan")
