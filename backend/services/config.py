from pathlib import Path

Tourist_Types = {
    "Casal de fim de semana": {"name": "casal"},
    "Familia de parques aquaticos": {"name": "familia"},
    "Turista fiel premium": {"name": "premium"},
    "Turista Corporativo": {"name": "corporativo"}, 
    "Turista econômico": {"name": "economico"}, 
    "Turista de Evento": {"name": "evento"}
    }

CURR_PATH = Path(__file__).resolve().parent
DATA_PATH = CURR_PATH.parent / "data"

PATHS = {
    "CURR": CURR_PATH,
    "DATA": CURR_PATH.parent / "data",
    "MODELS": DATA_PATH / "models",
    "IMAGES": DATA_PATH / "images",
    "ORIGINAL": DATA_PATH / "original",
    "PROCESSED":DATA_PATH / "processed",
}