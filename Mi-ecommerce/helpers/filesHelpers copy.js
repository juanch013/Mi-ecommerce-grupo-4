const db = require('../api/database/models');

//retorna un array de objetos literales con los usuarios del sistema
const getUsers = (next) => {
	try {
		let usersToParse = fs.readFileSync('./api/data/user.json');
		return JSON.parse(usersToParse);
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

//se le pasa un id de categoria y si existe devuelve true sino false
const existeCat = (id)=>{
	let cat = db.Category.findByPk(id);

	if(cat){
		return true;
	}

	return false;
}

module.exports = {
	existeCat,
  eliminarPicturesDeProduct,
  ordenarProductos,
  getPicturesFromProduct,
  getUsers,
};
