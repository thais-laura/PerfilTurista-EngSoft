import { Info, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchForecastPlot, PlotFilters } from "@/lib/tourism";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Mapeamento rótulo visual → nome técnico do modelo no backend.
// Corresponde ao sufixo dos arquivos em data/models/ (ex: model_casal.json).
// ---------------------------------------------------------------------------
const MODELOS: Record<string, string> = {
  "Casal de fim de semana":       "casal",
  "Família de parques aquáticos": "familia",
  "Turista fiel premium":         "premium",
  "Turista Corporativo":          "corporativo",
  "Turista Econômico":            "economico",
  "Turista de Evento":            "evento",
  "Total":                        "total",
};

// Tipos de gráfico disponíveis para dados históricos.
const TIPOS_GRAFICO = [
  "Quantidade de Turistas por Perfil",
  "Presença dos Perfis por Serviço",
  "Salário de turistas por perfil",
] as const;
type TipoGrafico = (typeof TIPOS_GRAFICO)[number];

// Agrupamentos: chave = rótulo exibido ao usuário, valor = código de frequência do pandas.
const AGRUPAMENTOS: Record<string, string> = {
  "Diariamente": "D",
  "Mensalmente": "MS",
  "Anualmente":  "YS",
};

// Traduz o rótulo de tipoGrafico para o valor de plot_type esperado pela API.
const PLOT_TYPE: Record<string, PlotFilters["plot_type"]> = {
  "Quantidade de Turistas por Perfil": "line",
  "Presença dos Perfis por Serviço":   "pizza",
  "Salário de turistas por perfil":    "columns",
};

// Serviços (atrativos) disponíveis para filtro no gráfico pizza.
const SERVICOS = [
  "Restaurantes",
  "Parques de Entretenimento",
  "Parques Aquáticos",
  "Pontos Culturais",
  "Hoteis",
  "Pontos Turisticos",
  "Centros de Evento",
] as const;

// ---------------------------------------------------------------------------
// DataBadge — botão que abre um <input type="date"> nativo ao ser clicado.
// Props:
//   placeholder — texto exibido enquanto nenhuma data for selecionada.
//   data        — valor atual vindo do pai (controlled component).
//   setData     — função para atualizar o valor no pai.
//   minDate     — limita o calendário a datas a partir deste valor.
// ---------------------------------------------------------------------------
function DataBadge({
  placeholder,
  data,
  setData,
  minDate,
}: {
  placeholder: string;
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  minDate?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o calendário ao clicar fora do componente.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setAberto(!aberto)}
        className="inline-flex items-center gap-2 rounded border border-info/40 bg-card px-3 py-1 text-xs font-medium text-info shadow-sm"
      >
        {data || placeholder}
        <ChevronDown className="h-3 w-3" />
      </button>

      {aberto && (
        <input
          type="date"
          value={data}
          min={minDate}
          onChange={(e) => {
            setData(e.target.value);
            setAberto(false);
          }}
          className="absolute left-0 top-full z-10 mt-2 rounded border bg-card p-2 shadow"
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DropdownBadge — botão que abre uma lista de opções ao ser clicado.
// Props:
//   placeholder — texto exibido enquanto nenhuma opção for selecionada.
//   opcoes      — lista de strings exibidas no menu.
//   valor       — opção atualmente selecionada (vem do pai).
//   setValor    — notifica o pai quando o usuário escolhe uma opção.
// ---------------------------------------------------------------------------
function DropdownBadge({
  placeholder,
  opcoes,
  valor,
  setValor,
}: {
  placeholder: string;
  opcoes: string[];
  valor: string;
  setValor: (v: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setAberto(!aberto)}
        className="inline-flex items-center gap-2 rounded border border-info/40 bg-card px-3 py-1 text-xs font-medium text-info shadow-sm"
      >
        {valor || placeholder}
        <ChevronDown className="h-3 w-3" />
      </button>

      {aberto && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded border bg-card shadow-lg">
          {opcoes.map((opcao) => (
            <button
              key={opcao}
              onClick={() => {
                setValor(opcao);
                setAberto(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              {opcao}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HistoricoCard — cartão para a seção "Dados Históricos".
//
// Filtros disponíveis (em ordem):
//   1. Tipo de gráfico  — sempre visível.
//   2. Data inicial     — sempre visível.
//   3. Data final       — sempre visível.
//   4. Perfil do turista — visível para "Quantidade de Turistas por Perfil"
//                          e "Quantidade de Perfil em Serviço".
//   5. Agrupamento      — visível apenas para "Quantidade de Turistas por Perfil".
//
// A área do gráfico permanece como placeholder até que o backend
// exponha endpoints para dados históricos.
// ---------------------------------------------------------------------------
function HistoricoCard() {
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico | "">("");
  const [dataInicio,  setDataInicio]  = useState("");
  const [dataFim,     setDataFim]     = useState("");
  const [perfilLabel, setPerfilLabel] = useState("");
  const [agrupamento, setAgrupamento] = useState("");
  const [servico,     setServico]     = useState("");

  // Controla visibilidade condicional dos filtros extras.
  const precisaPerfil      = tipoGrafico === "Quantidade de Turistas por Perfil";
  const precisaAgrupamento = tipoGrafico === "Quantidade de Turistas por Perfil";
  const precisaServico     = tipoGrafico === "Presença dos Perfis por Serviço";

  // Limpa os filtros condicionais quando o tipo de gráfico muda,
  // evitando que valores de seleções anteriores contaminem a nova query.
  function handleTipoGrafico(novoTipo: string) {
    setTipoGrafico(novoTipo as TipoGrafico);
    setPerfilLabel("");
    setAgrupamento("");
    setServico("");
  }

  // Verifica se todos os filtros obrigatórios para o tipo escolhido estão preenchidos.
  const filtrosCompletos =
    !!tipoGrafico &&
    !!dataInicio &&
    !!dataFim &&
    (!precisaPerfil      || !!perfilLabel) &&
    (!precisaAgrupamento || !!agrupamento) &&
    (!precisaServico     || !!servico);

  // Monta o objeto filters que será enviado no body do POST.
  // prediction=false diferencia esta chamada das chamadas de previsão (PrevisaoCard).
  const filters: PlotFilters | null = tipoGrafico
    ? {
        plot_type:  PLOT_TYPE[tipoGrafico],
        prediction: tipoGrafico === "Quantidade de Turistas por Perfil" ? false : undefined,
        model:      precisaPerfil  ? (MODELOS[perfilLabel] ?? undefined) : undefined,
        group_by:   precisaAgrupamento ? (AGRUPAMENTOS[agrupamento] || undefined) : undefined,
        service:    precisaServico ? (servico || undefined) : undefined,
      }
    : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["historico-plot", dataInicio, dataFim, tipoGrafico, perfilLabel, agrupamento, servico],
    queryFn:  () => fetchForecastPlot(dataInicio, dataFim, filters!),
    enabled:  filtrosCompletos && filters !== null,
  });

  return (
    <div className="rounded-md bg-secondary/70 p-4 shadow-sm ring-1 ring-border">
      {/* Barra de filtros com quebra de linha automática */}
      <div className="mb-3 flex flex-wrap gap-2">
        {/* 1. Tipo de gráfico — sempre visível, posicionado primeiro */}
        <DropdownBadge
          placeholder="Tipo de gráfico"
          opcoes={[...TIPOS_GRAFICO]}
          valor={tipoGrafico}
          setValor={handleTipoGrafico}
        />

        {/* 2 e 3. Datas — sempre visíveis */}
        <DataBadge
          placeholder="Data inicial"
          data={dataInicio}
          setData={setDataInicio}
        />
        <DataBadge
          placeholder="Data final"
          data={dataFim}
          setData={setDataFim}
          minDate={dataInicio}
        />

        {/* 4. Perfil do turista — condicional */}
        {precisaPerfil && (
          <DropdownBadge
            placeholder="Perfil do turista"
            opcoes={Object.keys(MODELOS)}
            valor={perfilLabel}
            setValor={setPerfilLabel}
          />
        )}

        {/* 5. Agrupamento — condicional, apenas para "Quantidade de Turistas por Perfil" */}
        {precisaAgrupamento && (
          <DropdownBadge
            placeholder="Agrupamento"
            opcoes={Object.keys(AGRUPAMENTOS)}
            valor={agrupamento}
            setValor={setAgrupamento}
          />
        )}

        {/* 6. Serviço — condicional, apenas para "Presença dos Perfis por Serviço" */}
        {precisaServico && (
          <DropdownBadge
            placeholder="Serviço"
            opcoes={[...SERVICOS]}
            valor={servico}
            setValor={setServico}
          />
        )}
      </div>

      {/* Área do gráfico */}
      <div className="rounded bg-card p-3 ring-1 ring-border">
        <div className="flex h-[500px] w-full items-center justify-center">
          {!tipoGrafico || !dataInicio || !dataFim ? (
            <p className="text-center text-xs text-muted-foreground">
              Selecione o tipo de gráfico e o período para visualizar os dados.
            </p>
          ) : !filtrosCompletos ? (
            <p className="text-center text-xs text-muted-foreground">
              Selecione as opções restantes para gerar o gráfico.
            </p>
          ) : isLoading ? (
            <p className="text-center text-sm text-muted-foreground">Gerando gráfico…</p>
          ) : isError ? (
            <p className="text-center text-sm text-destructive">Erro ao gerar gráfico. Tente novamente.</p>
          ) : data ? (
            <img
              src={data.image_url}
              alt="Gráfico de dados históricos"
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PrevisaoCard — cartão para as seções "Previsões Históricas" e
// "Previsões com Dados Externos".
//
// Exibe apenas os filtros referentes a "Quantidade de Turistas por Perfil":
//   1. Perfil do turista
//   2. Data inicial
//   3. Data final
//   4. Agrupamento
//
// Dispara automaticamente o POST ao backend (via useQuery) assim que
// todos os quatro filtros estiverem preenchidos.
// ---------------------------------------------------------------------------
function PrevisaoCard() {
  const [modeloLabel, setModeloLabel] = useState("");
  const [dataInicio,  setDataInicio]  = useState("");
  const [dataFim,     setDataFim]     = useState("");
  const [agrupamento, setAgrupamento] = useState("");

  // Converte o rótulo visual para o nome técnico que o backend espera.
  const modelName = MODELOS[modeloLabel] ?? "";

  // Monta o objeto filters para o POST.
  // prediction=true sinaliza ao backend que é uma chamada de previsão (Prophet).
  const filters: PlotFilters = {
    plot_type:  "line",
    prediction: true,
    model:      modelName || undefined,
    group_by:   agrupamento ? AGRUPAMENTOS[agrupamento] : undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forecast-plot", dataInicio, dataFim, modelName, agrupamento],
    queryFn:  () => fetchForecastPlot(dataInicio, dataFim, filters),
    // Só dispara quando perfil e datas estiverem preenchidos.
    enabled:  !!(dataInicio && dataFim && modelName),
  });

  return (
    <div className="rounded-md bg-secondary/70 p-4 shadow-sm ring-1 ring-border">
      <div className="mb-3 flex flex-wrap gap-2">
        {/* 1. Perfil do turista */}
        <DropdownBadge
          placeholder="Perfil do turista"
          opcoes={Object.keys(MODELOS)}
          valor={modeloLabel}
          setValor={setModeloLabel}
        />

        {/* 2 e 3. Datas */}
        <DataBadge
          placeholder="Data inicial"
          data={dataInicio}
          setData={setDataInicio}
        />
        <DataBadge
          placeholder="Data final"
          data={dataFim}
          setData={setDataFim}
          minDate={dataInicio}
        />

        {/* 4. Agrupamento */}
        <DropdownBadge
          placeholder="Agrupamento"
          opcoes={Object.keys(AGRUPAMENTOS)}
          valor={agrupamento}
          setValor={setAgrupamento}
        />
      </div>

      {/* Área do gráfico */}
      <div className="rounded bg-card p-3 ring-1 ring-border">
        <div className="flex h-[500px] w-full items-center justify-center">
          {!dataInicio || !dataFim || !modelName ? (
            <p className="text-center text-xs text-muted-foreground">
              Selecione o perfil e o período para gerar a previsão.
            </p>
          ) : isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Gerando previsão…
            </p>
          ) : isError ? (
            <p className="text-center text-sm text-destructive">
              Erro ao gerar gráfico. Tente novamente.
            </p>
          ) : data ? (
            <img
              src={data.image_url}
              alt="Gráfico de previsão de turismo"
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionTitle — título visual de cada seção da página.
// ---------------------------------------------------------------------------
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-info text-white">
        <Info className="h-4 w-4" />
      </span>
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChartsSection — componente exportado inserido na página principal.
// Compõe três seções independentes: uma com HistoricoCard e duas com
// PrevisaoCard. Cada instância tem seu próprio estado isolado.
// ---------------------------------------------------------------------------
export function ChartsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mt-16">
        <SectionTitle>Dados Históricos</SectionTitle>
        <HistoricoCard />
      </div>

      <div className="mt-16">
        <SectionTitle>Previsões Históricas</SectionTitle>
        <PrevisaoCard />
      </div>

      <div className="mt-16">
        <SectionTitle>Previsões com Dados Externos</SectionTitle>
        <PrevisaoCard />
      </div>
    </section>
  );
}
