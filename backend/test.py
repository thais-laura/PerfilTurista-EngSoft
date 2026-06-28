from services.data_proc import concat_historical_data, divide_historical_data_by_type
from services.training import train_and_export_models
from services.forecasting import forecast
from services.ploting import plot_historic, bar_historic, pie_historic
from services.config import Graph_Configs
from services.data_gen import generate_csv
from datetime import date

if __name__ == "__main__":
    #generate_csv(3000,2021)
    #generate_csv(3500,2022)
    #generate_csv(4000,2023)
    #generate_csv(4500,2024)
    #generate_csv(5000,2025)
    #concat_historical_data()
    #divide_historical_data_by_type()
    #train_and_export_models(2020,2030)
    start_date = date(2025,1,1)
    end_date = date(2026,1,1)
    #model = "Total"
    period= "D"
    #for model_name in Graph_Configs.keys():
    #    forecast(start_date,end_date, model_name, period)
    #    plot_historic(start_date, end_date, model_name, period)  
    #bar_historic(start_date,end_date)
    pie_historic(start_date, end_date, "Hoteis")