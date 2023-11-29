import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';
import { EncuestaData } from '../classes/encuesta';
import { Mapa } from '../classes/mapa';

const router = Router();
const grafica = new GraficaData();
const encuesta = new EncuestaData();
const mapa = new Mapa();

/** MAPA Mapbox */
router.get('/mapa',  ( req , res ) => { 

    res.json({
        ok: true,
        datos: mapa.getMarcadores()
    });

});



/** GRAFICAS */

router.get('/grafica',  ( req , res ) => { 

    res.json({
        ok: true,
        datos: grafica.getDataGrafica()
    });

});

router.post('/grafica',  ( req , res ) => { 

    const mes       = req.body.mes;
    const unidades  = Number(req.body.unidades);

    grafica.incrementarValor( mes, unidades );

    const  server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica())

    res.json({
        ok: true,
        datos: grafica.getDataGrafica()
    });

});

// Encuesta Endpoints
router.get('/encuesta',  ( req , res ) => { 

    res.json({
        ok: true,
        datos: encuesta.getDataEncuesta()
    });

});

router.post('/encuesta',  ( req , res ) => { 

    const pregunta  = Number(req.body.pregunta);
    const unidades  = Number(req.body.unidades);

    encuesta.incrementarValor( pregunta, unidades );

    const  server = Server.instance;
    server.io.emit('cambio-encuesta', encuesta.getDataEncuesta())

    res.json({
        ok: true,
        datos: encuesta.getDataEncuesta()
    });

});

// API ENDPOINT SEERVIDOR REST TRADICIONAL
router.get('/mensajes',  ( req , res ) => { 

    res.json({
        ok: true,
        mensaje: 'todo esta bien!!!'
    });

});

router.post('/mensajes',  ( req , res ) => { 

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = {
        de,
        cuerpo
    }

    // Conectamos con el servidor a mensaje-nuevo para todos los usuarios
    const  server = Server.instance;
    server.io.emit('mensaje-nuevo', payload)

    res.json({
        ok: true,
        mensaje: 'POST listo',
        cuerpo,
        de
    });

});

router.post('/mensajes/:id',  ( req , res ) => { 
    
    const id = req.params.id;
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const payload = {
        de,
        cuerpo
    }

    // Conectamos con el servidor para que apunte a un usuario
    const  server = Server.instance;
    server.io.in( id ).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        mensaje: 'POST listox',
        cuerpo,
        de,
        id
    });

});

// Obtener todos los ids de los usuarios
router.get('/usuarios',(req:Request,res:Response)=>{
    const server=Server.instance;
    server.io.allSockets().then((clientes)=>{
        res.json({
            ok:true,
            clientes: Array.from(clientes)
        });
    }).catch((err)=>{
        res.json({
            ok:false,
            err
        })
    });
});

// Obtener todos los ids de los usuarios y sus nombres desde node
router.get('/usuarios/detalle',(req:Request,res:Response)=>{

    const server=Server.instance;
    server.io.allSockets().then((clientes)=>{
        res.json({
            ok:true,
            clientes: usuariosConectados.getLista()
        });
    }).catch((err)=>{
        res.json({
            ok:false,
            err
        })
    });
});



export default router;