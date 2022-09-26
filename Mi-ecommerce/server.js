require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./api/database/models');

//Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//Middlewares
const {
  logErrors,
	clientErrorHandler,
} = require('./api/middlewares/errorHandler');

// Carga de jsons
const users = require('./api/data.json/user.json')
const products = require('./api/data.json/products.json')
const categories = require('./api/data.json/categories.json')

const db = require('./api/database/models');
const usersRoutes = require('./api/routes/usersRoutes');
const productsRoutes = require('./api/routes/productsRoutes');
const picturesRoutes = require('./api/routes/picturesRoutes');
const cartsRoutes = require('./api/routes/cartRoutes');
const categoryRoutes = require('./api/routes/categoryRoutes');
const usersController = require('./api/controllers/usersController');
const { mostwanted } = require('./api/controllers/productsController');


const route = express.Router();
const app = express();

app.use(express.json());
// app.use(cors());

//Routes
app.use('/api/v1/', route);
route.post('/login', usersController.login);
route.use('/users', usersRoutes);
route.use('/products', productsRoutes);
route.use('/pictures', picturesRoutes);
route.use('/carts', cartsRoutes);
route.use('/category', categoryRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logErrors);
app.use(clientErrorHandler);

app.listen(process.env.PORT, () => {
	sequelize.sync(
    { force: true }
    ).then(async () => {

		for await (let u of users) {
			await db.User.upsert({
				first_name: u.first_name,
				last_name: u.last_name,
				username: u.username,
				email: u.email,
				password: u.password,
				role: u.role,
				profilpic: u.profilepic,
			});
		}
    
    //devolver un array de los id de usuarios creados
    const users2 = await db.User.findAll({
      attributes: ['user_id']
    })
    const usersMapped = users2.map(user => user.user_id)
  
    //crear por cada id de usuario un carrito 
    for await (let id of usersMapped) {
      await db.Cart.upsert({
        user_id: id,
        cart_id: id
      })
    }

    for await (let category of categories) {
      await db.Category.upsert({
        category_name: category.category_name
      })
    }

    for await (let product of products) {
      await db.Product.upsert({
        price: product.price,
        title: product.title,
        stock: product.stock,
        mostwanted: product.mostwanted,
        category: product.category
      })
    }
        
	});

	console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
