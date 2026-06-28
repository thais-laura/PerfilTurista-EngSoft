// ============================================================================
// Camada de dados do Observatório de Turismo de Olímpia
// ----------------------------------------------------------------------------
// Todos os gráficos são gerados pelo backend e retornados como URL de imagem.
// O frontend monta os filtros e exibe a imagem recebida.
// ============================================================================

/** Resposta do endpoint POST /api/v1/forecast/plots */
export interface ForecastPlotResponse {
  plot_id:   string; // hash MD5 único que identifica o plot em cache
  status:    string; // "created"
  image_url: string; // URL completa para buscar a imagem gerada
}

/**
 * Filtros enviados dentro do body da requisição.
 *
 * plot_type   — tipo de visualização: "line" | "columns" | "pizza"
 * prediction  — true quando a chamada vem de PrevisaoCard (Prophet forecast),
 *               false quando vem de HistoricoCard (dados históricos).
 *               Enviado apenas para gráficos do tipo "line" (Quantidade de Turistas).
 * model       — nome técnico do perfil de turista (ex: "casal", "total").
 *               Enviado apenas para gráficos do tipo "line".
 * group_by    — agrupamento temporal: "Diariamente" | "Mensalmente" | "Anualmente".
 *               Enviado apenas para gráficos do tipo "line".
 */
export interface PlotFilters {
  plot_type:   "line" | "columns" | "pizza";
  prediction?: boolean;
  model?:      string;
  group_by?:   string;
}

/**
 * Solicita ao backend a geração de um gráfico.
 * Retorna a URL da imagem PNG pronta para exibição.
 *
 * startDate - Data inicial no formato YYYY-MM-DD
 * endDate   - Data final no formato YYYY-MM-DD
 * filters   - Configurações do gráfico (tipo, modelo, agrupamento, previsão)
 */
export async function fetchForecastPlot(
  startDate: string,
  endDate:   string,
  filters:   PlotFilters
): Promise<ForecastPlotResponse> {
  const res = await fetch("http://localhost:8000/api/v1/forecast/plots", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start_date: startDate,
      end_date:   endDate,
      filters,
    }),
  });
  if (!res.ok) throw new Error("Falha ao gerar o gráfico");
  return res.json();
}
