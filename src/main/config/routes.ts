import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  // Ler os arquivos da pasta 'routes'
  readdirSync(path.join(__dirname, '..', 'routes')).map(async file => {
    // Ignorar arquivos de teste e arquivos .map
    if (!file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.js'))) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
