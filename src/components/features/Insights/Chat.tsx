import { Bot, Send, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { ChatMessage, SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { askEducator, type InsightData } from '@/services/aiService'

interface ChatProps {
  simulationId: string
  insight: InsightData
}

export function Chat({ simulationId, insight }: ChatProps) {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const simulation = getFormData(simulationId)
  const initialHistory = simulation?.chatHistory || []

  const [history, setHistory] = useState<ChatMessage[]>(initialHistory)
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isLoading])

  const handleSend = async () => {
    if (!question.trim()) return

    const newQuestion = question.trim()
    const newHistory: ChatMessage[] = [...history, { role: 'user', text: newQuestion }]

    setHistory(newHistory)
    setQuestion('')
    setIsLoading(true)
    setError(null)

    try {
      const answerText = await askEducator(insight, history, newQuestion)

      const finalHistory: ChatMessage[] = [...newHistory, { role: 'model', text: answerText }]
      setHistory(finalHistory)

      if (simulation) {
        updateSimulation(simulationId, {
          ...simulation,
          chatHistory: finalHistory,
        } as SimulationRecord)
      }
    } catch {
      setError('Erro ao obter a resposta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-border pt-4">
      <div 
        className="flex max-h-64 flex-col overflow-y-auto pr-2 scrollbar-thin [scrollbar-color:var(--border)_transparent] divide-y divide-border/50"
      >
        {history.map((msg, idx) => (
          <div key={idx} className="py-4 first:pt-0 flex flex-col">
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end self-end text-right' : 'items-start self-start text-left'}`}>
            <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'user' ? (
                <>
                  <User className="text-primary h-4 w-4" />
                  <span className="text-primary text-xs font-semibold">Você</span>
                </>
              ) : (
                <>
                  <Bot className="text-primary h-4 w-4" />
                  <span className="text-primary text-xs font-semibold">Resposta da IA</span>
                </>
              )}
            </div>
            {msg.role === 'user' ? (
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{msg.text}</p>
            ) : (
              <div className="text-sm leading-relaxed text-muted-foreground [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>h3]:font-bold [&>h3]:mt-3 [&>h3]:mb-1 [&>h3]:text-foreground">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="py-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Bot className="text-primary h-4 w-4 animate-pulse" />
              <span className="text-primary animate-pulse text-xs font-semibold">
                Educador digitando...
              </span>
            </div>
          </div>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-border bg-background focus-within:ring-primary/20 flex items-center gap-2 rounded-lg border p-2 focus-within:ring-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Quais são os investimentos mais seguros para minha renda aumentar?"
          className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !question.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
