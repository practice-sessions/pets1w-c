const express = require('express');
const apiRouter = express.Router(); 

const auth = require('../../../middleware/auth'); 
const { check, validationResult } = require('express-validator');

const Pet = require('../../../models/v10/Pet');
const OwnBio = require('../../../models/v10/OwnBio');
const User = require('../../../models/v1/User');


// @route   POST api/v10/pets/add-petbio
// @desc    Add pet bio to pet data
// @access  Private 
apiRouter.post('/add-petbio', 
[
  auth, 
  [
    check('petname', 'Please enter pet name')
      .not()
      .isEmpty(),
    check('pettype', 'Please enter pet type')
      .not()
      .isEmpty(),
    check('petbreed', 'Please enter pet breed')
      .not()
      .isEmpty()
  ]
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const {
      petname,
      pettype,
      petbreed
    } = req.body;

    const petbio = {
      petname,
      pettype,
      petbreed
    };

    // Fetch pet object to add pet bio data 
    let pet = await Pet.findOneAndUpdate(
      { pet: req.params.id },
      { $addToSet: 
        { 
          petbio 
        }  
      },
      { new: true }
    ); 

     res.json(pet);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }

});



module.exports = apiRouter; 