from sqlalchemy import Column, Integer, String, Float
from app.database.connection import Base

class Habitacion(Base):
    __tablename__ = "habitaciones"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, nullable=False)
    estado = Column(String, default="disponible")
    precio = Column(Float)