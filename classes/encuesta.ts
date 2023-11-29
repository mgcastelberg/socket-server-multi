export class EncuestaData {
    
    private preguntas: number[] = [0,1,2,3];
    private valores: number[] = [0,0,0,0];

    constructor() {

    }

    getDataEncuesta(){
        return this.valores;
    }

    incrementarValor(pregunta: number, valor: number){

        for (const i in this.preguntas) {
            if ( this.preguntas[i] === Number(pregunta) ) {
                this.valores[i] += valor
            }
        }

        return this.getDataEncuesta();
    }
}