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
     *
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

        opponentFighter.style.opacity = 0.2;
        opponentFighter.style.borderBottomColor = '#000000';
        opponentFighter.style.color = '#000000';

        currentElement.style.opacity = 1;
        currentElement.style.color = '#FF0000';
        currentElement.style.fontWeight = 'bold';
        currentElement.style.borderBottomColor = '#FF0000';

        var targetElement = nextColumnFitghters[targetPosition-1];
        targetElement.innerHTML = fighterName;
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
     * Having JSON data, renders the Brackets' HTML
     */
    function renderBrackets(jsonData){
        var categoria = jsonData.categoria,
            cantidadDePeleadores = categoria.cantidadDePeleadores,
            // numeroDeColumnas = calcularCantidadDeColumnas(cantidadDePeleadores),
            columnas = categoria.columnas,
            htmlContent = '';

        for(var i=0;i<columnas.length;i++){
            htmlContent += '<div class="column">';

            var peleadores = columnas[i].peleadores;

            for(var j=0;j<peleadores.length;j++){
                var peleador = peleadores[j];

                htmlContent += '<div class="fighter';

                if(peleador.estado == 'winner'){
                    htmlContent += ' winner';
                }
                else {
                    htmlContent += ' looser';
                }


                if(j%2 != 0){
                    htmlContent += ' bottomFighter';
                }

                htmlContent += '">';
                htmlContent += peleador.nombre;
                htmlContent += '</div>';

                // console.log(peleadores[j]);
            }

            htmlContent += '</div>';
        }

        //Nombre de la categoria H1
        document.getElementsByTagName('h1')[0].innerHTML = categoria.nombreCategoria;

        document.getElementsByTagName('main')[0].innerHTML = htmlContent;

    }
     /**
     *
     */
    function init() {
        
        //Using JSON file
        loadJSON(function(response) {
            // Parse JSON string into object
            var jsonData = JSON.parse(response);

            renderBrackets(jsonData);

            var fighterElements = document.querySelectorAll('.fighter');

            for (var i = 0; i < fighterElements.length; i++) {
                fighterElements[i].addEventListener('click', selectWinner, false);
            }

        }, 'js/categoria.json');
        
    }

    init();

}(tournament_brackets));
