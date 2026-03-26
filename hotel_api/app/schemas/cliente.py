from pydantic import BaseModel

class ClienteCreate(BaseModel):
    nombre: str
    correo: str
    telefono: str

class ClienteResponse(ClienteCreate):
    id: int

    class Config:
        from_attributes = True