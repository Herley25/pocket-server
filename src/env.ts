import z from 'zod'

//# É feito uma validação do tipo de variável que está sendo passada e não deixa passar caso não seja do tipo esperado
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
