from services.data_proc import concat_historical_data, divide_historical_data_by_type
from services.training import train_and_export_models
from services.forecasting import forecast
from datetime import date

if __name__ == "__main__":
    concat_historical_data()
    divide_historical_data_by_type()
    train_and_export_models()
    start_date = date(2026,1,1)
    end_date = date(2027,1,1)
    models = ["total", "casal", "corporativo"]
    forecast(start_date,end_date, models)