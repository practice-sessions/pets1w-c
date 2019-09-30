const express = require('express');
/* Include {mergeParams; true} in file where the nested params reside. 
	mergeParams tells apiRouter to merge parameters that are created on 
	this set of routes with the ones from its parents 
*/
const apiRouter = express.Router({ mergeParams: true });

const auth = require('../../../middleware/auth'); 
const { check, validationResult } = require('express-validator');
//const jwt = require('jsonwebtoken');
//const config = require('config'); 

const OwnBio = require('../../../models/v10/OwnBio');
const User = require('../../../models/v1/User');

// @route   POST api/v10/ownbio 
// @desc    Create owner bio data (instance)
// @access  Private
apiRouter.post('/add-ownbio-to-user', 
[ 
  auth, 
  [
    check('contactnumber', 'Confirm contact number please')
      .isNumeric(),
    check('age', 'How old is your pet?')
      .not()
      .isEmpty(),
    check('vetname', 'Your vets name and number is required')
      .not()
      .isEmpty(),
    check('specialneeds', 
      'Briefly provide any special needs info for your pet, if any please')
      .not()
      .isEmpty()
  ] 
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    contactnumber,
    age,
    vetname, 
    specialneeds
  } = req.body;

  const newPet = new Pet({ age });

  // Build owner bio object
  const ownerBioFields = {};

  ownerBioFields.user = req.user.id;

  if(contactnumber) ownerBioFields.contactnumber = contactnumber;
  //if(age) ownerBioFields.age = age;
  if(vetname) ownerBioFields.vetname = vetname;
  if(specialneeds) {
    ownerBioFields.specialneeds = specialneeds
      .split(',')
      .map(specialneed => specialneed.trim());
  }

  try {
    let ownbio = await OwnBio.findOne({ user: req.user.id });

    if (ownbio) {
      // Save new pet
      const pet = await newPet.save();

      // Update owner bio - where it already exists
      ownbio = await OwnBio.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: ownerBioFields, pets },
        { new: true }
      );

      return res.json(ownbio);
    }

    // Create owner bio fields - where it does not already exist
    ownbio = new OwnBio(ownerBioFields);

    // Push pets array onto the owner bio using unshift (not PUSH) so it goes
    // into the beginning rather than at the end so we get the most recent first 
    ownbio.pets.unshift(newPet);

    await ownbio.save();

    res.json(ownbio);
  
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});


module.exports = apiRouter; 