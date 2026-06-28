import pandas as pd
import numpy as np
from datetime import datetime, timedelta, date
from prophet import Prophet
from prophet.serialize import model_to_json
from services.data_proc import make_prophet_df, group_by_freq, make_holidays_df
from services.config import Tourist_Types, PATHS, Holidays_Config
import json


def train_and_export_model(model_name, csv_name, start_year, end_year):
    CSV_PATH = PATHS["PROCESSED"] / csv_name
    df = pd.read_csv(CSV_PATH)
    df_freq = group_by_freq(df=df, freq="D")
    df_prophet = make_prophet_df(df_freq)
    print(df_prophet.head())

    df_holidays = make_holidays_df(Holidays_Config, start_year, end_year)

    model = Prophet(yearly_seasonality=True, holidays=df_holidays)
    model.fit(df_prophet)

    TARGET_PATH = PATHS["MODELS"] / f"{model_name}.json"
    with open(TARGET_PATH, 'w') as fout:
        json.dump(model_to_json(model), fout)

def train_and_export_models(start_year, end_year):
    train_and_export_model("model_Total", "dataset_Total.csv", start_year, end_year)
    for tourist_data in Tourist_Types.values():
        train_and_export_model(f"model_{tourist_data["name"]}", f"dataset_{tourist_data["name"]}.csv", start_year, end_year)