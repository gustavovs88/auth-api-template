import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'
import fs from 'fs'
import { inject, injectable } from 'inversify'
import path from 'path'
@injectable()
export class MigrationsClient {
  constructor(@inject(Types.Logger) private logger: Logger) {}
  private migrationsHistory = this.getMigrationsHistory()
  private filePath = path.join(__dirname, 'migrations.json')

  public async up() {
    this.logger.info('Starting migrations')
    const migrationsPath = path.join(__dirname, '../')
    const dirContent = fs.readdirSync(migrationsPath, { withFileTypes: true })
    const filesNames = dirContent
      .filter((content) => content.isFile())
      .map((content) => content.name)
    if (!filesNames.length) {
      this.logger.info('No migrations to run')
      return
    }
    const runMigrations = filesNames.filter((filename) => {
      const migration = !this.migrationsHistory.migrations.some((migration) => {
        return migration === filename
      })
      return migration
    })
    if (!runMigrations.length) {
      this.logger.info('No migrations to run')
      return
    }
    runMigrations.forEach(async (migration) => {
      const runnerFile = await import(`${path.join(migrationsPath, migration)}`)
      try {
        await runnerFile.up()
        this.updateMigrationsHistory(runMigrations)
      } catch (error) {
        this.logger.error(`Error on migration: ${error}`)
      }
    })
  }

  private getMigrationsHistory(): { migrations: string[] } {
    const filePath = path.join(__dirname, 'migrations.json')
    const file = fs.readFileSync(filePath).toString()
    return JSON.parse(file)
  }

  private async updateMigrationsHistory(migrations: string[]) {
    const migrationsHistory = this.migrationsHistory
    migrationsHistory.migrations.push(...migrations)
    fs.writeFile(this.filePath, JSON.stringify(migrationsHistory), () => {
      this.logger.info('Migration accomplished')
    })
  }
}
