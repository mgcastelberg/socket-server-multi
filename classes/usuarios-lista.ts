import { Usuario } from "./usuario";

export class UsuariosLista {

    private lista: Usuario[] = [];

    constructor() {}

    public agregar( usuario: Usuario) {
        this.lista.push( usuario );
        console.log( this.lista );
        return usuario;
    }

    public actualizar_nombre( id: string, nombre:string ){
        for (const usuario of this.lista) {

            if( usuario.id === id){
                usuario.nombre = nombre;
                break;
            }
            
        }

        console.log( '====== Actualizando Usuario' );
        console.log( this.lista );
    }

    public getLista(){
        // return this.lista;
        return this.lista.filter( usuario => {
            // console.log(usuario.nombre);
            return usuario.nombre != 'sin-nombre'
        });
    }

    public getUsuario( id: string){
        return this.lista.find( usuario => {
            return usuario.id === id
        });
    }

    // Obtener usuarios en una sala en particular
    public getUsuariosEnSala( sala: string ){
        return this.lista.filter( usuario => {
            return usuario.sala === sala;
        });
    }

    // Borrar un usuario al desconectarse
    public borrarUsuario( id: string ){
        const tempUsuario = this.getUsuario( id );

        this.lista = this.lista.filter( usuario => {
            return usuario.id !== id;
        });

        console.log(this.lista);

        return tempUsuario;
    }

}