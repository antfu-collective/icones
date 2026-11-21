import type { Prediction } from 'gpu-icons-search'

type PredictFn = (query: string, signal: AbortSignal) => Promise<Prediction[]>

let loading: Promise<PredictFn> | undefined

async function loadPredictor(): Promise<PredictFn> {
  const { createPredictor, isSupported } = await import('gpu-icons-search')
  if (isSupported()) {
    try {
      const predictor = await createPredictor()
      return (query, signal) => predictor.predict(query, { signal })
    }
    catch (error) {
      console.warn('[icones] WebGPU search model failed to load, using the alias table', error)
    }
  }
  const { loadAliasTable, predictFromTable } = await import('gpu-icons-search/fallback')
  const table = await loadAliasTable()
  return async query => predictFromTable(table, query)
}

/**
 * Predict icon words related to the query, with the WebGPU model of `gpu-icons-search`.
 * Without WebGPU, it uses the static alias table of the package.
 * It loads the model on the first call, and resolves to no predictions if loading fails.
 */
export async function predictWords(query: string, signal: AbortSignal): Promise<Prediction[]> {
  loading ??= loadPredictor()
  let predict: PredictFn
  try {
    predict = await loading
  }
  catch (error) {
    console.warn('[icones] Search predictions are not available', error)
    loading = Promise.resolve(async () => [])
    return []
  }
  return predict(query, signal)
}
