import json
from prophet.serialize import model_from_json
import pandas as pd
from datetime import date
from pathlib import Path
import matplotlib
matplotlib.use('Agg') # Forces Matplotlib to run without a GUI
import matplotlib.pyplot as plt
import io
from services.tourist import Tourist_Types

CURR_PATH = Path(__file__).resolve().parent
DATA_PATH = CURR_PATH.parent / "data"
MODELS_PATH = DATA_PATH / "models"
IMAGES_PATH = DATA_PATH / "images"

MODEl_CACHE = {}

def load_model(model_name: str):
    global MODEl_CACHE
    TARGET_PATH = MODELS_PATH / f"model_{model_name}.json"
    with open(TARGET_PATH, 'r') as file:
        LOADED_MODEL = model_from_json(json.load(file))
        MODEl_CACHE[model_name] = LOADED_MODEL

def load_all_models():
    if MODELS_PATH.is_dir():
        load_model("total")
        for tourist_data in Tourist_Types.values():
            load_model(tourist_data["name"])
    else:
        print("models directory not found.")

def plot_forecast(model, forecast, start_date, end_date, model_name, gen_imgs=False):
    fig = model.plot(forecast)
    plt.title(f"Previsao de {start_date} para {end_date} no {model_name}")
    plt.xlabel("Data")
    plt.ylabel("Turistas")
    
    if gen_imgs:
        TARGET_PATH = IMAGES_PATH / f"{model_name}_{start_date}_{end_date}.png"
        fig.savefig(TARGET_PATH, bbox_inches='tight')
    
    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png', bbox_inches='tight')
    img_buffer.seek(0)
    plt.close(fig)  
    return img_buffer

def plot_forecast_components(model, forecast, start_date, end_date, model_name, gen_imgs=False):
    fig = model.plot_components(forecast)
    plt.title(f"Componentes de revisao de {start_date} para {end_date} no {model_name}")
    if gen_imgs:
        TARGET_PATH = IMAGES_PATH / f"{model_name}_{start_date}_{end_date}_componentes.png"
        fig.savefig(TARGET_PATH, bbox_inches='tight')

    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png', bbox_inches='tight')
    plt.close(fig)  
    return img_buffer

def forecast(start_date: date, end_date: date, model_names: list[str], gen_imgs: bool = False):
    global MODEl_CACHE
    future_dates = pd.date_range(start=start_date, end=end_date, freq='D')
    future_df = pd.DataFrame({'ds': future_dates})

    for model_name in model_names:
        if model_name not in MODEl_CACHE:
            load_model(model_name)
        
        model = MODEl_CACHE[model_name]

        forecast = model.predict(future_df)

        img_buffer_plot = plot_forecast(model, forecast, start_date, end_date, model_name, gen_imgs)
        img_buffer_components = plot_forecast_components(model, forecast, start_date, end_date, model_name, gen_imgs)

