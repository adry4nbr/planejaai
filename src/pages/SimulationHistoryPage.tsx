import { ExternalLink, Target, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { formatCurrency, parseCurrency } from '@/utils/currency'

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => getAllSimulations())

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Data não disponível'
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return 'Data inválida'
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Histórico de simulações</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe o histórico de seus planos financeiros.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {simulations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <p className="text-muted-foreground">Você ainda não possui simulações salvas.</p>
            <Link
              to="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Fazer nova simulação
            </Link>
          </div>
        ) : (
          simulations.map((sim) => {
            const goalAmountNum = parseCurrency(sim.goalAmount)
            const goalDeadlineNum = parseInt(sim.goalDeadline, 10) || 1
            const monthlySaving = goalAmountNum / goalDeadlineNum

            return (
              <div
                key={sim.id}
                className="bg-card border-border/50 flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Target className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">{sim.goalName}</h3>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(sim.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center justify-between gap-6 px-4 sm:flex-nowrap">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Custo da meta
                    </span>
                    <span className="text-foreground font-semibold">{sim.goalAmount}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Prazo
                    </span>
                    <span className="text-foreground font-semibold">{sim.goalDeadline} meses</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Economia mensal
                    </span>
                    <span className="text-foreground font-semibold">
                      {formatCurrency(monthlySaving)}
                    </span>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                  <button
                    onClick={() => handleDelete(sim.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10"
                    title="Excluir simulação"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <Link
                    to={`/resultado/${sim.id}`}
                    className="border-border text-foreground hover:bg-accent flex h-10 items-center gap-2 rounded-lg border bg-transparent px-4 text-sm font-semibold transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver detalhes
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
