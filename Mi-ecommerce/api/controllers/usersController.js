const bcrypt = require('bcrypt');
const fileHelpers = require('../../helpers/filesHelpers');
const {generateJWT} = require('../../helpers/generateJWT');
const db = require('../database/models');
const { Op } = require('sequelize')


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
// const getUserWithoutPassword = (user) => {
//     const {id, email, username, firstname, lastname, role, profilepic, cart} = user;
//     return {id, email, username, firstname, lastname, role, profilepic, cart};
// }

const usersController = {
    listUsers: async function(req, res, next) {

        try {
            let users = await db.User.findAll(
                {
                    attributes: {
                        exclude: ['password']
                    }
                }
            );
            return res.status(200).json({
                error: false,
                msg: 'Users list',  
                data: users
            });
        } catch (error) {
            next(error);
        }
    }, 

    getUser: async function(req, res, next) {

        const userId = Number(req.params.id);
        try {
            const user = await db.User.findByPk(
                userId, 
                {
                    attributes: {
                        exclude: ['password']
                    }
                }
            );

            if(!user){
                return res.status(404).json({
                    error: true,
                    msg: "User does not exists."
                });
            }

            return res.status(200).json({
                error: false,
                msg:"Detalle de usuario",
                data:user
            });
        }catch(error){
            next(error);
        }
    },

    createUser: async function(req, res, next) {

        const userFromRequest = req.body;

        try {
            const userFound = await db.User.findOne(
                {
                    where: 
                    {
                        [Op.or]: [{username: userFromRequest.username}, {email: userFromRequest.email}]
                    }
                }
            )
            if(userFound)
            {
                if(userFound.username === userFromRequest.username)
                {
                    return res.status(400).json({
                        error: true,
                        msg: "Username is already registred",
                    });
                }
                if(userFound.email === userFromRequest.email)
                {
                    return res.status(400).json({
                        error: true,
                        msg: "E-mail is already registred",
                    });
                }
            }
            
            const hash = await bcrypt.hash(userFromRequest.password, 10);

            const newUser = await db.User.create({
                first_name: userFromRequest.firstname, 
                last_name: userFromRequest.lastname, 
                username: userFromRequest.username, 
                password: hash, 
                email: userFromRequest.email, 
                role: userFromRequest.role,
                profilepic: userFromRequest.profilepic? userFromRequest.profilepic : null
            })

            res.status(201).json({
                error: false,
                msg: "User created successfully",
                data: newUser
            })
        } catch (error) {
            next(error);
        }
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