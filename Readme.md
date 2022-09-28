## Objetivos del Proyecto

- Utilizando Node.js y Express desarrollar los endpoints para 

## Comenzando

1. Instalar mysql y crear base de datos llamada `mi_ecommerce_4`.
2. Clonar el repositorio de GitHub.
3. Instalar las dependencias con `npm install`.
4. Crear un archivo .env dentro de la carpeta Mi-ecommerce para la conexión a la base de datos con la siguiente forma:

```
   DB_PASS= contraseña de usuario de mysql
   DB_USER= usuario de mysql
   DB_NAME= mi_ecommerce_4
   SECRETORPRIVATEKEY= clave secreta para la generacion de JWT(a su eleccion)
   PORT= puerto en el que se va a escuchar
``` 

5. Correr el servidor con `npm start`.
6. Descomentar la linea 57 en el archivo server.js en la primera ejecucion del servidor para que 
   cree las tablas y relaciones de la base de datos , luego volver a comentarla para que no 
   la cree cada vez que se ejecute/levante el servidor

7. realizar la carga de datos de prueba:
   la carga de datos se puede realizar mediante una peticion post a la ruta http://localhost:3000/api/v1/cargar con el body vacio.
   o sino a traves del swagger, corriendo la primera ruta documentada, para ingresar al swagger , ingresar a la ruta http://localhost:3000/api-docs/ por el navegador


                      oo0oo
                     o8888888o
                     88" . "88
                     (| -_- |)
                     0\  =  /0
                   _/`---'\___
                 .' \\|     |// '.
                / \\|||  :  |||// \
               / _||||| -:- |||||- \
              |   | \\\  -  /// |   |
              | \_|  ''\---/''  |_/ |
               \  .-\__  '-'  _/-. /
              _'. .'  /--.--\  `. .'_
            ."" '<  `._\_<|>/__.' >' "".
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
           \  \ `.   \ _\ /_ _/   .-` /  /
          =====`-._`._ \_/_.-`__.-'=====
                      `=---='
