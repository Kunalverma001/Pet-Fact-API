const mongoose = require('mongoose');

const petfactSchema = new mongoose.Schema({
    petType :{
        type : String,
    },
    imageURL :{
        type : String,
    },
    fact :{
        type : String,
    },
    created_At :{
        type : Date,
        default : Date.now,
    },
});

const PetFact = mongoose.model('PetFact', petfactSchema);
module.exports = PetFact;