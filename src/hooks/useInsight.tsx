import { useCallback, useEffect, useState } from 'react'

import { buildAIPrompt } from '@/date/aiPrompt'
import { getInsight, type InsightData } from '@/services/aiService'

import { useSimulationStorage } from './useSimulationStorage'

export const useInsight = (id: string) => {
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [isLoading, setISLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { getFormData } = useSimulationStorage()

  const fetchInsight = useCallback(
    async (simulationID: string) => {
      const simulation = getFormData(simulationID)

      if (!simulation) {
        setError('Simulação não encontrada')
        return
      }

      setISLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        setISLoading(false)
      }
    },
    [getFormData],
  )

  useEffect(() => {
    if (insight || isLoading) {
      return
    }

    fetchInsight(id)
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
