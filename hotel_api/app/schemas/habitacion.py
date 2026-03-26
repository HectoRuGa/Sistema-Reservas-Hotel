from pydantic import BaseModel

class HabitacionCreate(BaseModel):
    tipo: str
    estado: str
    precio: float

class HabitacionResponse(HabitacionCreate):
    id: int

    class Config:
        from_attributes = True