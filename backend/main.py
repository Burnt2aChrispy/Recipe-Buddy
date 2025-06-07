from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory shopping list for now
shopping_list = []

class Item(BaseModel):
    name: str
    quantity: int

@app.get("/shopping-list", response_model=List[Item])
async def get_list():
    return shopping_list

@app.post("/shopping-list")
async def add_item(item: Item):
    shopping_list.append(item)
    return {"message": "Item added successfully"}

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}