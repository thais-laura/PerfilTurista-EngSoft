from fastapi import FastAPI, HTTPException, status, Request, Query, Path, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel, Field
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

import services.tasks as tasks
from services.config import PATHS
from api.schemas import PlotRequest, PlotResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    tasks.load_all_models()
    yield
    tasks.MODEL_CACHE.clear()

app = FastAPI(title="API Tourdev", lifespan=lifespan)

# Permite que o frontend (localhost:8080) acesse o backend (localhost:8000).
# O browser bloqueia requisições entre origens diferentes sem esse middleware.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],   # GET, POST, OPTIONS, etc.
    allow_headers=["*"],   # Content-Type, Authorization, etc.
)

app.mount("/images", StaticFiles(directory="./data/images"), name="images")

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post(
    "/api/v1/forecast/plots",
    response_model=PlotResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_plot(request: Request, payload: PlotRequest):
    try:
        filters = payload.filters or {}
        plot_id = tasks.plot_request_handler(
            start_date= payload.start_date,
            end_date=payload.end_date,
            plot_type=filters.get("plot_type"),
            prediction=filters.get("prediction", False),
            model_name=filters.get("model"),
            group_by=filters.get("group_by"),
            service=filters.get("service"),
        )
        
        if plot_id is None:
            raise NotImplementedError("Functionality not yet implemented!")


        # Build the dynamic URL for the GET endpoint
        base_url = str(request.base_url)
        image_url = f"{base_url}api/v1/plots/{plot_id}"

        return {
            "plot_id": plot_id,
            "status": "created",
            "image_url": image_url
        }
        
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except NotImplementedError as nie:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(nie)) 
    

@app.get(
    "/api/v1/plots/{plot_id}",
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