import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'

// Rota para pegar as metas pendentes da semana
export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()

    return {
      pendingGoals,
    }
  })
}
