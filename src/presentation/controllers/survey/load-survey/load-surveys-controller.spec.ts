import { LoadSurveysController } from './load-surveys-controller'
import { type LoadSurveys, type SurveyModel } from './load-surveys-controller-protocols'
import mockdate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_-id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })

  afterAll(() => {
    mockdate.reset()
  })
  it('Should call LoadSurveys', async () => {
    class LoadSurveyStub implements LoadSurveys {
      async load (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveyStub = new LoadSurveyStub()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    const sut = new LoadSurveysController(loadSurveyStub)
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
