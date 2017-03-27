/**
 * Created by justin on 2017/3/17.
 */

const mongoose = require('mongoose');
const init = require('./init.json');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	pwd: String
})

const Models = {
	User: mongoose.model('User', userSchema),
	initialized: false
}

const initialize = function () {
	Models.User.find(null, function (err, doc) {
		if (err) {
			console.log(err)
		} else if (!doc.length) {
			console.log('Database opens for the first time...')
			Promise.all(init.map(item => new Models[item.type](item).save()))
				.then(() => console.log('Initialize successfully.'))
				.catch(() => console.log('Something went wrong during initializing.'))
		} else {
			Models.initialized = true
		}
	})
}


mongoose.connect('mongodb://localhost/test-1')
// mongoose.set('debug', true)

const db = mongoose.connection

db.on('error', function () {
	console.log('Database connection error.')
})

db.once('open', function () {
	console.log('The database has connected.')
	initialize()
})

export default Models
