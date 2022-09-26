require('dotenv').config();
const { sequelize } = require('./api/database/models');
const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const socket = require('./socket');

//Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

socket.connect(server);
const route = express.Router();

const usersRoutes = require('./api/routes/usersRoutes');
const productsRoutes = require('./api/routes/productsRoutes');
const picturesRoutes = require('./api/routes/picturesRoutes');
const cartsRoutes = require('./api/routes/cartRoutes');
const categoryRoutes = require('./api/routes/categoryRoutes');
const usersController = require('./api/controllers/usersController');

//Middlewares
const {
	logErrors,
	clientErrorHandler,
} = require('./api/middlewares/errorHandler');

const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
// app.use(cors());

//Routes
app.use('/api/v1/', route);
route.post('/login', usersController.login);
route.use('/users', usersRoutes);
route.use('/products', productsRoutes);
route.use('/pictures', picturesRoutes);
route.use('/carts', cartsRoutes);
route.use('/category', categoryRoutes);

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Error Handler
app.use(logErrors);
app.use(clientErrorHandler);

//Socket.io
// io.on('connection', (socket) => {
// 	console.log('Socket client connected');
// 	socket.on('disconnect', () => {
// 		console.log('Socket client disconnected');
// 	});

// 	//recibir mensaje de cliente enviar-mensaje
// 	// socket.on('enviar-mensaje', (payload, callback) => {
// 	//   console.log('Mensaje recibido', payload);
// 	//   //enviar mensaje al cliente
// 	//   io.emit('enviar-mensaje', payload);
// 	//   callback('Mensaje recibido');
// 	// });
// 	socket.emit('enviar-mensaje', { mensaje: 'Bienvenido al servidor' });
// });

server.listen(PORT, () => {
	sequelize.sync({ force: false });
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
