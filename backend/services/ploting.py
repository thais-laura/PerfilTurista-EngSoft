import matplotlib
matplotlib.use('Agg') # Forces Matplotlib to run without a GUI
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import date
from services.config import Tourist_Types, PATHS, Graph_Configs
from services.data_proc import group_by_freq, make_prophet_df, between_dates, between_ranges, filter_by_type
import hashlib

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

def pie_historic(start_date, end_date, establishment):
    unique_string = f"{start_date}_{end_date}_{establishment}_historic_pie"
    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"

    if TARGET_PATH.is_file():
        return plot_id

    records = {}
    for tourist_type, tourist_data in Tourist_Types.items():
        CSV_PATH = PATHS["PROCESSED"] / f"dataset_{tourist_data["name"]}.csv"
        df = pd.read_csv(CSV_PATH)
        df_between = between_dates(df, start_date, end_date, key='Data de chegada')
        df_establishment = filter_by_type(df_between, establishment, "Atrativos visitados")
        count = len(df_establishment)
        records[tourist_data["name"]] = count
    
    df_plot = pd.DataFrame.from_dict(records,orient='index', columns=["total"])
    df_plot["color"] = df_plot.index.map(lambda x: Graph_Configs["Tourist_Type"][x]["color"])

    fig, ax = plt.subplots(figsize=(12, 6), dpi=100)

    threshold = 5

    wedges, _, _ = ax.pie(
        df_plot["total"],
        colors=df_plot["color"].tolist(),
        autopct=lambda p: f'{p:.1f}%' if p >= threshold else '',
        startangle=90
    )

    legend_labels = [
        f"{label} ({value})"
        for label, value in zip(df_plot.index, df_plot["total"])
    ]

    ax.legend(
        wedges,
        legend_labels,
        title="Tipos de Turistas (Total)",
        loc="center left",
        bbox_to_anchor=(1, 0.5),
    )

    ax.set_title(f"Turistas em {establishment} entre {start_date} até {end_date}", fontsize=14, fontweight='bold', pad=15)

    fig.savefig(TARGET_PATH, bbox_inches='tight')
    plt.close(fig)  
    return plot_id

def bar_historic(start_date, end_date):

    unique_string = f"{start_date}_{end_date}_historic_bar"
    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"

    if TARGET_PATH.is_file():
        return plot_id

    records = {}
    for tourist_type, tourist_data in Tourist_Types.items():
        CSV_PATH = PATHS["PROCESSED"] / f"dataset_{tourist_data["name"]}.csv"
        df = pd.read_csv(CSV_PATH)
        df_between = between_dates(df, start_date, end_date, key='Data de chegada')
        count = between_ranges(df_between, 0, 2000, 5)
        records[tourist_data["name"]] = count

    df_plot = pd.DataFrame(records)

    gastos = [
        "R$ 0-400",
        "R$ 400-800",
        "R$ 800-1200",
        "R$ 1200-1600",
        "R$ 1600-2000",
    ]

    df_plot.index = gastos

    bottom = np.zeros(len(df_plot))

    fig, ax = plt.subplots(figsize=(12, 6), dpi=100)

    for tourist_name in df_plot.columns:
        ax.bar(
            df_plot.index, 
            df_plot[tourist_name], 
            bottom=bottom, 
            label=tourist_name, 
            width=0.5,
            color=Graph_Configs["Tourist_Type"][tourist_name]["color"]
        )
        bottom += df_plot[tourist_name].values

    ax.set_title(f"Salarios de Turistas entre {start_date} até {end_date}", fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Data', fontsize=12)
    ax.set_ylabel('Turistas', fontsize=12)

    ax.legend(loc='upper right', frameon=True, facecolor='white', edgecolor='none')

    ax.grid(visible=True, which="both", axis="y", linestyle="--", alpha=0.5)
    ax.set_axisbelow(True)

    fig.savefig(TARGET_PATH, bbox_inches='tight')
    plt.close(fig)  
    return plot_id

def plot_forecast(forecast, start_date, end_date, model_name, period):
    unique_string = f"{start_date}_{end_date}_{model_name}_{period}_forecast"
    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"

    if TARGET_PATH.is_file():
        return plot_id

    forecast_period = forecast.set_index('ds').resample(period).agg({
    'yhat': 'sum',
    'yhat_lower': 'sum', 
    'yhat_upper': 'sum'   
    }).reset_index()

    df_plot = forecast_period[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

    fig=plt.figure(figsize=(12, 6), dpi=100)

    plt.fill_between(
        df_plot['ds'], 
        df_plot['yhat_lower'], 
        df_plot['yhat_upper'], 
        color=Graph_Configs["Tourist_type"][model_name]["color"], 
        alpha=0.4, 
        label='Intervalo de Incerteza'
    )

    plt.plot(
        df_plot['ds'], 
        df_plot['yhat'], 
        color=Graph_Configs["Tourist_type"][model_name]["color"], 
        linestyle='-', 
        linewidth=2, 
        label='Predição'
    )
    
    plt.title(f"Previsao de {start_date} para {end_date} no {model_name}", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Data', fontsize=12)
    plt.ylabel('Turistas', fontsize=12)
    plt.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='none')
    plt.grid(visible=True, which="both", axis="both")
    
    fig.savefig(TARGET_PATH, bbox_inches='tight')
    plt.close(fig)  

    return plot_id

def plot_historic(start_date, end_date, tourist_name, period):
    unique_string = f"{start_date}_{end_date}_{tourist_name}_{period}_historic"

    plot_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    TARGET_PATH = PATHS["IMAGES"] / f"{plot_id}.png"

    if TARGET_PATH.is_file():
        return plot_id

    CSV_PATH = PATHS["PROCESSED"] / f"dataset_{tourist_name}.csv"
    df = pd.read_csv(CSV_PATH)
    df_between = between_dates(df, start_date, end_date, key='Data de chegada')
    df_freq = group_by_freq(df_between,freq=period)
    df_plot = make_prophet_df(df_freq)

    fig=plt.figure(figsize=(12, 6), dpi=100)

    plt.plot(
        df_plot['ds'], 
        df_plot['y'], 
        color=Graph_Configs["Tourist_type"][tourist_name]["color"], 
        linestyle='-', 
        linewidth=2, 
        label='Turistas'
    )
    
    plt.title(f"Dadosde {start_date} para {end_date} para perfil {tourist_name}", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Data', fontsize=12)
    plt.ylabel('Turistas', fontsize=12)
    plt.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='none')
    plt.grid(visible=True, which="both", axis="both")
    
    fig.savefig(TARGET_PATH, bbox_inches='tight')
    plt.close(fig)  

    return plot_id