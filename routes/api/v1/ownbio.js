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

const OwnBio = require('../../../models/v1/OwnBio');
const User = require('../../../models/v1/User');

// @route   POST api/v1/ownbio 
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

// @route   GET api/v1/ownbio/named
// @desc    Get current owner's bio data by id 
// @access  Private
apiRouter.get('/named', auth, async (req, res) => {

  try {
    const ownbio = await 
      OwnBio
        .findOne({user: req.user.id})
        .populate('user', ['firstname', 'lastname', 'contactnumber']);// Pull required data from user profile 

        if (!ownbio) {
          return res.status(400).json({msg: 'There is no owner bio data for this user'});
        }

        res.json(ownbio);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
});

// @route   GET api/v1/ownbio/all
// @desc    Get all owners' bio data 
// @access  Private 
apiRouter.get('/all', auth, async (req, res) => {
  try {
    const ownbios = await OwnBio.find().populate('user', ['firstname', 'lastname', 'contactnumber', 'avatar']);
    if (ownbios == 0 ) {
      return res.status(400).json({msg: 'There is no owner bio data!'});
    }
    res.json(ownbios);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
}); 

// @route   GET api/v1/ownbio/user/:user_id
// @desc    Get owner bio data by user id
// @access  Public
apiRouter.get('/user/:user_id', async (req, res) => {
  try {
    const ownbio = await OwnBio
      .findOne({ user: req.params.user_id })
      .populate('user', ['firstname', 'lastname', 'contactnumber', 'avatar']);

      if(!ownbio) 
        return res.status(400).json({ msg: 'No owner bio for this user!' });

    res.json(ownbio);

  } catch (err) {
    console.error(err.message);

    // To minimise chancing of malicious "fishing", or random non-formatted 
    // ObjectId probing in search address params, add if statement to make it
    // more difficult by trying to avoid server error message in the "catch"
    if(err.kind == 'ObjectId') {
      return res.status(400)
        .json({ msg: 'No owner bio for this user!' });
    }

    res.status(500).send('Server error, something went wrong!');
  }
});

// @route   DELETE api/v1/ownbio/delete
// @desc    Delete owner bio data, user, & pets data
// @access  Private
apiRouter.delete('/delete', auth, async (req, res) => {
  try {
    // *** Code. To. Remove owner-users pets here ***

    //Remove owners bio
    await OwnBio.findOneAndRemove({ user: req.user.id });

    // Remove user - we use _id here because user is not a field in user model
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
}); 

// @route   POST api/v1/ownbio/address-to-bio // POST request used, rather than a  
// PUT although we are updating data in an existing collection - personal preference
// @desc    Add address to owner bio data 
// @access  Private 
apiRouter.post('/address-to-bio', 
[ 
  auth, 
  [
    check('house', 'A house name or street number is required please')
      .not()
      .isEmpty(),
    check('postcode', 'A postcode is required please')
      .not()
      .isEmpty(),
    check('city', 'A town or city name is required please')
      .not()
      .isEmpty()
  ] 
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    house,
    street,
    street2,
    postcode,
    city
  } = req.body; 

  const addy = {
    house,
    street,
    street2,
    postcode,
    city
  }

  try {
    // Fetch owner bio to add address 
    const ownbio = await OwnBio.findOne({ user: req.user.id });

    // What if user has no bio?
    if(!ownbio) {
      return res.status(400)
        .json({ msg: 'No owner bio for this user!' }); 
    }

    // Push address array onto the owner bio using unshift (not PUSH) so it goes
    // into the beginning rather than at the end so we get the most recent first 
    ownbio.address.unshift(addy);

    await ownbio.save();

    res.json(ownbio);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }

});

// @route   DELETE api/v1/ownbio/address/:addy_id
// @desc    Delete address from owner bio 
// @access  Private
apiRouter.delete('/address/:addy_id', auth, async (req, res) => {
  try {
    const ownbio = await OwnBio.findOne({ user: req.user.id });

    // To get the right address to remove, get remove index 
    const removeIndex = ownbio.address
      .map(item => item.id)
      .indexOf(req.params.addy_id);
    
    ownbio.address.splice(removeIndex, 1);

    await ownbio.save();

    res.json(ownbio);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
});

// @route   POST api/v1/ownbio/addpet-to-ownbio // POST request used, rather than a  
// PUT although we are updating data in an existing collection - personal preference
// @desc    Create pet, and add to owner bio data
// @access  Private 
apiRouter.post('/addpet-to-ownbio', 
[ 
  auth, 
  [
  /*
    check('firsteverarrivaldate', 'Is this first time pet has been here?')
      .not()
      .isEmpty()
  */ 
    check('age', 'How old is your pet?')
      .not()
      .isEmpty()
  ] 
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const age = req.body.age;

  try {
    const newPet = new Pet({ 
      age,
      ownbio: req.ownbio.id 
    });

    const pet = await newPet.save();

    res.json(pet);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }

  try {
    // Fetch owner bio to add pet data 
    const ownbio = await OwnBio.findOne({ user: req.user.id });
    //const ownbio = await OwnBio.findOne({ pets: req.pet.id }); 

    // What if user has no bio?
    if(!ownbio) {
      return res.status(400)
        .json({ msg: 'No owner bio for this user!' }); 
    }

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