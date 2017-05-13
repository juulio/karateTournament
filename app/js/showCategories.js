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
        jsonFilePath = '',
        jsonFiles=[];

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
     *
     */
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
     *
     */
    function init() {
        var jsonFilesPosition = 0;

        jsonFiles.push('json/categoria-ninos-4-5.json');
        jsonFiles.push('json/categoria-ninas-4-5.json');
        jsonFiles.push('json/categoria-ninas-6-7.json');
        jsonFiles.push('json/categoria-ninos-6-7.json');
        jsonFiles.push('json/categoria-ninos-8.json');
        jsonFiles.push('json/categoria-ninas-8.json');
        jsonFiles.push('json/categoria-ninos-9.json');
        jsonFiles.push('json/categoria-ninos-10-11.json');
        jsonFiles.push('json/categoria-ninas-10-11.json');
        jsonFiles.push('json/categoria-juvenil-femenino-12-13.json');
        jsonFiles.push('json/categoria-juvenil-masculino-12-13.json');
        jsonFiles.push('json/categoria-juvenil-femenino-14-15.json');
        jsonFiles.push('json/categoria-juvenil-masculino-14-15.json');
        jsonFiles.push('json/categoria-juvenil-masculino-16-17.json');
        jsonFiles.push('json/categoria-mujeres-principiantes.json');
        jsonFiles.push('json/categoria-livianos-principiantes.json');
        jsonFiles.push('json/categoria-medianos-principiantes.json');
        jsonFiles.push('json/categoria-pesados-principiantes.json');
        jsonFiles.push('json/categoria-senior-open.json');
        jsonFiles.push('json/categoria-mujeres-avanzadas.json');
        jsonFiles.push('json/categoria-livianos-avanzados.json');
        jsonFiles.push('json/categoria-medianos-avanzados.json');
        jsonFiles.push('json/categoria-pesados-avanzados.json');

        setInterval(function() {
            jsonFilePath = jsonFiles[jsonFilesPosition];

            jsonFilesPosition++;

            if(jsonFilesPosition > 23){
                jsonFilesPosition = 0;
                location.reload();
            }

            loadJSON(function(response) {
                // Parse JSON string into object
                var jsonData = JSON.parse(response);

                renderBrackets(jsonData);

            }, jsonFilePath);

        }, 25000);
    }

    init();

}(tournament_brackets));
