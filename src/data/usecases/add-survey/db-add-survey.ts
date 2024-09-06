import { type AddSurvey, type AddSurveyModel } from '../../../presentation/protocols'
import { type AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly AddSurveyRepository: AddSurveyRepository) {}
  async add (data: AddSurveyModel): Promise<void> {
    await this.AddSurveyRepository.add(data)
  }
}
