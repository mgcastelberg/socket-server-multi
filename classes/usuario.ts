// Config basica de un usuario 

export class Usuario {

    // propiedades
    public id: string;
    public nombre?: string;
    public sala: string;

    constructor(id: string) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
    }

}