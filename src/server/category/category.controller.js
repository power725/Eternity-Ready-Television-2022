import express from 'express';
import Category from './category.model';

const router = express.Router();

function listCategories() {
	return Category.find({});
}

router.get('/list', function(req, res) {
	listCategories()
		.then(response => res.json({
			success: true,
			categories: response
		}))
		.catch((error) => {
			res.json({
				success: false,
				error: {
					message: error.message
				}
			})
		});
});

export default router;