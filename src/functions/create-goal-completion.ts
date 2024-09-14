import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

interface CreateGoalCompletionRequest {
  goalId: string
}

// Função para criar uma conclusão de meta
export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Lista de metas que foram completadas na semana
  // Comom table expression para contar quantas vezes a meta foi completada
  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'), // Conta quantas vezes a meta foi completada, é preciso usar alias para o count
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  // Seleciona as metas criadas até a semana e a quantidade de vezes que foram completadas
  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number), // Retorna 0 caso a meta não tenha sido completada
    }) // Retorno de como as metas serão retornadas
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id)) // Left join para pegar as metas que não foram completadas na semana atual
    .where(eq(goals.id, goalId))
    .limit(1) // Limita a busca para apenas uma meta

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week')
  }

  // Insere a conclusão da meta
  const insertResult = await db
    .insert(goalCompletions)
    .values([{ goalId }])
    .returning()

  const goalCompletion = insertResult[0]

  return {
    goalCompletion,
  }
}
