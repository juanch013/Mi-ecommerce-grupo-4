const express = require('express');
const router = express.Router();
const { idByParamsSchema } = require('../schemas/genericSchema');
const categoryController = require('../controllers/categoryControler');
const validatorHandler = require('../middlewares/validatorHandler');
const rolVerification = require('../middlewares/rolVerification');	
const { verifyJWT } = require('../middlewares/verifyJWT');
router.use(verifyJWT);

router.get('/',rolVerification.generic,categoryController.listCategory);
router.post('/',rolVerification.admin,categoryController.createCategory);
router.delete('/:id',rolVerification.admin,validatorHandler(idByParamsSchema, 'params'),categoryController.deleteCategory);
router.put('/:id',rolVerification.admin,validatorHandler(idByParamsSchema, 'params'),categoryController.updateCategory);
module.exports = router;