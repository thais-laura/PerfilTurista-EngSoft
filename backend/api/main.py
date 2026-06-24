from fastapi import FastAPI, Query, Path, Body
from typing import Annotated
from pydantic import BaseModel, Field

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}