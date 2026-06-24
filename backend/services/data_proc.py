import pandas as pd
from pathlib import Path
from statsmodels.tsa.seasonal import seasonal_decompose
from services.tourist import Tourist_Types

CURR_PATH = Path(__file__).resolve().parent
ORG_DATA_PATH = CURR_PATH.parent / "data/original"
PROC_DATA_PATH = CURR_PATH.parent / "data/processed"

#Agrupar numeros de turistas por periodo escolhido.
def group_by_freq(df, freq="D"):
    df_freq = df.copy()
    df_freq['Data de chegada'] = pd.to_datetime(df_freq['Data de chegada'])
    df_freq = df_freq.groupby(pd.Grouper(key='Data de chegada', freq=freq, sort=True)).size()
    return df_freq

#Filtrar numeros de turistas por perfil
def filter_by_type(df, type):
    df_type = df.copy()
    df_type = df_type[df_type["Perfil_Latente_Gerador"]==type]
    return df_type

#Concatenar dados históricos de 2021-2025 para treino dos modelos.
def concat_historical_data():
    csv_files = list(ORG_DATA_PATH.glob("*.csv"))
    df_list = [pd.read_csv(file) for file in csv_files]

    if df_list:
        combined_df = pd.concat(df_list, sort=True, ignore_index=True)
        TARGET_PATH = PROC_DATA_PATH / 'dataset_total.csv'
        combined_df.to_csv(TARGET_PATH, index=False, encoding='utf-8')
    else:
        print("No CSV files found.")

def divide_historical_data_by_type():
    csv_file = PROC_DATA_PATH / "dataset_total.csv"
    if csv_file.is_file():
        df = pd.read_csv(csv_file)
        for tourist_type, tourist_data in Tourist_Types.items():
            df_type = filter_by_type(df, tourist_type)
            TARGET_PATH = PROC_DATA_PATH / f'dataset_{tourist_data["name"]}.csv'
            df_type.to_csv(TARGET_PATH, index=False, encoding='utf-8')
    else:
        print("The total dataset file doesn't exist.")

#Criar df com colunas padroes do Prophet.
def make_prophet_df(df):
    df_prophet = df.reset_index(name="y")
    df_prophet = df_prophet.rename(columns={"Data de chegada": "ds"})
    return df_prophet
    