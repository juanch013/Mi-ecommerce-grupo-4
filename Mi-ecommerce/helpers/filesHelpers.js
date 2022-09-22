const fs = require('fs');

//retorna un array de objetos literales con los productos del sistema
const getProducts = (next) => {
	try {
		let productsToParse = fs.readFileSync('./api/data/products.json');
		return JSON.parse(productsToParse);
	} catch (error) {
		next(error);
	}
};

//retorna un array de objetos literales con los usuarios del sistema

const getUsers = (next) => {
	try {
		let usersToParse = fs.readFileSync('./api/data/user.json');
		return JSON.parse(usersToParse);
	} catch (error) {
		next(error);
	}
};

//retorna un array de objetos literales con las imagenes del sistema
const getImages = (next) => {
	try {
		let picturesToParse = fs.readFileSync('./api/data/pictures.json', 'utf-8');
		return JSON.parse(picturesToParse);
	} catch (error) {
		next(error);
	}
};

//recibe por parametro el id del producto y recibe todas las pictures ue tiene asiganda este producto
const getPicturesFromProduct = (id, next) => {
	let pictures = getImages(next);
	let picturesProduct = pictures.filter((p) => p.productId == id);
	return picturesProduct;
};

//recibe un array de objetos literales con todos las imagenes del sistema, los transforma a un
//string en formato json y los guarda en el archivo pictures.json
const guardarPictures = (arr, next) => {
	try {
		fs.writeFileSync('./api/data/pictures.json', JSON.stringify(arr));
	} catch (error) {
		next(error);
	}
};

//recibe un array de objetos literales con todos los usuarios del sistema, los transforma a un
//string en formato json y los guarda en el archivo users.json

const guardarUsers = (arr, next) => {
	try {
		fs.writeFileSync('./api/data/user.json', JSON.stringify(arr));
	} catch (error) {
		next(error);
	}
};

//recibe un array de objetos literales con todos los productos del sistema, los transforma a un
//string en formato json y los guarda en el archivo products.json
const guardarProducts = (arr, next) => {
	try {
		fs.writeFileSync('./api/data/products.json', JSON.stringify(arr));
	} catch (error) {
		next(error);
	}
};

//recibe un array de objetos literales y lo ordena en orden ascendente segun su id
const ordenarProductos = (arr) => {
	arr.sort((a, b) => {
		return Number(a.id) - Number(b.id);
	});

	return arr;
};

//recibe un id del producto del cual queremos eliminar las imagenes,
//filtra las imagenes del sistema eliminando las imagenes con el product-id pasado por param
const eliminarPicturesDeProduct = (id, next) => {
	try {
		let pictures = getImages(next);
		pictures = pictures.filter((p) => {
			return p.productId != id;
		});
		guardarPictures(pictures);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getProducts,
	getUsers,
	getImages,
	getPicturesFromProduct,
	guardarProducts,
	guardarPictures,
	guardarUsers,
	eliminarPicturesDeProduct,
	ordenarProductos,
};
