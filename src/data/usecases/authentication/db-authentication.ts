import { type Authentication, type AccountModel, type AuthenticationModel, type HashComparer, type LoadAccountByEmailRepository, type Encrypter, type UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authetication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRepository.load(authetication.email)

    if (account) {
      const isValid = await this.hashCompare.compare(authetication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
