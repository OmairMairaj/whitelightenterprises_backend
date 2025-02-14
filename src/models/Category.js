
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    catId: {
        type: String,
        required: true,
        unique: true

    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
   
    createdAt: {
        type: Object,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
  
    
})

module.exports = mongoose.model('Category', CategorySchema);