import matplotlib
matplotlib.use('Agg') # Forces Matplotlib to run without a GUI
import matplotlib.pyplot as plt
import pandas as pd
from datetime import date
from services.config import Tourist_Types, PATHS
import hashlib

def plot_forecast(model, forecast, start_date, end_date, model_name):
    unique_string = f"{start_date}_{end_date}_{model_name}"
    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"

    if TARGET_PATH.is_file():
        return plot_id

    fig = model.plot(forecast)
    plt.title(f"Previsao de {start_date} para {end_date} no {model_name}")
    plt.xlabel("Data")
    plt.ylabel("Turistas")
    
    fig.savefig(TARGET_PATH, bbox_inches='tight')
    plt.close(fig)  

    return plot_id


def plot_forecast_components(model, forecast, start_date, end_date, model_name):
    unique_string = f"{start_date}_{end_date}_{model_name}"
    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}_components.png"

    if TARGET_PATH.is_file():
        return plot_id

    fig = model.plot_components(forecast)
    plt.title(f"Componentes de revisao de {start_date} para {end_date} no {model_name}")

    fig.savefig(TARGET_PATH, bbox_inches='tight')

    plt.close(fig)  

    return plot_id



def bar_plot():
    return

def pizza_plot():
    return
