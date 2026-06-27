import json
from prophet.serialize import model_from_json
import pandas as pd
from datetime import date
import matplotlib
matplotlib.use('Agg') # Forces Matplotlib to run without a GUI
import matplotlib.pyplot as plt
from services.config import Tourist_Types, PATHS
from services.ploting import plot_forecast, plot_forecast_components

MODEL_CACHE = {}

def load_model(model_name: str):
    global MODEl_CACHE
    TARGET_PATH = PATHS["MODELS"] / f"model_{model_name}.json"
    with open(TARGET_PATH, 'r') as file:
        LOADED_MODEL = model_from_json(json.load(file))
        MODEL_CACHE[model_name] = LOADED_MODEL

def load_all_models():
    if PATHS["MODELS"].is_dir():
        load_model("total")
        for tourist_data in Tourist_Types.values():
            load_model(tourist_data["name"])
    else:
        print("models directory not found.")

def forecast(start_date: date, end_date: date, model_name: str):
    global MODEL_CACHE
    future_dates = pd.date_range(start=start_date, end=end_date, freq='D')
    future_df = pd.DataFrame({'ds': future_dates})

    if model_name not in MODEL_CACHE:
        load_model(model_name)
        
    model = MODEL_CACHE[model_name]

    forecast = model.predict(future_df)

    plot_id = plot_forecast(model, forecast, start_date, end_date, model_name)
    plot_components_id = plot_forecast_components(model, forecast, start_date, end_date, model_name)

    return plot_id

