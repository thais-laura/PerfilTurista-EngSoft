import pandas as pd
import numpy as np
from datetime import timedelta, date
import time
import random
import matplotlib.pyplot as plt

def aplicar_tendencia(opcoes, valor_alvo, peso_alvo=0.80):
    """
    Escolhe um valor da lista de opções de forma probabilística.
    O 'valor_alvo' recebe a maior probabilidade (peso_alvo), e o restante 
    é distribuído uniformemente entre as outras opções, criando tendências em vez de regras fixas.
    """
    pesos = []
    for op in opcoes:
        # Se for uma lista de alvos aceitáveis
        if isinstance(valor_alvo, list):
            if op in valor_alvo:
                pesos.append(peso_alvo / len(valor_alvo))
            else:
                pesos.append((1.0 - peso_alvo) / max(1, (len(opcoes) - len(valor_alvo))))
        # Se for um único alvo
        else:
            if op == valor_alvo:
                pesos.append(peso_alvo)
            else:
                pesos.append((1.0 - peso_alvo) / max(1, (len(opcoes) - 1)))
                
    return random.choices(opcoes, weights=pesos, k=1)[0]

def gerar_dataset_turismo_estatistico(n_registros=5000):
    """
    Gera uma base de dados onde as rotas do fluxograma são tendências estatísticas,
    contemplando todos os campos estruturais das Tabelas 1 e 2.
    """
    
    # Domínios de Dados (Possíveis valores para cada coluna da Tabela 1)
    opcoes_motivo = ["Lazer", "Visitar familiares", "Negócios", "Eventos", "Saúde/Bem-estar"]
    opcoes_acompanhantes = ["Casal", "Família com crianças", "Sozinho", "Grupo de amigos"]
    opcoes_atrativos = ["Restaurantes, parques, saídas à noite", "Parques aquáticos", "Hoteis", "Conhecer pontos turísticos principais", "Participar de eventos da cidade"]
    opcoes_origem = ["São Paulo - SP", "Campinas - SP", "São José do Rio Preto - SP", "Ribeirão Preto - SP", "Goiânia - GO", "Belo Horizonte - MG", "Curitiba - PR"]
    opcoes_escolaridade = ["Ensino Médio", "Superior Incompleto", "Superior Completo", "Pós-graduação"]
    opcoes_ocupacao = ["Empresário/Profissional Liberal", "CLT", "Servidor Público", "Aposentado", "Estudante", "Assalariado"]
    opcoes_renda = ["Até 3 salários mínimos", "3 a 6 salários mínimos", "6 a 10 salários mínimos", "Mais de 10 salários mínimos"]

    # Perfis Latentes (Usados para guiar as tendências de geração)
    perfis_tendencias = {
        "Casal de fim de semana": {
            "Motivo": "Lazer", "Acompanhantes": "Casal", "Gasto_Cat": "Médio/alto",
            "Permanencia_Dias": 2, "Atrativos": "Restaurantes, parques, saídas à noite",
            "Feriados": ["Páscoa", "Tiradentes", "1º de Maio", "07 de Setembro", "02 de Novembro", "15 de Novembro", "Réveillon", "Fim de Semana Comum"]
        },
        "Familia de parques aquaticos": {
            "Motivo": "Lazer", "Acompanhantes": "Família com crianças", "Gasto_Cat": "Médio/alto",
            "Permanencia_Dias": 5, "Atrativos": "Parques aquáticos",
            "Feriados": ["Carnaval", "Páscoa", "Corpus Christi", "12 de Outubro", "Semana do Saco Cheio", "Natal", "Réveillon", "Férias de Janeiro", "Férias de Julho", "Férias de Dezembro"]
        },
        "Turista fiel premium": {
            "Motivo": "Visitar familiares", "Acompanhantes": ["Casal", "Família com crianças"], "Gasto_Cat": "Alto",
            "Permanencia_Dias": 3, "Atrativos": "Hoteis",
            "Feriados": ["Corpus Christi", "12 de Outubro", "Natal", "Réveillon"]
        },
        "Turista Corporativo": {
            "Motivo": "Negócios", "Acompanhantes": "Sozinho", "Gasto_Cat": "Baixo/médio",
            "Permanencia_Dias": 2, "Atrativos": "Hoteis",
            "Feriados": ["Dias Úteis"]
        },
        "Turista econômico": {
            "Motivo": "Visitar familiares", "Acompanhantes": "Família com crianças", "Gasto_Cat": "Baixo/médio",
            "Permanencia_Dias": 7, "Atrativos": "Conhecer pontos turísticos principais",
            "Feriados": ["Carnaval", "1º de Maio", "Tiradentes", "Semana do Saco Cheio", "20 de Novembro", "Festa do Peão de Boiadeira", "Férias de Janeiro", "Férias de Julho", "Férias de Dezembro"]
        },
        "Turista de Evento": {
            "Motivo": "Eventos", "Acompanhantes": ["Grupo de amigos", "Sozinho", "Casal"], "Gasto_Cat": "Médio",
            "Permanencia_Dias": 5, "Atrativos": "Participar de eventos da cidade",
            "Feriados": ["Festa do Peão de Boiadeira"]
        }
    }

    # Tabela 2: Feriados e Datas (Ano Base 2025)
    datas_feriados = {
        "Carnaval": date(2025, 2, 17), "Páscoa": date(2025, 4, 5), "Tiradentes": date(2025, 4, 21),
        "1º de Maio": date(2025, 5, 1), "Corpus Christi": date(2025, 6, 4), "07 de Setembro": date(2025, 9, 7),
        "12 de Outubro": date(2025, 10, 12), "Semana do Saco Cheio": date(2025, 10, 15),
        "02 de Novembro": date(2025, 11, 2), "15 de Novembro": date(2025, 11, 15),
        "20 de Novembro": date(2025, 11, 20), "Natal": date(2025, 12, 25),
        "Réveillon": date(2025, 12, 31), "Festa do Peão de Boiadeira": date(2025, 8, 20)
    }

    def gerar_data_tendencia(feriados_alvo):
        """Gera data de chegada com peso maciço para os períodos de férias."""
        if random.random() < 0.85:
            pesos_feriados = []
            for alvo in feriados_alvo:
                # Pesos ajustados para diluir a concentração pontual de Dezembro
                if alvo in ["Férias de Janeiro", "Férias de Julho"]:
                    pesos_feriados.append(35)
                elif alvo == "Férias de Dezembro":
                    pesos_feriados.append(31) 
                elif alvo in ["Natal", "Réveillon"]:
                    pesos_feriados.append(2) 
                else:
                    pesos_feriados.append(2)
            
            alvo_escolhido = random.choices(feriados_alvo, weights=pesos_feriados, k=1)[0]
            
            if alvo_escolhido == "Dias Úteis":
                d = date(2025, 1, 1) + timedelta(days=random.randint(0, 364))
                while d.weekday() > 4: d += timedelta(days=1)
                return d
            elif alvo_escolhido == "Fim de Semana Comum":
                d = date(2025, 1, 1) + timedelta(days=random.randint(0, 364))
                while d.weekday() not in [4, 5]: d += timedelta(days=1)
                return d
            elif alvo_escolhido == "Férias de Janeiro":
                return date(2025, 1, 1) + timedelta(days=random.randint(0, 30))
            elif alvo_escolhido == "Férias de Julho":
                return date(2025, 7, 1) + timedelta(days=random.randint(0, 30))
            elif alvo_escolhido == "Férias de Dezembro":
                return date(2025, 12, 1) + timedelta(days=random.randint(0, 30))
            else:
                data_base = datas_feriados.get(alvo_escolhido, date(2025, 1, 15))
                return data_base + timedelta(days=random.randint(-2, 1))
        else:
            return date(2025, 1, 1) + timedelta(days=random.randint(0, 364))

    dados = []
    nomes_perfis = list(perfis_tendencias.keys())
    
    # Pesos na seleção dos perfis para garantir que turistas de férias dominem o dataset
    # "Familia de parques aquaticos" e "Turista econômico" são altamente favorecidos
    pesos_perfis = [10, 45, 10, 10, 20, 5] 

    for _ in range(n_registros):
        # 1. Seleciona o perfil latente que guiará as probabilidades
        perfil_guia = random.choices(nomes_perfis, weights=pesos_perfis, k=1)[0]
        tendencia = perfis_tendencias[perfil_guia]
        
        # 2. Gera variáveis da Tabela 1 aplicando probabilidades
        motivo = aplicar_tendencia(opcoes_motivo, tendencia["Motivo"], 0.85)
        acompanhantes = aplicar_tendencia(opcoes_acompanhantes, tendencia["Acompanhantes"], 0.75)
        atrativos = aplicar_tendencia(opcoes_atrativos, tendencia["Atrativos"], 0.80)
        
        # Data de Chegada e Partida
        data_chegada = gerar_data_tendencia(tendencia["Feriados"])
        permanencia_base = tendencia["Permanencia_Dias"]
        permanencia_real = max(1, permanencia_base + random.randint(-1, 2)) 
        data_partida = data_chegada + timedelta(days=permanencia_real)

        # Gasto Médio Diário Contínuo
        gasto_cat = aplicar_tendencia(["Baixo/médio", "Médio", "Médio/alto", "Alto"], tendencia["Gasto_Cat"], 0.80)
        if gasto_cat == "Baixo/médio":
            gasto_numerico = round(random.uniform(100, 250), 2)
            renda_alvo = "Até 3 salários mínimos"
            escolaridade_alvo = "Ensino Médio"
        elif gasto_cat == "Médio":
            gasto_numerico = round(random.uniform(250, 450), 2)
            renda_alvo = "3 a 6 salários mínimos"
            escolaridade_alvo = "Superior Incompleto"
        elif gasto_cat == "Médio/alto":
            gasto_numerico = round(random.uniform(450, 800), 2)
            renda_alvo = "6 a 10 salários mínimos"
            escolaridade_alvo = "Superior Completo"
        else: # Alto
            gasto_numerico = round(random.uniform(800, 2000), 2)
            renda_alvo = "Mais de 10 salários mínimos"
            escolaridade_alvo = "Pós-graduação"

        # Demografia correlacionada com o gasto
        renda = aplicar_tendencia(opcoes_renda, renda_alvo, 0.70)
        escolaridade = aplicar_tendencia(opcoes_escolaridade, escolaridade_alvo, 0.60)
        origem = aplicar_tendencia(opcoes_origem, "São Paulo - SP", 0.40)
        
        # Ocupação correlacionada
        if renda == "Mais de 10 salários mínimos":
            ocupacao = aplicar_tendencia(opcoes_ocupacao, ["Empresário/Profissional Liberal", "Servidor Público"], 0.8)
        else:
            ocupacao = random.choice(opcoes_ocupacao)

        # 3. Montagem do Registro Final
        registro = {
            "Motivo da viagem": motivo,
            "Acompanhantes por faixa etária": acompanhantes,
            "Atrativos visitados": atrativos,
            "Data de chegada": data_chegada,
            "Data de partida": data_partida,
            "Cidade e estado de origem": origem,
            "Grau de escolaridade": escolaridade,
            "Ocupação profissional": ocupacao,
            "Renda familiar": renda,
            "Gasto médio diário em Olímpia": gasto_numerico,
            "Perfil_Latente_Gerador": perfil_guia
        }
        dados.append(registro)

    return pd.DataFrame(dados)

if __name__ == "__main__":
    random.seed(time.time())
    
    # Geração dos dados
    dataset_tabelas = gerar_dataset_turismo_estatistico(n_registros=5000)

    dataset_tabelas.to_csv("dataset_turismo_olimpia.csv", index=False, encoding='utf-8')
    
    # ------------------------------------------------------------
    # Visualização: Gráfico de Série Temporal (Tendência no Ano)

    # Converter a coluna de data para datetime do pandas
    dataset_tabelas['Data de chegada'] = pd.to_datetime(dataset_tabelas['Data de chegada'])
    
    # Agrupar dados por semana para visualizar a sazonalidade sem ruído excessivo de dias individuais
    serie_turistas = dataset_tabelas.groupby(pd.Grouper(key='Data de chegada', freq='W')).size()
    
    # Configuração da figura com o estilo visual da referência
    fig, ax = plt.subplots(figsize=(10, 5))
    
    # Plotagem da linha principal
    ax.plot(serie_turistas.index, serie_turistas.values, color='#6A66D1', linewidth=1.5)
    
    
    # Configuração de eixos e rótulos
    ax.set_ylabel('Quantidade de Turistas', fontsize=14, color='black', labelpad=10)
    ax.set_xlabel('Data', fontsize=14, color='black', labelpad=10)
    ax.tick_params(axis='both', colors='black', labelsize=12)
    
    # Exibir o gráfico
    plt.tight_layout()
    plt.show()