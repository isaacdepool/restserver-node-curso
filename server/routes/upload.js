const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path');

// default options 
app.use(fileUpload({useTempFiles: true,tempFileDir : '/tmp/' }));


app.put('/upload/:tipo/:id', (req, res) =>{

    let tipo = req.params.tipo;
    let id = req.params.id; 

    if(!req.files){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecionado ningun archivo'
            }
        });
    }

    // Validar tipo 
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false, 
            message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
        });
    }
    
    let archivo = req.files.archivo; 

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    // Extenciones permitidas 
    let extensionesValidas = ['PNG', 'jpg', 'git', 'jpeg'];

    if(extensionesValidas.indexOf( extension ) <0 ){

        return res.status(400).json({
            ok: false, 
            message: 'Las extenciones validas son: ' + extensionesValidas.join(', '),
            ext: extension
        });
    }

    // Cambiar nombre al archivo 
    // 125595asfds-123.jpg 
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(tipo === 'usuarios'){

            imagenUsuario(id, res, nombreArchivo);

        }else if(tipo === 'productos'){
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenProducto(id, res, nombreArchivo){

    let img_update = {
        img: nombreArchivo
    }

    Producto.findOneAndUpdate({_id: id}, img_update, (err, productoDB) =>{

        if(err){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){

            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El producto no existe'
                }
            });
        }

    borraArchivo(productoDB.img, 'productos');

        res.json({
            ok: false,
            productoDB,
            img: img_update
        });

    });

}

function imagenUsuario(id, res, nombreArchivo){

    let img_update = {
        img: nombreArchivo
    }

    Usuario.findOneAndUpdate( {_id: id}, img_update, (err, usuarioDB) => {

        if(err){

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

    if(!usuarioDB){

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El usuario no existe'
                }
            });
    }

    borraArchivo(usuarioDB.img, 'usuarios');

    
        res.json({
            ok: true,
            usuarioDB,
            img: img_update
        });

});
}

function borraArchivo(nombreImg, tipo ) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    if (fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;