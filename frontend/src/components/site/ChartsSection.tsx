import { Info, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchForecastPlot } from "@/lib/tourism";

import { useEffect, useRef, useState } from "react";

// Mapeamento entre o rótulo exibido no dropdown e o nome técnico do modelo
// no backend (corresponde ao sufixo dos arquivos em data/models/).
const MODELOS: Record<string, string> = {
  "Casal de fim de semana":     "casal",
  "Família de parques aquáticos": "familia",
  "Turista fiel premium":        "premium",
  "Turista Corporativo":         "corporativo",
  "Turista Econômico":           "economico",
  "Turista de Evento":           "evento",
  "Total":                       "total",
};

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
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
          className="absolute left-0 top-full mt-2 rounded border bg-card p-2 shadow z-10"
        />
      )}
    </div>
  );
}

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
  // estado removido daqui — agora vem via props (valor/setValor)
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="absolute left-0 top-full mt-2 w-40 rounded border bg-card shadow-lg z-10">
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

function ChartCard() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  // rótulo visual selecionado pelo usuário
  const [modeloLabel, setModeloLabel] = useState("");
  // tipoGrafico não influencia a query ainda, mas já é controlado pelo pai
  const [tipoGrafico, setTipoGrafico] = useState("");

  // Converte o rótulo visual para o nome técnico que o backend espera
  const modelName = MODELOS[modeloLabel] ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forecast-plot", dataInicio, dataFim, modelName],
    queryFn: () => fetchForecastPlot(dataInicio, dataFim, modelName),
    // só dispara quando os três campos estiverem preenchidos
    enabled: !!(dataInicio && dataFim && modelName),
  });

  return (
    <div className="rounded-md bg-secondary/70 p-4 shadow-sm ring-1 ring-border">
      <div className="mb-3">
        <DropdownBadge
          placeholder="Tipo de Turista"
          opcoes={Object.keys(MODELOS)}
          valor={modeloLabel}
          setValor={setModeloLabel}
        />

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

        <DropdownBadge
          placeholder="Tipo de gráfico"
          opcoes={["Linha", "Histograma", "Pizza"]}
          valor={tipoGrafico}
          setValor={setTipoGrafico}
        />
      </div>

      <div className="rounded bg-card p-3 ring-1 ring-border">
        <div className="h-64 w-full flex items-center justify-center">
          {!dataInicio || !dataFim || !modelName ? (
            <p className="text-center text-xs text-muted-foreground">
              Selecione o atributo e o período para gerar a previsão.
            </p>
          ) : isLoading ? (
            <p className="text-center text-sm text-muted-foreground">Gerando previsão…</p>
          ) : isError ? (
            <p className="text-center text-sm text-destructive">Erro ao gerar gráfico. Tente novamente.</p>
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

export function ChartsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mt-16">
        <SectionTitle>Dados Históricos</SectionTitle>
        <ChartCard />
      </div>

      <div className="mt-16">
        <SectionTitle>Previsões Históricas</SectionTitle>
        <ChartCard />
      </div>

      <div className="mt-16">
        <SectionTitle>Previsões com Dados Externos</SectionTitle>
        <ChartCard />
      </div>
    </section>
  );
}
