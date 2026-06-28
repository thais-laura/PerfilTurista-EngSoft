from pathlib import Path


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

Tourist_Types = {
    "Casal de fim de semana": {"name": "casal"},
    "Familia de parques aquaticos": {"name": "familia"},
    "Turista fiel premium": {"name": "premium"},
    "Turista Corporativo": {"name": "corporativo"}, 
    "Turista econômico": {"name": "economico"}, 
    "Turista de Evento": {"name": "evento"}
    }

Graph_Configs = {
    "Tourist_Type": {
        "total": {"color":"black"},
        "casal": {"color":"violet"},
        "familia": {"color":"turquoise"},
        "premium": {"color":"chocolate"},
        "corporativo": {"color":"goldenrod"},
        "economico": {"color":"limegreen"},
        "evento": {"color":"firebrick"}
    },
    "Estabilishment": {
        "Restaurantes": {"color":"firebrick"},
        "Parques de Entretenimento": {"color":"limegreen"},
        "Parques Aquáticos": {"color":"turquoise"},
        "Pontos Culturais": {"color":"goldenrod"},
        "Hoteis": {"color":"violet"},
        "Pontos Turisticos": {"color":"chocolate"},
        "Centros de Evento": {"color":"navy"}
    }
    
}

opcoes_atrativos = ["Restaurantes", "Parques de Entretenimento", "Parques Aquáticos", "Pontos Culturais", "Hoteis", "Pontos Turisticos", "Centros de Evento"]

Holidays_Config={
    "Carnaval": {"month":2 , "day": 17, "lower_bound":-2, "upper_bound":1},
    "Páscoa": {"month":4 , "day": 5, "lower_bound":-2, "upper_bound":1},
    "Tiradentes": {"month":4 , "day": 21, "lower_bound":-2, "upper_bound":1},
    "1º de Maio": {"month":5 , "day": 1, "lower_bound":-2, "upper_bound":1},
    "Corpus Christi": {"month":6 , "day": 4, "lower_bound":-2, "upper_bound":1},
    "07 de Setembro": {"month":9 , "day": 7, "lower_bound":-2, "upper_bound":1},
    "12 de Outubro": {"month":10 , "day": 12, "lower_bound":-2, "upper_bound":1},
    "Semana do Saco Cheio": {"month":10 , "day": 15, "lower_bound":-2, "upper_bound":1},
    "02 de Novembro": {"month":11 , "day": 2, "lower_bound":-2, "upper_bound":1},
    "15 de Novembro": {"month":11 , "day": 15, "lower_bound":-2, "upper_bound":1},
    "20 de Novembro": {"month":11 , "day": 20, "lower_bound":-2, "upper_bound":1},
    "Natal": {"month":12 , "day": 25, "lower_bound":-2, "upper_bound":1},
    "Réveillon": {"month":12 , "day": 31, "lower_bound":-2, "upper_bound":1},
    "Festa do Peão de Boiadeira": {"month":8 , "day": 20, "lower_bound":-2, "upper_bound":1}
}
