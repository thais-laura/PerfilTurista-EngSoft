from services.forecasting import forecast
from services.ploting import plot_historic, bar_historic, pie_historic
from services.config import PATHS, Tourist_Types
import json
from prophet.serialize import model_from_json

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

def plot_request_handler(start_date, end_date, plot_type, prediction, model_name, group_by, service):

    def plot_line(start_date, end_date, prediction, model_name, group_by):
        if prediction:
            global MODEL_CACHE
            if model_name not in MODEL_CACHE:
                load_model(model_name)
        
            model = MODEL_CACHE[model_name]
            return forecast(start_date, end_date, model, model_name, period=group_by)
        else: 
            return plot_historic(start_date, end_date, model_name, period=group_by)

    def plot_columns(start_date, end_date, prediction):
        if prediction:
            return None
        else:
            return bar_historic(start_date, end_date)
    
    def plot_pizza(start_date, end_date, prediction, service):
        if prediction:
            return None
        else:
            return pie_historic(start_date, end_date, establishment=service)

    def check_plot_type(start_date, end_date, plot_type, prediction, model_name, group_by, service):
        match plot_type:
            case "line":
                return plot_line(start_date, end_date, prediction, model_name, group_by)
            case "columns":
                return plot_columns(start_date, end_date, prediction)
            case "pizza":
                return plot_pizza(start_date, end_date, prediction, service)

    
    return check_plot_type(start_date, end_date, plot_type, prediction, model_name, group_by, service)