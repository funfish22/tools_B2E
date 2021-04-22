const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    data: {
        type: Object
    }
});

module.exports = List = mongoose.model('list', ListSchema);