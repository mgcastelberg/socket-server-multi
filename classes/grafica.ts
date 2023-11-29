export class GraficaData {
    
    private meses: string[] = ['enero','febrero','marzo','abril','mayo','junio','julio'];
    private valores: number[] = [0,0,0,0,0,0,0];

    constructor() {

    }

    getDataGrafica(){
        return this.valores;
    }

    incrementarValor(mes: string, valor: number){
        mes = mes.toLocaleLowerCase().trim();

        for (const i in this.meses) {
            if ( this.meses[i] === mes ) {
                this.valores[i] += valor
            }
        }

        return this.getDataGrafica();
    }
}