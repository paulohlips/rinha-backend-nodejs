import express from 'express'
import { personSchema } from './helpers/personValidation.js'
import { PersonModel } from './model/person.js'

const app = express()
const people = []

app.use(express.json())

const checkIfExists = (person) => {
  return people.some(p => (p.nome === person.nome))
}

const findPersonById = (id) => {
  return people.find(p => (p.id === id))
}

const searchTerm = (term) => {
  return people.filter(p => {
    const lowerCaseTerm = term.toLowerCase()
    const nickName = p.apelido.toLowerCase()
    const name = p.nome.toLowerCase()

    return (
      nickName.includes(lowerCaseTerm) ||
      name.includes(lowerCaseTerm) ||
      p.stack.some(item => item.toLowerCase().includes(lowerCaseTerm))
    )
  })
}

app.post('/pessoas', async (req, res) => {
  try {
    const input = req.body
    if(!input.nome || !input.apelido || checkIfExists(input)) {
      res.sendStatus(422)
    } else {
      const person = await personSchema.validate(input)
      console.log(person)
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

app.get('/pessoas/:id', (req, res) => {
  const person = findPersonById(req.params.id)
  if(person) {
    res.json(person).statusCode(200)
  }
  res.sendStatus(404)
})

app.get('/pessoas', (req, res) => {
  const term = req.query.t
  
  if(!term) {
    res.sendStatus(400)
  } else {
    res.send(searchTerm(req.query.t))
  }
})

app.get('/contagem-pessoas', (req, res) => {
  res.send(people)
  res.status(200)
})

app.listen(3000, () => 'hi, server listening on port 3000')