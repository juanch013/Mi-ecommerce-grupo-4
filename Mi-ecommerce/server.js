require('dotenv').config();
const express = require('express');
const route = express.Router();
const { sequelize } = require('./api/database/models')
const usersRoutes = require('./api/routes/usersRoutes');
const productsRoutes = require('./api/routes/productsRoutes');
const picturesRoutes = require('./api/routes/picturesRoutes');
const cartsRoutes = require('./api/routes/cartRoutes');
const usersController = require('./api/controllers/usersController');

//Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
//Middlewares
const {logErrors,clientErrorHandler} = require('./api/middlewares/errorHandler');


const app = express();
const PORT = 3000; 

app.use(express.json());

//Routes
app.use('/api/v1/',route);
route.post('/login', usersController.login);
route.use('/users', usersRoutes);
route.use('/products', productsRoutes);
route.use('/pictures', picturesRoutes);
route.use('/carts', cartsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logErrors);
app.use(clientErrorHandler);




app.listen(PORT, () => {
  sequelize.sync({force: false}) 
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
