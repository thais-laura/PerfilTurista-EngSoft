// ============================================================================
// Camada de dados do Observatório de Turismo de Olímpia
// ----------------------------------------------------------------------------
// Todos os dados dos gráficos passam por aqui. Hoje retornam valores de exemplo
// (mock). Quando o backend estiver pronto, basta trocar o corpo de
// `fetchTourismData` por uma chamada real (fetch / server function) que
// devolva um objeto no formato `TourismData`. Os componentes de gráfico não
// precisam mudar.
// ============================================================================

export interface VisitorPoint {
  mes: string;
  visitantes: number;
}

export interface SegmentSlice {
  name: string;
  value: number; // percentual (0-100)
}

export interface SectorSpend {
  setor: string;
  valor: number; // em reais (R$)
}

export interface MonthSpend {
  mes: string;
  gasto: number; // em reais (R$)
}

export interface TourismData {
  /** Lugares mais visitados — visitantes ao longo do ano */
  visitantesPorMes: VisitorPoint[];
  /** Impacto dos órgãos por segmento de turismo (%) */
  impactoPorSegmento: SegmentSlice[];
  /** Média de gasto por setor (R$) */
  gastoPorSetor: SectorSpend[];
  /** Média de gasto por mês (R$) */
  gastoPorMes: MonthSpend[];
}

// ----------------------------------------------------------------------------
// Dados de exemplo (substituídos pelos dados reais do banco posteriormente)
// ----------------------------------------------------------------------------
export const mockTourismData: TourismData = {
  visitantesPorMes: [
    { mes: "Jan", visitantes: 420 },
    { mes: "Fev", visitantes: 380 },
    { mes: "Mar", visitantes: 460 },
    { mes: "Abr", visitantes: 410 },
    { mes: "Mai", visitantes: 300 },
    { mes: "Jun", visitantes: 150 },
    { mes: "Jul", visitantes: 520 },
    { mes: "Ago", visitantes: 470 },
    { mes: "Set", visitantes: 430 },
    { mes: "Out", visitantes: 490 },
    { mes: "Nov", visitantes: 460 },
    { mes: "Dez", visitantes: 540 },
  ],
  impactoPorSegmento: [
    { name: "Thermas", value: 42 },
    { name: "Eventos", value: 23 },
    { name: "Gastronomia", value: 15 },
    { name: "Cultura", value: 12 },
    { name: "Outros", value: 8 },
  ],
  gastoPorSetor: [
    { setor: "Hospedagem", valor: 1842000 },
    { setor: "Alimentação", valor: 1340000 },
    { setor: "Atrativos", valor: 1100000 },
    { setor: "Transporte", valor: 1090000 },
    { setor: "Compras", valor: 660000 },
  ],
  gastoPorMes: [
    { mes: "Jan", gasto: 320 },
    { mes: "Fev", gasto: 290 },
    { mes: "Mar", gasto: 480 },
    { mes: "Abr", gasto: 220 },
    { mes: "Mai", gasto: 380 },
    { mes: "Jun", gasto: 610 },
  ],
};

/**
 * Busca os dados do observatório.
 *
 * TODO (backend): trocar o retorno mock por algo como:
 *
 *   const res = await fetch("/api/tourism");
 *   if (!res.ok) throw new Error("Falha ao carregar dados");
 *   return (await res.json()) as TourismData;
 *
 * O formato de resposta deve seguir a interface `TourismData`.
 */
export async function fetchTourismData(): Promise<TourismData> {
  return mockTourismData;
}

/** Opções prontas para uso com TanStack Query. */
export const tourismQueryOptions = {
  queryKey: ["tourism-data"] as const,
  queryFn: fetchTourismData,
};
