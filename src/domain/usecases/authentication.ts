export type AuthenticationModel = {
  email: string
  password: string
}

export interface Authentication {
  auth: (authetication: AuthenticationModel) => Promise<string>
}
