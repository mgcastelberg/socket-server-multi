import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as miSocket from '../sockets/socket';

export default class Server {
    
    // propiedad estatica para singleton
    private static _instance: Server;

    public app : express.Application;
    public port : number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    // patron singleton
    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        // socket y express no son compatible directamente por eso importamos http
        this.httpServer = new http.Server(this.app);
        // // Para la version socket.io@2.2.0:
        // this.io = socketIO( this.httpServer ); //profe
        // Para versiones mas recientes
        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } ); // comunidad

        // this.io : tiene el conocimiento de que personas estan conectadas

        this.escucharSockets();
    }

    // Creamos metodo que llamara singleton
    public static get instance(){
        // Si ya existe una instancia regresa la existente si no crea una nueva
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {
        console.log('escuchando conexiones');
        this.io.on('connection', (cliente: socketIO.Socket)=> {

            console.log('Cliente conectado');
            console.log( cliente.id );

            // Conectar cliente
            miSocket.conectarCliente(cliente, this.io);

            // Configurar usuario
            miSocket.configurarUsuario( cliente, this.io );

            // Obtener usuarios activos
            miSocket.obtenerUsuarios( cliente, this.io );

            // Mensajes
            miSocket.mensaje( cliente, this.io );

            // Desconectar
            miSocket.desconectar(cliente, this.io);

        }); // es para escuchar u conection
    }
    
    start( callback: Function ) {
        // this.app.listen( this.port, callback() ); //en lugar de inicialiar la app vamos a inicializar el httpServer
        this.httpServer.listen( this.port, callback() );
    }

}