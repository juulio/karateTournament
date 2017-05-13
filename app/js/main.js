/*
 * Main Site
 *
 * Global Namespace
 */
 var tournament_brackets = window.tournament_brackets || {};

/*
 * Global logic
 * @namespace
 */

(function (context) {

	'use strict';

    /**
     * Global Variables
     */

    var nombreCategoria = '',
        jsonFilePath = '';

    /**
     * Reads JSON file and loads data
     */
    function loadJSON(callback, jsonFileURL) { 
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', jsonFileURL, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

    /**
     * Gets the index of the provided element on the parent element.
     */
    function getIndex(el) {
        var children = el.parentNode.getElementsByClassName('fighter'),
            i = 0;

        for (; i < children.length; i++) {
            if (children[i] == el) {
                return i;
            }
        }
        return -1;
    }

    function getOpponentFigher(element, index) {
        var opponentFighter;

        if (index%2 !== 0){
            opponentFighter = element.nextElementSibling;
            if(!opponentFighter.classList.contains('fighter')){
                opponentFighter = opponentFighter.nextElementSibling;
            }
        }
        else {
            opponentFighter = element.previousElementSibling;
            if(!opponentFighter.classList.contains('fighter')){
                opponentFighter = opponentFighter.previousElementSibling;
            }
        }

        return opponentFighter;
    }

    /**
     * Gets the name of the current winner and moves it to the next column
     */
    function selectWinner(e){
        var currentElement = e.target;
        var index = getIndex(currentElement) + 1;
        var fighterName = currentElement.innerHTML;
        var targetPosition = Math.floor(index/2) + index%2;
        var currentColumn = currentElement.parentNode;
        var nextColumn = currentColumn.nextElementSibling;
        var nextColumnFitghters = nextColumn.querySelectorAll('.fighter');
        var opponentFighter = getOpponentFigher(currentElement, index);

        opponentFighter.classList.remove('winner');
        opponentFighter.classList.add('looser');

        currentElement.classList.remove('looser');
        currentElement.classList.add('winner');

        var targetElement = nextColumnFitghters[targetPosition-1];
        targetElement.innerHTML = fighterName;

        var jsonString = saveBrackets(); 
        sendJsonToPhp(jsonString);
    }

    function calcularCantidadDeColumnas(cantidadDePeleadores){
        var numeroDeColumnas = 2;

        if(cantidadDePeleadores > 2){
            numeroDeColumnas = 3;
        }
        if(cantidadDePeleadores > 4){
            numeroDeColumnas = 4;
        }
        if(cantidadDePeleadores > 8){
            numeroDeColumnas = 5;
        }

        return numeroDeColumnas;
    }

    /**
     * Parses JSON data and renders the Brackets' HTML
     */
    function renderBrackets(jsonData){
        var cantidadDePeleadores = jsonData.cantidadDePeleadores,
            numeroDeColumnas = calcularCantidadDeColumnas(cantidadDePeleadores),
            anchoColumnasCSS = 100/numeroDeColumnas,
            rondas = jsonData.rondas,
            htmlContent = '';

        nombreCategoria = jsonData.nombreCategoria;

        for(var i=0;i<rondas.length;i++){
            htmlContent += '<div class="column" style="width: ' + Math.trunc(anchoColumnasCSS) + '%">';
            var ronda = rondas[i],
                peleadores = ronda.peleadores;

            for(var j=0;j<peleadores.length;j++){
                var peleador = peleadores[j];

                htmlContent += '<div class="fighter';

                if(peleador.estado == 'winner'){
                    htmlContent += ' winner';
                }
                else {
                    if(peleador.estado == 'looser'){
                        htmlContent += ' looser';
                    }
                }

                if(i==0 && peleador.nombre == ''){
                    htmlContent += ' hidden';
                }


                if(j%2 != 0){
                    htmlContent += ' bottomFighter';
                }

                htmlContent += '">';

                
                htmlContent += peleador.nombre;
                htmlContent += '</div>';

                if(j%2 == 0 && i < rondas.length-1){
                    htmlContent += '<div class="spacer"></div>';
                }
            }

            htmlContent += '</div>';
        }

        //Nombre de la categoria H1
        document.getElementsByTagName('h1')[0].innerHTML = "Categor&iacute;a: " + nombreCategoria;
        document.getElementsByTagName('main')[0].innerHTML = htmlContent;
    }

    /**
     * Reads fighters progress and saves data on JSON file
     */
    function saveBrackets(){
        var fighterColumns = document.getElementsByClassName('column'),
            jsonBrackets = {};

        jsonBrackets.nombreArchivo = jsonFilePath;
        jsonBrackets.nombreCategoria = nombreCategoria;
        jsonBrackets.rondas = [];

        for(var a=0;a<fighterColumns.length;a++){
            var column = fighterColumns[a],
                peleadores = column.getElementsByClassName('fighter'),
                peleadoresObject = [];

            if(a == 0){
                jsonBrackets.cantidadDePeleadores = peleadores.length;
            }

            for(var b=0;b<peleadores.length;b++){
                var peleadorElement = peleadores[b],
                    nombrePeleador = peleadorElement.textContent,
                    peleadorObject = {},
                    estado = '';
                
                if (peleadorElement.classList.contains('winner')) {
                    estado = 'winner';
                }
                else {
                    if (peleadorElement.classList.contains('looser')) {
                        estado = 'looser';
                    }
                }

                peleadorObject.nombre = nombrePeleador;
                peleadorObject.estado = estado;

                peleadoresObject[b] = peleadorObject;
            }

            jsonBrackets.rondas[a] = {};
            jsonBrackets.rondas[a].peleadores = peleadoresObject;
        }

        // console.log(jsonBrackets);

        var str_json = JSON.stringify(jsonBrackets)
        
        // console.log(str_json);

        return str_json;
    }

    /**
     *
     */
    function sendJsonToPhp(str_json){
        var request= new XMLHttpRequest()
        request.open("POST", "JSON_Handler.php", true)
        request.setRequestHeader("Content-type", "application/json")
        request.send(str_json)
    }

    /**
     *
     */
    function init() {
        jsonFilePath = 'json/categoria-ninos-6-7.json';
        // jsonFilePath = 'json/categoria-juvenil-masculino-16-17.json';
        // jsonFilePath = 'json/categoria-mujeres-avanzadas.json';
        // jsonFilePath = 'json/categoria-livianos-avanzados.json';
        // jsonFilePath = 'json/categoria-medianos-avanzados.json';
        // jsonFilePath = 'json/categoria-pesados-avanzados.json';

        //Using JSON file
        loadJSON(function(response) {
            // Parse JSON string into object
            var jsonData = JSON.parse(response);

            renderBrackets(jsonData);

            var fighterElements = document.querySelectorAll('.fighter');

            for (var i = 0; i < fighterElements.length; i++) {
                fighterElements[i].addEventListener('click', selectWinner, false);
            }

        // }, 'json/categoria.json');
        }, jsonFilePath);
    }

    init();

}(tournament_brackets));
