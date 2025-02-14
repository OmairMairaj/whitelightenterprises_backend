const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Object,
        required: true,
    },
    
    isActive: {
        type: Boolean,
        required: true
    },
  
});

module.exports = mongoose.model('AdminUsers', AdminUserSchema);
