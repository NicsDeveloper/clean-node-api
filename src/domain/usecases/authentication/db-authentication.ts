import { type HashComparer } from '../../../data/protocols/criptography/hash-comparer'
import { type LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository'
import { type Authentication, type AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer
  ) {}

  async auth (authetication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authetication.email)
    if (account) {
      await this.hashCompare.compare(authetication.password, account.password)
    }
    return null
  }
}
