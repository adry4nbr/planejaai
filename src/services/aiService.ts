import type { ChatMessage } from '@/data/simulation'

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

interface GeminiRequestMessage {
  role: 'user' | 'model' | 'system'
  parts: { text: string }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (contents: GeminiRequestMessage[]) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI([{ role: 'user', parts: [{ text: prompt }] }])
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}

export const askEducator = async (
  insight: InsightData,
  history: ChatMessage[],
  newQuestion: string,
) => {
  const contextMessage: GeminiRequestMessage = {
    role: 'user',
    parts: [
      {
        text: `Você é um educador financeiro. Baseado no seguinte diagnóstico financeiro, responda as dúvidas do usuário de forma clara, direta e objetiva. 
Diagnóstico: ${JSON.stringify(insight)}`,
      },
    ],
  }

  const historyContents: GeminiRequestMessage[] = history.map((msg) => {
    const role: GeminiRequestMessage['role'] =
      msg.role === 'user' || msg.role === 'model' || msg.role === 'system'
        ? (msg.role as GeminiRequestMessage['role'])
        : 'user'

    return {
      role,
      parts: [{ text: msg.text }],
    }
  })

  const newQuestionContent: GeminiRequestMessage = {
    role: 'user',
    parts: [{ text: newQuestion }],
  }

  const contents: GeminiRequestMessage[] = [
    contextMessage,
    {
      role: 'model',
      parts: [{ text: 'Entendido. Estou pronto para ajudar com base no diagnóstico fornecido.' }],
    },
    ...historyContents,
    newQuestionContent,
  ]

  const response = await callGeminiAPI(contents)
  return response.candidates[0].content.parts[0].text
}
