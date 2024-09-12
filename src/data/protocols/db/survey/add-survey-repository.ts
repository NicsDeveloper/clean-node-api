import { type AddSurveyModel } from '@/presentation/protocols'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
