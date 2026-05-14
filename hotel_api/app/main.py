from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine
from app.routers import cliente as cliente_router
from app.routers import habitacion as habitacion_router
from app.routers import reserva as reserva_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cliente_router.router)
app.include_router(habitacion_router.router)
app.include_router(reserva_router.router)

@app.get("/")
def root():
    return {"message": "API Hotel funcionando"}
