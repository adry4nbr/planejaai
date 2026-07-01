import { ExternalLink, Target, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { parseCurrency, formatCurrency } from '@/utils/currency'

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
        <h1 className="text-3xl font-bold text-foreground">Histórico de simulações</h1>
        <p className="mt-2 text-muted-foreground">Acompanhe o histórico de seus planos financeiros.</p>
      </div>

      <div className="flex flex-col gap-4">
        {simulations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Você ainda não possui simulações salvas.</p>
            <Link 
              to="/" 
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
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
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl bg-card p-6 shadow-sm border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{sim.goalName}</h3>
                    <span className="text-xs text-muted-foreground">{formatDate(sim.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center justify-between gap-6 px-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Custo da meta</span>
                    <span className="font-semibold text-foreground">{sim.goalAmount}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Prazo</span>
                    <span className="font-semibold text-foreground">{sim.goalDeadline} meses</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Economia mensal</span>
                    <span className="font-semibold text-foreground">{formatCurrency(monthlySaving)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleDelete(sim.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Excluir simulação"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <Link
                    to={`/resultado/${sim.id}`}
                    className="flex h-10 items-center gap-2 rounded-lg border border-border bg-transparent px-4 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
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
