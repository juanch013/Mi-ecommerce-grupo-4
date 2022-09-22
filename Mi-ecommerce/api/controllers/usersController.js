const bcrypt = require('bcrypt');
const fileHelpers = require('../../helpers/filesHelpers');
const {generateJWT} = require('../../helpers/generateJWT');


//Recibe array de usuarios y un id de usuario. 
//Retorna el indice del usuario en el array de usuarios cuyo id coincide con el parametro id recibido.
const findUserById = (users, id) => {
    let userIndex = -1;
    users.forEach((user, index) => {
        if(user.id === id)
        {
            userIndex = index;
        }
    })
    return userIndex;
}

// Filters out password field from user object so it's not returned
const getUserWithoutPassword = (user) => {
    const {id, email, username, firstname, lastname, role, profilepic, cart} = user;
    return {id, email, username, firstname, lastname, role, profilepic, cart};
}

const usersController = {
    listUsers: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        const usersWithoutPassword = users.map((user) => {
             return getUserWithoutPassword(user);
        })
        res.status(200).send({
            error: false,
            msg: 'Users list',  
            data: usersWithoutPassword});
    }, 

    getUser: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0) {return res.status(404).json({
            error: true,
            msg: "User does not exists."})}

        const userWithoutPassword = getUserWithoutPassword(users[userIndex])
        return res.status(200).json({
            error: false,
            msg:"Detalle de usuario",
            data:userWithoutPassword});

    },

    createUser: function(req, res, next) {
        const userFromRequest = req.body;
        const users = fileHelpers.getUsers(next);

        // Si usuario ya existe en la base de datos no se puede crear
        const userExists = users.find((u) => u.username === userFromRequest.username);
        if(userExists) {return res.status(400).json({error:true, msg: "User already exists."});}

        // Se hashea la contraseña
        const hash = bcrypt.hashSync(userFromRequest.password, 10);

        // Se guarda la contrasena hasheada en el objeto
        userFromRequest.password = hash;

        // Se accede al id del ultimo usuario y se le suma 1
        const id = users.at(-1).id + 1;
        const userToAdd = {id, ...userFromRequest};
        users.push(userToAdd);

        fileHelpers.guardarUsers(users, next);
        return res.status(201).json({error:false , msg: "User created successfully.", data:getUserWithoutPassword(userToAdd)});
    },

    login: async function(req, res, next) {
        const {username,password} = req.body;

        let users = fileHelpers.getUsers(next);
        let usuarioFind = users.find(u => u.username == username);

        let passwordMatch = null;
        if (usuarioFind) {
          // Se compara la contraseña hasheada con la contraseña ingresada por el usuario
          passwordMatch = await bcrypt.compare(password, usuarioFind.password);
        }

        // Si el usuario no existe o la contraseña no coincide se envia un mensaje de error
        if(!usuarioFind || !passwordMatch){
           return res.status(401).json({
              error:true,
              msg:"Credentials are not valid"
           })
        }

        const userFoundWithoutPassword = getUserWithoutPassword(usuarioFind);

        let payload = {
              ...userFoundWithoutPassword
           }  
     
        const token = await generateJWT(payload);

        return res.status(200).json({
            error:false,
            msg:"authorized",
            data:{
                idUser: usuarioFind.id,
                username: usuarioFind.username
            },
            token: token
        })

    },

    updateUser: function(req, res, next) {
        let users = fileHelpers.getUsers(next);
        const userFromRequest = req.body;
        const userId = Number(req.params.id);

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0)
        {
            return res.status(404).json({error: true, msg: "User does not exists."})
        }

        // Se hashea la contraseña
        userFromRequest.password = bcrypt.hashSync(userFromRequest.password, 10);
        
        users[userIndex] = {id: userId, ...userFromRequest};
        fileHelpers.guardarUsers(users, next);
        return res.status(200).json({error: false, msg: "User updated successfully", data:getUserWithoutPassword(userFromRequest)});
    },

    deleteUser: function(req, res,next) {
        let users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0) {return res.status(404).json({error: true, msg: "User does not exists."});}

        //Shifts elements back from element to delete to end and pops last element
        const userToDelete = users[userIndex];
        for(let i = userIndex; i < users.length - 1; i++)
        {
            users[i] = users[i + 1];
        }
        users.pop();

        fileHelpers.guardarUsers(users, next);
        return res.status(200).json({error: false, msg:"User deleted successfully", data: getUserWithoutPassword(userToDelete)});
    }
}

module.exports = usersController;
