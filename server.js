const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));

app.get('/', (req, res) => {
	res.send('Hello World');
});

const PORT = 3005;
app.listen(PORT, () => {
	console.log('Server is running on port 3005');
});
