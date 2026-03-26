from fastapi import FastAPI
from app.database.connection import Base, engine
from app.routes import clientes, habitaciones

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel API")

app.include_router(clientes.router)
app.include_router(habitaciones.router)

@app.get("/")
def root():
    return {"message": "API Hotel funcionando"}