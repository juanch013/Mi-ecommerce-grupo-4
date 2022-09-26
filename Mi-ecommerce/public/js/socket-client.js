
// Referencias del HTML
const lblOnline  = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar');


const socket = io();


// on es para escuchar un evento
socket.on('connect', () => {
    // console.log('Conectado');

    lblOffline.style.display = 'none';
    lblOnline.style.display  = '';

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    lblOnline.style.display  = 'none';
    lblOffline.style.display = '';
});


socket.on('ofertas', (payload) => {
    console.log( payload )
})

socket.on('bienvenido', (payload) => {
    console.log( payload )  
})




// btnEnviar.addEventListener( 'click', () => {

//     const mensaje = txtMensaje.value;

//     socket.emit('enviar-mensaje', mensaje)

//     // const payload = {
//     //     mensaje,
//     //     id: '123ABC',
//     //     fecha: new Date().getTime()
//     // }
    
//     //emit es para enviar un evento
//     // socket.emit( 'enviar-mensaje', payload, ( id ) => {
//     //     console.log('Desde el server', id );
//     // });

// });