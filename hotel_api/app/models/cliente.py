from sqlalchemy import Column, Integer, String
from app.database.connection import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    correo = Column(String, unique=True)
    telefono = Column(String)