from pydantic import BaseModel, Field
from datetime import date
from typing import Dict, Optional, List

class ForecastRequest(BaseModel):
    start_date: date = Field(..., description="Start date for the forecast (YYYY-MM-DD)")
    end_date: date = Field(..., description="End date for the forecast (YYYY-MM-DD)")
    models: List[str] = []

class ForecastResponse(BaseModel):
    ds: date
    yhat: float
    yhat_lower: float
    yhat_upper: float