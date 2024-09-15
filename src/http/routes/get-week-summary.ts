import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../../functions/get-week-summary'

// Rota para pegar o resumo da semana
export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', async () => {
    const { summary } = await getWeekSummary()

    return {
      summary,
    }
  })
}
