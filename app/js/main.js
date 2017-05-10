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
        currentElement.style.borderBottomColor = '#FF0000';

        var targetElement = nextColumnFitghters[targetPosition-1];
        targetElement.innerHTML = fighterName;
    }

     /**
     *
     */
    function init() {
        var fighterElements = document.querySelectorAll('.fighter');

        for (var i = 0; i < fighterElements.length; i++) {
            fighterElements[i].addEventListener('click', selectWinner, false);
        }
    }

    init();

}(tournament_brackets));
