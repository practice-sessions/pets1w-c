const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema - "OwnBio" == pet owner bio
const OwnBioSchema = new Schema({
	user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
	},
	contactnumber: {
		type: String,
		required: true 
  },
  address: [
		{
			house: {
				type: String,
				required: true 
      },
      street: {
				type: String,
				//required: 'A street name is required please'
      }, 
      street2: {
        type: String
      },
      postcode: {
				type: String,
				required: true 
      },
      city: {
				type: String,
				required: true 
      },
		}
	],
	// Array type, make it easier to process CSV's 
	specialneeds: {
		type: [String],
		required: true 
	},
	vetname: {
		type: String,
		required: true
	},
	pets: [
		{
			// Array allows possibility of more than one pet
			type: Schema.Types.ObjectId,
			ref: 'pet'
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});
 
module.exports = OwnBio = mongoose.model('ownbio', OwnBioSchema); 