import json
from prophet.serialize import model_from_json
import pandas as pd
from datetime import date
import matplotlib
matplotlib.use('Agg') # Forces Matplotlib to run without a GUI
import matplotlib.pyplot as plt
from services.config import Tourist_Types, PATHS
from services.ploting import plot_forecast, plot_forecast_components

def forecast(start_date: date, end_date: date, model, model_name: str, period:str):
    future_dates = pd.date_range(start=start_date, end=end_date, freq='D')
    future_df = pd.DataFrame({'ds': future_dates})

    forecast = model.predict(future_df)

    plot_id = plot_forecast(forecast, start_date, end_date, model_name, period)
    #plot_components_id = plot_forecast_components(model, forecast, start_date, end_date, model_name)

    return plot_id

