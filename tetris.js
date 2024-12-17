const canvas = document.getElementById("tetris");   //Inicialización del canvas del tablero
const lienzo = canvas.getContext("2d");

const filas = 20;       //Tamaño del tablero, se puede cambiar sin problema cualquier parámetro, el tablero se adapta
const columnas = 10;
const tamañoCelda = 30;

const ventana = document.getElementById('tetris');
ventana.width = tamañoCelda*columnas;
ventana.height = tamañoCelda*filas;

const canvasProximaPieza = document.getElementById("proximaPieza");   //Inicialización del canvas de la ventana de la próxima pieza
const lienzoProximaPieza = canvasProximaPieza.getContext("2d");

const ventanaProximaPieza = document.getElementById('proximaPieza');
ventanaProximaPieza.width = tamañoCelda*columnas;
ventanaProximaPieza.height = tamañoCelda*filas;

let xInicial = x = 0;
let yInicial = y = 4;
let piezaActual;
let piezaProxima;
let primeraJugada = true;

let puntuacion = 0;

let tiempo = 500;
let reduccionTiempo = 5;    // Milisegundos de reducción por pieza generada
let tiempoMinimo = 100;     // Milisegundos minimos de juego

let contenedorPuntuacion = document.getElementById('puntuacion');
contenedorPuntuacion.innerHTML = `Puntuación: ${puntuacion}`;

const piezas = [{nombre:"C", forma: [[1,1,1],
                                     [1,0,1]], probabilidad: 0.2, color: "red"},

                {nombre:"I", forma: [[1],
                                     [1],
                                     [1],
                                     [1]], probabilidad: 0.1, color: "blue"},

                {nombre:"O", forma: [[1,1],
                                     [1,1]], probabilidad: 0.2, color: "green"},

                {nombre:"L", forma: [[1,0],
                                     [1,0],
                                     [1,1]], probabilidad: 0.3, color: "yellow"},

                {nombre:"J", forma: [[0,1],
                                     [0,1],
                                     [1,1]], probabilidad: 0.3, color: "brown"},

                {nombre:"T", forma: [[1,1,1],
                                     [0,1,0]], probabilidad: 0.2, color: "orange"}];  

let tablero = new Array;

for (let i = 0; i < filas; i++) {
    tablero[i] = new Array;
    for (let j = 0; j < columnas; j++) {
        tablero[i].push('0');
    }
}

let tableroProximaPieza = new Array;

for (let i = 0; i < 5; i++) {
    tableroProximaPieza[i] = new Array;
    for (let j = 0; j < 5; j++) {
        tableroProximaPieza[i].push('0');
    }
}

//console.log(tablero); 

function dibujarTablero() {

    
    let counter = 0;

    for (let i = 0; i < filas; i++) {
        if(columnas%2==0){
            counter++;
        }
        for (let j = 0; j < columnas; j++) {
            counter++;
            if(tablero[i][j] == 0){ // Si la casilla es 0 la pinta de un color u otro
                if(counter%2==0){ // Si el resto del contador/2 es 0 pintará de un color
                    lienzo.fillStyle = "rgb(200,200,200)";
                    lienzo.fillRect(j*tamañoCelda, i*tamañoCelda, tamañoCelda, tamañoCelda);
                    lienzo.strokeStyle = 'white';
                } else {
                    lienzo.fillStyle = "rgb(0,200,200)"; // sinó de este otro
                    lienzo.fillRect(j*tamañoCelda, i*tamañoCelda, tamañoCelda, tamañoCelda);
                    lienzo.strokeStyle = 'white';
                }
                
            } else if(tablero[i][j] == 1){ // Si la casilla es 1 pintará las piezas estáticas
                lienzo.fillStyle = "grey";
                lienzo.fillRect(j*tamañoCelda, i*tamañoCelda, tamañoCelda, tamañoCelda);
            }
        }
    }
}

function dibujarTableroProximaPieza() {

    
    let counter = 0;

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            counter++;
            if(counter%2==0){ // Si el resto del contador/2 es 0 pintará de un color
                lienzoProximaPieza.fillStyle = "rgb(200,200,200)";
                lienzoProximaPieza.fillRect(j*tamañoCelda, i*tamañoCelda, tamañoCelda, tamañoCelda);
            } else {
                lienzoProximaPieza.fillStyle = "rgb(0,200,200)"; // sinó de este otro
                lienzoProximaPieza.fillRect(j*tamañoCelda, i*tamañoCelda, tamañoCelda, tamañoCelda);
            }
        }
    }
}


function generarPieza(){

    let total = 0;
    let listaProbabilidadesPiezas = new Map;
    let randomNumber;

    for (let pieza in piezas){
        total += piezas[pieza].probabilidad;
        listaProbabilidadesPiezas.set(piezas[pieza].nombre,total.toFixed(2));
    }

    //console.log(listaProbabilidadesPiezas);

    randomNumber = Math.random()*total;          // No hace falta que el total de las probabilidades sumen exactamente 1, esto lo arregla y mantiene los ratios.

    //console.log(tiempo);

    for (let [key, value] of listaProbabilidadesPiezas){
        if(randomNumber <= value){
            //console.log(key);
            //console.log(randomNumber);
            return {...piezas.find(pieza => pieza.nombre == key)};         //Tengo que devolver una copia, si no, al rotar las piezas, quedaban rotadas siemrpe
        }
    }

}

function dibujarPieza(pieza, x, y){

    //console.log(pieza);

    for (let i = 0; i < pieza.forma.length; i++){

        for (let j = 0; j < pieza.forma[i].length; j++){
            
            if(pieza.forma[i][j] == 1){

                lienzo.fillStyle = pieza.color;
                lienzo.fillRect((j+x)*tamañoCelda, (i+y)*tamañoCelda, tamañoCelda, tamañoCelda);

            }          
        }
    }
        
    //console.log(tablero);
    
}

function dibujarProximaPieza(pieza, x, y){

    //console.log(pieza);

    for (let i = 0; i < pieza.forma.length; i++){

        for (let j = 0; j < pieza.forma[i].length; j++){
            
            if(pieza.forma[i][j] == 1){

                lienzoProximaPieza.fillStyle = pieza.color;
                lienzoProximaPieza.fillRect((j+x)*tamañoCelda, (i+y)*tamañoCelda, tamañoCelda, tamañoCelda);

            }          
        }
    }
        
    //console.log(tablero);
    
}

function chequearColisiones(pieza, x, y){

    if(x + pieza.forma.length >= filas){       //Comprobamos si hemos llegado al final del tablero
        return true;
    }

    for(let i = 0; i < pieza.forma.length; i++){
        
        for(let j = 0; j < pieza.forma[i].length; j++){        //Comprobamos si una casilla mas abajo de la parte de una
                                                               //pieza va a tener colisión en el siguiente movimiento
            if((tablero[x+i+1][y+j] == 1) && 
                (pieza.forma[i][j] == 1)){
                return true;
            }

        }
        
    }

    return false;

}

function chequearColisionesLaterales(pieza, direccion){ 

    if(direccion == "izquierda"){          //Comprobamos colisión con otra pieza a la izquierda

        for (let i = 0; i < pieza.forma.length; i++){

            for (let j = 0; j < pieza.forma[i].length; j++) {

                if (pieza.forma[i][j] == 1 && tablero[x + i][y + j - 1] == 1) {
                    
                        return false;

                }
                
            }

        }

    }

    if(direccion == "derecha"){             //Comprobamos colisión con otra pieza a la derecha
        for (let i = 0; i < pieza.forma.length; i++){

            for (let j = 0; j < pieza.forma[i].length; j++) {

                if (pieza.forma[i][j] == 1 && tablero[x + i][y + j + 1] == 1) {

                        return false;
                        
                }
                
            }

        }

    }

    return true;

 }

function posicionaPieza(pieza, x, y){

    for (let i = 0; i < pieza.forma.length; i++){

        for (let j = 0; j < pieza.forma[i].length; j++){

            if(pieza.forma[i][j]==1){
                tablero[x+i][y+j] = pieza.forma[i][j];
            }
            
        }
    }

    dibujarTablero();


}

function eliminarLinea(x){

    let contador;
    let contadorTetris = 0;

    for (let i = x; i < filas; i++){

        contador = 0;

        for (let j = 0; j < columnas; j++){

            contador += +tablero[i][j];
            //console.log(contador);

            if (contador == columnas){
    
                tablero.splice(i,1);
                tablero.unshift([]);

                for (let k = 0; k < columnas; k++) {
                        tablero[0].push(0);
                }
                i--;            //Decremento i para compensar el haber eliminado una fila y no saltar la siguiente
                puntuacion += 10;     //Aumentamos en 10 puntos el contador
                contenedorPuntuacion.innerHTML = `Puntuación: ${puntuacion}`;
                contadorTetris++;
            }
    
        }

    }

    if(contadorTetris == 4){       // Si hacemos tetris el total a sumar son 100 puntos
        puntuacion += 60;
        contenedorPuntuacion.innerHTML = `Puntuación: ${puntuacion}`;
    }

}

function rotar(){

    if(y + piezaActual.forma.length > columnas){             //Comprobamos si la pieza está en el borde derecho del tablero   
              
        return piezaActual.forma;

    }

    //console.log(piezaActual.forma);

    let formaRotada = [];

    for(let i = 0; i < piezaActual.forma[0].length; i++){          //Aquí invertimos las dimensiones del array de la forma de la pieza y 
        formaRotada[i] = [];                                       //lo asignamos a una nueva variable temporal
        for(let j = 0; j < piezaActual.forma.length; j++){
           
            formaRotada[i].push(0);
        
        }
    }

    for(let i = 0; i < piezaActual.forma.length; i++){              //Aquí rotamos la forma de la pieza sentido antihorario
        
        for(let j = 0; j < piezaActual.forma[i].length; j++){
           
            formaRotada[piezaActual.forma[i].length-j-1][i] = piezaActual.forma[i][j];
        
        }
    }

        for (let i = 0; i < formaRotada.length; i++) {              //Aqui compruebo si la pieza rotada va a solisionar con otra del tablero
            for (let j = 0; j < formaRotada[i].length; j++) {
                if (formaRotada[i][j] == 1 && tablero[x + i][y + j] == 1) {
                    return piezaActual.forma;
                }
            }
        }

    //console.log(formaRotada);

    return formaRotada;

}

function reducirTiempo(){

    if(tiempo > tiempoMinimo){             // Reducimos el ciclo de juego
        tiempo -= reduccionTiempo;
        clearInterval(temporizador);
        temporizador = setInterval(() => actualizar(), tiempo);
    }
    //console.log(tiempo);
}



function actualizar(){

    dibujarTablero();
    dibujarTableroProximaPieza();

    if(primeraJugada){
        piezaActual = generarPieza();
        piezaProxima = generarPieza();
        primeraJugada = false;
        reducirTiempo();
    } else if(piezaActual == null){
        piezaActual = piezaProxima;
        piezaProxima = generarPieza();
        reducirTiempo();
    }

    dibujarPieza(piezaActual, y, x);
    dibujarProximaPieza(piezaProxima, (piezaProxima.forma[0].length < 3) ? 2 : 1, 1);        // Con este ternario crentramos un poco las piezas, según su ancho

    if(!chequearColisiones(piezaActual, x, y)){
        x++;
    } else {
        dibujarTablero();
        posicionaPieza(piezaActual, x, y);
        if(x == 0){
            posicionaPieza(piezaActual, x, y);
            clearInterval(temporizador);
            setTimeout(() => {   //Necesito retrasar 1ms la aledrta para que se fije la pieza al tablero antes de que aparezca el alert.
                alert("FIN DE LA PARTIDA, este juego ha sido desarrollado por Daniel Cuevas");
                window.location.reload();
            }, 1);
        }
        eliminarLinea(x);
        x = xInicial;
        y = yInicial;
        piezaActual = null;
    }

}


function jugar(){

    actualizar();

    dibujarTablero();

    

    
}

//setInterval(() => jugar(), 500);

let temporizador = setInterval(() => actualizar(), tiempo);

//actualizar();

document.addEventListener('keydown', (e) => {    // EventListener para recoger las teclas pulsadas

    if(e.key == "a"){     // La 'a' mueve hacia la izquierda
        if(y > 0 && chequearColisionesLaterales(piezaActual, "izquierda")){
            y--;
        }
        dibujarTablero();
        dibujarPieza(piezaActual, y, x);
        dibujarProximaPieza(piezaProxima, (piezaProxima.forma[0].length < 3) ? 2 : 1, 1);
    }

    if(e.key == "d"){     // La 'd' mueve hacia la derecha
        if(y + piezaActual.forma[0].length < columnas && chequearColisionesLaterales(piezaActual, "derecha")){
            y++;
        }
        dibujarTablero();
        dibujarPieza(piezaActual, y, x);
        dibujarProximaPieza(piezaProxima, (piezaProxima.forma[0].length < 3) ? 2 : 1, 1);
    }

    if(e.key == "s"){    // La 's' avanza un ciclo de actualizar() para ir hacia abajo más rápido

        actualizar();
        
    }

    if(e.key == "w"){    // La 'w' rota la pieza en sentido antihorario

        piezaActual.forma = rotar();
        dibujarTablero();
        dibujarPieza(piezaActual, y, x);
        dibujarProximaPieza(piezaProxima, (piezaProxima.forma[0].length < 3) ? 2 : 1, 1);
    }

    if(e.key == "ñ"){    // La 'ñ' hace que la próxima pieza sea la I

        piezaProxima = {nombre:"I", forma: [[1],
                                            [1],
                                            [1],
                                            [1]], probabilidad: 0.1, color: "blue"};
        dibujarTableroProximaPieza();
        dibujarProximaPieza(piezaProxima, (piezaProxima.forma[0].length < 3) ? 2 : 1, 1);
    }

});