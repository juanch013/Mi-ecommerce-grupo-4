const express = require('express');
const router = express.Router();
const { idByParamsSchema } = require('../schemas/genericSchema');
const categoryController = require('../controllers/categoryControler');
const validatorHandler = require('../middlewares/validatorHandler');
	
router.get('/',categoryController.listCategory);
router.post('/',categoryController.createCategory);
router.delete('/:id',validatorHandler(idByParamsSchema, 'params'),categoryController.deleteCategory);
router.put('/:id',validatorHandler(idByParamsSchema, 'params'),categoryController.updateCategory);
module.exports = router;