import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('GET /surveys', () => {
    it('Should return 403 on load survey without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
  describe('POST /surveys', () => {
    it('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })

    it('Should return 204 with valid token', async () => {
      const result = await accountCollection.insertOne({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123',
        role: 'admin'
      })
      const id = result.insertedId.toHexString()
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne(
        {
          _id: result.insertedId
        },
        {
          $set: {
            accessToken
          }
        })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })
})
