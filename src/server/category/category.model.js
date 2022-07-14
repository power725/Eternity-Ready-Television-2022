const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: {
		type: String
	},
	channels: [{
		type: Schema.Types.ObjectId,
		ref: 'Channel'
	}]
});

const Category = mongoose.model('Category', CategorySchema);

//export default Category;
module.exports = Category;