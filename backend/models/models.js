

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
  },
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

// Define the item schema with a reference to the Category model
const itemSchema = new Schema({
  itemCode: {
    type: String,
    required: [true, 'Item code is required'],
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  // Add more fields as needed
});

// Create the Item model
const Item = mongoose.model('Item', itemSchema);

module.exports = {
  Category,
  Item,
};