import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


// Patron singleton
export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: socketIO.Socket, io: socketIO.Server) => {

    // almacenar un usuario en la lista de usuarios
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}


// (cliente: socketIO.Socket)
export const desconectar = (cliente: socketIO.Socket, io: socketIO.Server) => {

    // para detectar la desconexion
    cliente.on('disconnect', () => {
        console.log('Usuario desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });

}

// Escuchar Mensajes
export const mensaje = ( cliente: socketIO.Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de:string, cuerpo:string } ) => {
        console.log('mensaje recibido', payload);


        // Emitirlo
        io.emit('mensaje-nuevo', payload);


    });
}

// Configurar usuario
export const configurarUsuario = ( cliente: socketIO.Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', ( payload: { nombre:string }, callback: Function ) => {

        usuariosConectados.actualizar_nombre( cliente.id, payload.nombre );
        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok:true,
            mensaje: `Usuario ${ payload.nombre }. configurado`
        });
        
        // Emitirlo
        // io.emit('mensaje-nuevo', payload);

    });

}

// Obtener usuarios
export const obtenerUsuarios = ( cliente: socketIO.Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {
        // io.emit('usuarios-activos', usuariosConectados.getLista()); //Para todos
        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()); //Para solo el usuario que esta entrando
    });

}