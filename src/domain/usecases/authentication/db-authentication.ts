import { type HashComparer } from '../../../data/protocols/criptography/hash-comparer'
import { type TokenGenerator } from '../../../data/protocols/criptography/token-generator'
import { type LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository'
import { type AccountModel } from '../../models/account'
import { type Authentication, type AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authetication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRepository.load(authetication.email)
    if (account) {
      await this.hashCompare.compare(authetication.password, account.password)
      this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
