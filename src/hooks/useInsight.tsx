import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { getInsight, type InsightData } from '@/services/aiService'

import { useSimulationStorage } from './useSimulationStorage'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()
  const [isLoading, setISLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      return simulation.insight
    }

    return null
  })

  const fetchInsight = useCallback(
    async (simulationID: string) => {
      const simulation = getFormData(simulationID)

      if (!simulation) {
        setError('Simulação não encontrada')
        return
      }

      isRequestPending.current = true
      setISLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)

        updateSimulation(simulationID, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setISLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    if (insight || isLoading || error || isRequestPending.current) {
      return
    }

    fetchInsight(id)
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
