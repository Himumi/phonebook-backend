const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give a password');
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://himumi:${password}@cluster0.19tnr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (process.argv.length === 3) {
	return Phonebook.find({}).then(result => {
		console.log('Phonebook:');
		result.forEach(p => console.log(`${p.name} ${p.number}`));
		mongoose.connection.close();
	});
}

if (process.argv.length < 5) {
	console.log('give name and number');
	process.exit(1);
}

const phoneName = process.argv[3];
const phoneNumber = process.argv[4]
const newPhonebook = new Phonebook({
	name: phoneName,
	number: phoneNumber,
});

newPhonebook.save().then(result => {
	console.log('phonebook saved!');
	mongoose.connection.close();
});
