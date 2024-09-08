const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => { return JSON.stringify(req.body) });
app.use(morgan((tokens, req, res) => {
	const data = JSON.stringify(req.body);
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms', '-',
		tokens.body(req, res)
	].join(' ');	
}));

let phonebook = [
	{
		"id": "1",
		"name": "Arto Hellas",
		"number": "040-12345"
	},
	{
		"id": "2",
		"name": "Ada Lovelace",
		"number": "39-44-53535235"
	},
	{
		"id": "3",
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
	 "id": "4",
	 "name": "Mary Poppendieck",
	 "number": "39-23-6423122"
	}
];

app.get('/api/phonebook', (request, response) => {
	console.log(phonebook);
	response.json(phonebook);	
});

app.get('/api/phonebook/:id', (request, response) => {
	const id = request.params.id;
	const person = phonebook.find(p => p.id === id);

	console.log(request.body);
	person ? response.json(person) : response.status(404).end();
});

app.delete('/api/phonebook/:id', (request, response) => {
	const id = request.params.id;
	
	console.log(phonebook);
	console.log(typeof id, typeof phonebook[0].id);
	phonebook = phonebook.filter(p => p.id !== id);
	console.log(phonebook);

	response.status(204).end();
});

//const getRandomId = () => Math.floor(Math.random() * (10000 - 1) + 1);
//const generateId = () => {
//	const id = getRandomId();
//	return String(id);
//};

const getLastId = () => Number(phonebook[phonebook.length - 1].id);
const generateStringId = () => String(getLastId() + 1);

app.post('/api/phonebook/', (request, response) => {
	const body = request.body;

	if(!body || (!body.name || !body.number)) {
		return response.status(400).json({
			error: 'name or number is missing'
		});
	}

	const hasSameName = phonebook.some(p => p.name === body.name);

	if (hasSameName) {
		return response.status(400).json({
			error: 'name must be unique'
		});
	}

	const person = {
		id: generateStringId(),
		name: body.name,
		number: body.number
	};

	console.log(person);
	phonebook = phonebook.concat(person);

	response.json(person);
});

app.get('/api/info', (request, response) => {
	const date = new Date();
	response.send(`
		<h1>Phonebook has info for ${phonebook.length} people</h1>
		<p>${date}</p>
	`);
});

app.put(
	'/api/phonebook/:id',
	(request, response) => {
		const id = request.params.id;
		const body = request.body;

		if (!body) return response.status(400).end({ error: 'body is missing' });

		phonebook = phonebook.map(p => p.id !== id ? p : { ...body });

		console.log(body);
		response.json(body);
});

//app.use(morgan('tiny'));

const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
