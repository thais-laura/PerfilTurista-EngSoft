import pandas as pd
from pathlib import Path
import numpy as np
from datetime import datetime, timedelta, date
from prophet import Prophet
from prophet.serialize import model_to_json
from services.data_proc import make_prophet_df, group_by_freq
from services.tourist import Tourist_Types
import json

CURR_PATH = Path(__file__).resolve().parent
DATA_PATH = CURR_PATH.parent / "data"
MODELS_PATH = DATA_PATH / "models"
PROC_DATA_PATH = DATA_PATH / "processed"

def train_and_export_model(model_name, csv_name):
    CSV_PATH = PROC_DATA_PATH / csv_name
    df = pd.read_csv(CSV_PATH)
    df_freq = group_by_freq(df=df, freq="D")
    df_prophet = make_prophet_df(df_freq)
    print(df_prophet.head())

    model = Prophet(yearly_seasonality=True)
    model = model.add_country_holidays(country_name="BR")
    model.fit(df_prophet)

    TARGET_PATH = MODELS_PATH / f"{model_name}.json"
    with open(TARGET_PATH, 'w') as fout:
        json.dump(model_to_json(model), fout)

def train_and_export_models():
    train_and_export_model("model_total", "dataset_total.csv")
    for tourist_data in Tourist_Types.values():
        train_and_export_model(f"model_{tourist_data["name"]}", f"dataset_{tourist_data["name"]}.csv")