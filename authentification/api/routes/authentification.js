const db = require('../knex.js');
const uuid = require('uuid');
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signin', async (req, res) => {
    let users;
    let user;

    try{
        if(req.headers.authorization)
        {

            let nom = req.headers.pseudo;
            let password = req.headers.password;


            users = await db.select('pseudo', 'password').from('user');
           
            user = users.find(u => u.pseudo === nom && u.password == password);

            if(!user)
            {
                return res.status(401).json({
                    error: "Bad credentials"
                })
            }
            else{
                token = jwt.sign({nom}, 'my_secret_key', {algorithm: 'HS256', expiresIn: '600s'});
    
                return res.status(201).json({
                    token: token
                });
            }
        }
        else{
            return res.status(401).json({
                error: "Missing credential"
            })
        }
    }
    catch(error){
        res.status(500).json({
            type: "error",
            error: "500",
            message: "erreur lors de la connexion à la base de données"
        });
    }
});

router.post('/signup', async (req, res) => {

    let nom = req.body.pseudo

    try{

        let user = await db("user").insert({
            pseudo: req.headers.pseudo,
            email: req.headers.email,
            password: req.headers.password,
            event: -1,
            claw: -1,
            king: -1,
            exchange: -1,
            rewardLevel: ""
        });

        token = jwt.sign({nom}, 'my_secret_key', {algorithm: 'HS256', expiresIn: '600s'});

        return res.status(201).json({
            user: req.headers.nom,
            token: token
        });
    }
    catch(error){
        res.status(500).json({
            type: "error",
            error: "500",
            message: "erreur lors de la connexion à la base de données"
        });
    }
});

module.exports = router;


