import { GameState, LifestyleLevel, LifestyleState, SpendingStyle, WealthBand } from '../types';

export interface FinancialPressureInput {
  cash: number;
  income?: number;
  expenses?: number;
  careerStability?: number;
}

/** Cash remains authoritative; this is only a derived identity label. */
export function getWealthBand(cash: number): LifestyleLevel {
  if (cash < 1_000) return 'struggling';
  if (cash < 5_000) return 'lower_class';
  if (cash < 100_000) return 'middle_class';
  if (cash < 1_000_000) return 'wealthy';
  if (cash < 10_000_000) return 'rich';
  return 'elite';
}

export function calculateFinancialStress(input: FinancialPressureInput): number {
  const cash = Math.max(0, input.cash || 0);
  const income = Math.max(0, input.income || 0);
  const expenses = Math.max(0, input.expenses || 0);
  const stability = Math.max(0, Math.min(100, input.careerStability ?? 50));
  const monthlyBuffer = income - expenses;
  let stress = cash < 1_000 ? 55 : cash < 5_000 ? 35 : cash < 25_000 ? 18 : 5;
  if (expenses > income && expenses > 0) stress += Math.min(35, Math.round(((expenses - income) / expenses) * 35));
  if (monthlyBuffer < 0) stress += 10;
  if (stability < 35) stress += Math.round((35 - stability) / 2);
  if (cash >= 100_000) stress -= 12;
  return Math.max(0, Math.min(100, Math.round(stress)));
}

function spendingStyle(level: LifestyleLevel, stress: number): SpendingStyle {
  if (stress >= 65 || level === 'struggling') return 'survival';
  if (level === 'lower_class') return 'careful';
  if (level === 'middle_class') return 'balanced';
  if (level === 'wealthy') return 'discretionary';
  if (level === 'rich') return 'luxury';
  return 'exclusive';
}

export function deriveLifestyle(state: Pick<GameState, 'cash' | 'career' | 'flags'>): LifestyleState {
  const level = getWealthBand(state.cash || 0);
  const income = Math.max(0, state.career?.salary || 0);
  const expenses = typeof state.flags?.annualExpenses === 'number' ? state.flags.annualExpenses : Math.floor(income * 0.25);
  const performance = state.career?.type === 'job' ? state.career.performance ?? 50 : 50;
  const stability = state.career?.type === 'unemployed' ? 10 : performance;
  const financialStress = calculateFinancialStress({ cash: state.cash, income, expenses, careerStability: stability });
  return { lifestyleLevel: level, spendingStyle: spendingStyle(level, financialStress), financialStress };
}

export function refreshLifestyle(state: GameState): LifestyleState {
  state.lifestyle = deriveLifestyle(state);
  return state.lifestyle;
}

/** Compatibility aliases for older narrative variants. */
export function wealthBandMatches(actual: LifestyleLevel, requested: WealthBand): boolean {
  if (requested === 'stable') return actual === 'lower_class' || actual === 'middle_class';
  if (requested === 'comfortable') return actual === 'wealthy';
  return requested === actual;
}
