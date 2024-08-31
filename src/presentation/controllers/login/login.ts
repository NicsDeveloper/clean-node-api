import { badRequest, ok, serverError, unauthorizedError } from '../../helpers/http-helper'
import { type Validation, type Authentication, type Controller, type HttpRequest, type HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorizedError()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
