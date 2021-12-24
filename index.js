const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('data', function getId (req,res) {
    if (req.method==='POST'){
           return JSON.stringify(req.body)
    }
    else
      return ''
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
let persons=[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
app.get('/', (request,response) => {
    response.send('<h1>Hello World!</h1>')
  })
app.get('/api/persons',(request,response) => {
    response.json(persons)
  })
app.get('/info',(request,response) => {
    let date = new Date()
    response.send(`<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    </div>`)
})

app.get('/api/persons/:id',(request,response) => {
    let id=Number(request.params.id)
    const personFound=persons.find(person=>person.id===id)
    if (personFound)
        response.json(personFound)
    else
        response.status(404).end()
  })

app.delete('/api/persons/:id',(request,response)=>{
	let id=Number(request.params.id)
	persons=persons.filter(person=>person.id!==id)
	response.status(204).end()
})
app.post('/api/persons',(request,response)=>{
	const id=Math.floor(Math.random()*100000)
	const body = request.body
    if(!body.number){
        return response.status(400).json({error: 'number missing' })
	}
	if(!body.name){
        return response.status(400).json({error: 'name missing' })
	}
	else{
        if(persons.find(person=>person.name===body.name)){
            return response.status(400).json({ error: 'name must be unique' })
        }
        const newPerson = {
            id:id,
            name:body.name,
            number:body.number
        }
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})