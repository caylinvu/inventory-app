const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
  price: {type: Schema.Types.Decimal128, required: true},
  quantity: {type: Number, required: true},
  image: {type: String, data: Buffer},
});

GameSchema.virtual('url').get(function() {
  return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model('Game', GameSchema);

// add ability to add image

// CREATE IMAGE SCHEMA THAT HAS AN ID AND REFERENCE ON GAME SCHEMA
// CREATE A HIDDEN INPUT THAT REFERENCES THE ID
// ADD BUTTON TO REMOVE FILE

// validate image with custom express validator