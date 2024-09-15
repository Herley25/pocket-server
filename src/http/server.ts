import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createCompletionGoalRoute } from './routes/create-completion'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Rota para criar uma meta
app.register(createGoalRoute)

// Rota para criar uma conclusão de meta
app.register(createCompletionGoalRoute)

// Rota para pegar as metas pendentes da semana
app.register(getPendingGoalsRoute)

// Rota para pegar o resumo da semana
app.register(getWeekSummaryRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running!')
})
