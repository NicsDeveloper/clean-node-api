import { MissingParamError } from '../../errors'
import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }

  return new ValidationStub()
}

const makeSut = (): ValidationComposite => {
  const validationStub = makeValidationStub()
  return new ValidationComposite([validationStub])
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
