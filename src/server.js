import express from 'express'
import { Sequelize } from 'sequelize'
import { personSchema } from './helpers/personValidation.js'
import { PersonModel } from './model/person.js'

const app = express()

app.use(express.json())
app.post('/pessoas', async (req, res) => {
  try {
    const input = req.body
    const personExists = await checkIfExists(input)

    if(!input.nome || !input.apelido || personExists) {
      res.sendStatus(422)
    } else {
      const person = await personSchema.validate(input)
      await PersonModel.create(person)
      res.sendStatus(201)
    }
  } catch (error) {
    console.log({
      error
    })
    res.sendStatus(400)
  }
})


app.get('/pessoas/:id', async (req, res) => {
  const person = await PersonModel.findOne({
    where: { id: req.params.id}
  })
  if(person) {
    res.json(person).statusCode(200)
  } else {
    res.sendStatus(404)
  }
})

app.get('/pessoas', async (req, res) => {
  const searchTerm = req.query.t.toLowerCase() 

  if(!searchTerm) {
    res.sendStatus(400)
  } else {

    try {
      const results = await PersonModel.findAll({
        where: {
          [Sequelize.Op.or]: [
            Sequelize.literal(`LOWER("apelido") LIKE '%${searchTerm}%'`),
            Sequelize.literal(`LOWER("nome") LIKE '%${searchTerm}%'`),
            Sequelize.where(Sequelize.fn('array_to_string', Sequelize.col('stack'), ','), {
              [Sequelize.Op.iLike]: `%${searchTerm}%`,
            }),
          ],
        },
        limit: 50
      })
  
      res.status(200).json(results)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
})

app.get('/contagem-pessoas', async (req, res) => {
  const counter = await PersonModel.count()
  res.json({ linesInserted: counter}).status(200)
})

const checkIfExists = async (input) => {
  const person = await PersonModel.findOne({ where: { nome: input.nome }}) 
  return person ? true : false
}

app.listen(3000, () => 'hi, server listening on port 3000')