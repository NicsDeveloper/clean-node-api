import { type Decrypter } from '../../../data/protocols/criptography/decrypter'
import { type Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  decrypt: (value: string) => Promise<string>

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
