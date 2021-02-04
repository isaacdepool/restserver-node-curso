const express = require('express');
const fs = require('fs');

const path = require('path');

let app = express();

const {verificarTokenImg} = require('../middlewares/auth')

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, resp) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    let noImagePath = path.resolve( __dirname, '../assets/no-image.jpg');

    if( fs.existsSync(pathImg) ){

        resp.sendFile(pathImg);

    }else resp.sendFile(noImagePath);
});





module.exports = app;