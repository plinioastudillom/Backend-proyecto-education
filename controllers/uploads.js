const path = require('path');
const fs   = require('fs');



const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { StudentDocument } = require('../models');


const cargarArchivo = async(req, res = response) => {
    try {
        
        // txt, md
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'students' );
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    }

}


const actualizarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'students':
            modelo = await Students.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un estudiante con el id ${ id }`
                });
            }
        
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }


    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();


    res.json( modelo );

}

const eliminarImagen= async (req, res = response ) => {
    try {
        const { id, coleccion, imageName } = req.params;
        console.log(id);
        const pathImagen = path.join( __dirname, '../uploads', coleccion, imageName);
        const query = { documentName: imageName };
        const delDoc = await StudentDocument.findOneAndDelete( query );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        
        }
       res.status(200).json({ msg:"Eliminado" });

    } catch (msg) {
        res.status(500).json({ msg });
    }
    
}




const mostrarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    // switch ( coleccion ) {
    //     case 'students':
    //         modelo = await Student.findById(id);
    //         if ( !modelo ) {
    //             return res.status(400).json({
    //                 msg: `No existe un estudiante con el id ${ id }`
    //             });
    //         }
        
    //     break;

    
    //     default:
    //         return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    // }


    // Limpiar imágenes previas
    if ( id ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, id);
        console.log(pathImagen);
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen )
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    eliminarImagen
}