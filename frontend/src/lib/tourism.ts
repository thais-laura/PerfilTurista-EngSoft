// ============================================================================
// Camada de dados do Observatório de Turismo de Olímpia
// ----------------------------------------------------------------------------
// Todos os gráficos são gerados pelo backend (Prophet) e retornados como URL
// de imagem. O frontend apenas envia os parâmetros e exibe a imagem recebida.
// ============================================================================

/** Resposta do endpoint POST /api/v1/forecast/plots */
export interface ForecastPlotResponse {
  plot_id:   string; // hash MD5 único que identifica o plot em cache
  status:    string; // "created"
  image_url: string; // URL completa para buscar a imagem gerada
}

/**
 * Solicita ao backend a geração de um gráfico de previsão.
 * Retorna a URL da imagem PNG pronta para exibição.
 */
export async function fetchForecastPlot(
  startDate: string,
  endDate: string,
  modelName: string
): Promise<ForecastPlotResponse> {
  const res = await fetch("http://localhost:8000/api/v1/forecast/plots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start_date: startDate,
      end_date:   endDate,
      model_name: modelName,
    }),
  });
  if (!res.ok) throw new Error("Falha ao gerar o gráfico");
  return res.json();
}
