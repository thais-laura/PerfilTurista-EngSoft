import { Info, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  tourismQueryOptions,
  type TourismData,
} from "@/lib/tourism";

import { useEffect, useRef, useState } from "react";

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-2)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];
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
}: {
  placeholder: string;
  opcoes: string[];
}) {
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState("");
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

function ChartCard({ children }: { children: React.ReactNode }) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  return (
    <div className="rounded-md bg-secondary/70 p-4 shadow-sm ring-1 ring-border">
      <div className="mb-3">
        <DropdownBadge
          placeholder="Atributo"
          opcoes={[
            "Perfil de Turista",
            "Renda",
            "Lugares Mais Visitados",
            "Lotação de Parques",
          ]}
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
          opcoes={[
            "Linha",
            "Histograma",
            "Pizza",
          ]}
        />
      </div>

      <div className="rounded bg-card p-3 ring-1 ring-border">
        <div className="h-64 w-full">{children}</div>
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

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  fontSize: 12,
} as const;


// alterar essa parte
function Charts({ data }: { data: TourismData }) {
  return (
    <>
      <SectionTitle>Dados Históricos</SectionTitle>

      <div className="mt-16">
        <ChartCard>
          <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
            Visitantes ao longo do ano
          </p>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={data.visitantesPorMes} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="visitantes"
                stroke="var(--color-chart-4)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-16">
        <SectionTitle>Previsões Históricas</SectionTitle>

          <div>
            <h3 className="mb-4 text-center font-display text-xl font-bold text-foreground">
            </h3>
            <ChartCard>
              <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
              </p>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart
                  data={data.gastoPorSetor}
                  layout="vertical"
                  margin={{ top: 5, right: 16, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 9 }} stroke="var(--color-muted-foreground)" />
                  <YAxis
                    type="category"
                    dataKey="setor"
                    width={70}
                    tick={{ fontSize: 9 }}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="valor" fill="var(--color-chart-1)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
      </div>

        <div className="mt-16">
        <SectionTitle>Previsões com Dados Externos</SectionTitle>

          <div>
            <h3 className="mb-4 text-center font-display text-xl font-bold text-foreground">
            </h3>
            <ChartCard>
              <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
              </p>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart
                  data={data.gastoPorSetor}
                  layout="vertical"
                  margin={{ top: 5, right: 16, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 9 }} stroke="var(--color-muted-foreground)" />
                  <YAxis
                    type="category"
                    dataKey="setor"
                    width={70}
                    tick={{ fontSize: 9 }}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="valor" fill="var(--color-chart-1)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
      </div>
    </>
  );
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-md bg-secondary/60 py-20 text-sm text-muted-foreground ring-1 ring-border">
      {children}
    </div>
  );
}

export function ChartsSection() {
  const { data, isLoading, isError } = useQuery(tourismQueryOptions);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      {isLoading && <StatusMessage>Carregando dados do observatório…</StatusMessage>}
      {isError && (
        <StatusMessage>Não foi possível carregar os dados. Tente novamente.</StatusMessage>
      )}
      {data && <Charts data={data} />}
    </section>
  );
}
