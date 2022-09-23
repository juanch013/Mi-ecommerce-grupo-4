const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryControler');
	
router.get('/',categoryController.listCategory);
router.post('/',categoryController.createCategory);
router.delete('/:id',categoryController.deleteCategory);
module.exports = router;