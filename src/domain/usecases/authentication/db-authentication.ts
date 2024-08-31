import { type LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository'
import { type Authentication, type AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authetication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authetication.email)
    return null
  }
}
