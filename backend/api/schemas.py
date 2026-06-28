from pydantic import BaseModel, Field
from datetime import date
from typing import Dict, Optional, List

class PlotRequest(BaseModel):
    start_date: date = Field(..., description="Start date for the forecast (YYYY-MM-DD)")
    end_date: date = Field(..., description="End date for the forecast (YYYY-MM-DD)")
    filters: Optional[Dict[str, str]] = Field(
        default=None, 
        description="Filters to target specific attributes, e.g., {'attribute': 'renda'} and/or  models, e.g., {'model': 'casal'}"
    )

class PlotResponse(BaseModel):
    plot_id: str
    status: str
    image_url: str