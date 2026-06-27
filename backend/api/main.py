from fastapi import FastAPI, HTTPException, status, Request, Query, Path, Body
from fastapi.responses import FileResponse
from typing import Annotated
from pydantic import BaseModel, Field
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

import services.forecasting as tasks
from services.config import PATHS
from api.schemas import PlotRequest, PlotResponse, ForecastRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    tasks.load_all_models()
    yield
    tasks.MODEL_CACHE.clear()

app = FastAPI(title="API Tourdev", lifespan=lifespan)

app.mount("/images", StaticFiles(directory="./data/images"), name="images")

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post(
    "/api/v1/forecast/plots",
    response_model=PlotResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_plot(request: Request, payload: ForecastRequest):
    try:
        plot_id = tasks.forecast(
            start_date=payload.start_date,
            end_date=payload.end_date,
            model_name=payload.model_name
        )
        
        # Build the dynamic URL for the GET endpoint
        base_url = str(request.base_url)
        image_url = f"{base_url}api/v1/forecast/plots/{plot_id}"

        return {
            "plot_id": plot_id,
            "status": "created",
            "image_url": image_url
        }
        
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@app.get(
    "/api/v1/forecast/plots/{plot_id}",
    responses={200: {"content": {"image/png": {}}}}
)
async def get_plot(plot_id: str):
    # Look for the file based on the ID provided in the URL
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"
    
    if not TARGET_PATH.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plot not found. It may have expired or the ID is invalid."
        )
        
    return FileResponse(TARGET_PATH, media_type="image/png")