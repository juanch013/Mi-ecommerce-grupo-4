const express = require('express');
const { cartList, cartEdit } = require('../controllers/cartController');
const {verifyJWT} = require('../middlewares/verifyJWT');

const router = express.Router();
router.use(verifyJWT)
router.get('/:id', cartList);
router.put('/:id', cartEdit);

module.exports = router;