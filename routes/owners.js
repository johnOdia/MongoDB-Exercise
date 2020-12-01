const express = require('express')
const router = express.Router({ mergeParams: true })
const Owner = require('./models/owners')
const Pet = require('./models/pets')
const path = require('path')


//LIST ALL OWNERS
router.get('/', async (req, res) => {
    try {
        const allOwners = await Owner.find()
        res.json(allOwners)
    } catch (error) {
        res.send(error.message)
    }
})

//DISPLAY A FORM FOR CREATING A NEW OWNER
router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/newOwner.html'))
})

//DISPLAY A SINGLE OWNER
router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    
    Owner.findById(id, function (err, owner) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(owner);
        }
    });
})

//CREATE AN OWNER WHEN A FORM IS SUBMITTED
router.post('/', async (req, res) => {
    const owner = new Owner({
        name: req.body.name
    })

    try {
        const newOwner = await owner.save()
        res.send(newOwner)
    } catch (error) {
        res.json(error.message)
    }
})

//Edit an owner when a form is submitted
router.patch('/:id', async(req,res) => {
    const id = req.params.id
    try {
       const updatedOwner = await Owner.findByIdAndUpdate(id, req.body)
       res.send('successfully updated!')
    } catch (error) {
        res.send(error.message)
    }
})

//Delete an owner when a form is submitted
router.delete('/:id', async (req,res) => {
    const id = req.params.id
    try {
       await Owner.deleteOne({ _id: { $gte: id } })
       res.send('successfully deleted!')
    } catch (error) {
        res.send(error.message)
    }
})

//display all pets for an owner
router.get("/:owner_id/pets", (req, res, next) => {
    return (
        Owner.findById(req.params.owner_id)
            .populate("pets")
            .exec()
            .then(owner => {
                return res.send(owner);
            })
            .catch(err => res.send(err.message))
    );
});

//Display a form for creating a new pet for an owner
router.get('/:ownerId/pets/new', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/newPet.html'))
})

//Display a single pet for an owner
router.get('/:ownerId/pets/:petId', async (req,res) => {
    const { ownerId, petId } = req.params
    try {
         const owner = await Owner.findById(ownerId)
         .then(owner => {
            Pet.findById(owner.pets.find(Pet._id === petId))
         })
         console.log(owner);
         
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//Create a pet for an owner when a form is submitted
router.post("/:ownerId/pets", (req, res, next) => {
    const newPet = new Pet(req.body);
    const { ownerId } = req.params;
    newPet.owner = ownerId;
    return newPet
        .save()
        .then(pet => {
            return Owner.findByIdAndUpdate(
                ownerId, 
                { $addToSet: { pets: pet._id } }
            );
        })
        .then(() => {
            return res.redirect(`/owners/${ownerId}/pets`);
        })
        .catch(err => res.send(err.message));
});



module.exports = router