import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
from datetime import datetime, timedelta, date
from services.config import Tourist_Types, PATHS

#Agrupar numeros de turistas por periodo escolhido.
def group_by_freq(df, key='Data de chegada', freq="D"):
    df_freq = df.copy()
    df_freq[key] = pd.to_datetime(df_freq[key])
    df_freq = df_freq.groupby(pd.Grouper(key=key, freq=freq, sort=True)).size()
    return df_freq

#Filtrar numeros de turistas por perfil
def filter_by_type(df, type, key="Perfil_Latente_Gerador"):
    df_type = df.copy()
    df_type = df_type[df_type[key]==type]
    return df_type

def between_dates(df, start_date, end_date, key='ds'):
    df_between = df.copy()
    df_between[key] = pd.to_datetime(df_between[key])
    start_dt = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date)
    df_between = df_between[df_between[key].between(start_dt, end_dt)]
    return df_between

def between_ranges(df, start_range, end_range, n, key="Gasto médio diário em Olímpia"):
    bin_edges= np.linspace(start_range, end_range, n+1)
    group_names = [f'Tier {i}' for i in range(1, len(bin_edges))]
    counts = pd.cut(df[key], bins=bin_edges, labels=group_names).value_counts(sort=False)
    return counts

#Concatenar dados históricos de 2021-2025 para treino dos modelos.
def concat_historical_data():
    csv_files = list(PATHS["ORIGINAL"].glob("*.csv"))
    df_list = [pd.read_csv(file) for file in csv_files]

    if df_list:
        combined_df = pd.concat(df_list, sort=True, ignore_index=True)
        TARGET_PATH = PATHS["PROCESSED"] / 'dataset_Total.csv'
        combined_df.to_csv(TARGET_PATH, index=False, encoding='utf-8')
    else:
        print("No CSV files found.")

def divide_historical_data_by_type():
    csv_file = PATHS["PROCESSED"] / "dataset_Total.csv"
    if csv_file.is_file():
        df = pd.read_csv(csv_file)
        for tourist_type, tourist_data in Tourist_Types.items():
            df_type = filter_by_type(df, tourist_type)
            TARGET_PATH = PATHS["PROCESSED"] / f'dataset_{tourist_data["name"]}.csv'
            df_type.to_csv(TARGET_PATH, index=False, encoding='utf-8')
    else:
        print("The Total dataset file doesn't exist.")

#Criar df com colunas padroes do Prophet.
def make_prophet_df(df):
    df_prophet = df.reset_index(name="y")
    df_prophet = df_prophet.rename(columns={"Data de chegada": "ds"})
    return df_prophet
    

def make_holidays_df(config: dict, start_year: int, end_year: int):
    records = []
    
    for year in range(start_year, end_year + 1):
        for holiday_name, holiday_info in config.items():
            dt = date(year, holiday_info["month"], holiday_info["day"])

            # 3. Append matching Prophet's required column names
            records.append({
                "holiday": holiday_name,
                "ds": dt,
                "lower_window": holiday_info["lower_bound"],
                "upper_window": holiday_info["upper_bound"]
            })
            
    # 4. Convert to DataFrame and ensure 'ds' is a datetime object
    df = pd.DataFrame(records)
    df['ds'] = pd.to_datetime(df['ds'])
    
    return df