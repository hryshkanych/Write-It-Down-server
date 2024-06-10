const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    },
    textNote: {
        type: String,
        required: false 
    },
    images: {
        type: [String], 
        required: false 
    }
}, { collection: 'Memories' });

const Memory = mongoose.model('Memories', memorySchema, 'Memories');

module.exports = Memory;
