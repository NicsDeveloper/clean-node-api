import { type AddAccountRepository, type AccountModel, type AddAccountModel, type Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeEncrypterStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return await new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const hasherStub = makeEncrypterStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = makeFakeAccountData()

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = makeFakeAccountData()

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = makeFakeAccountData()

    const account = await sut.add(accountData)

    expect(account).toEqual(makeFakeAccount())
  })
})
