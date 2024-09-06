export interface AddSurveyModel {
  question: string
  answers: SurveyAnswers[]
}

export interface SurveyAnswers {
  image: string
  asnwer: string
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
