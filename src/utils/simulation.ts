import type { SimulationFormData } from '@/date/simulation'

import { parseCurrency } from './currency'

export function calcMonthlySavings(data: SimulationFormData) {
  return parseCurrency(data.income) - parseCurrency(data.expenses) - parseCurrency(data.debts)
}
