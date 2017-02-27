// ==UserScript==
// @name        filtraPrezzi
// @namespace   iosda
// @include     https://www.amazon.co.uk/s*
// @include     https://www.amazon.co.uk/gp/search/*
// @version     1
// @grant       GM_addStyle
// @run-at      document-end
// ==/UserScript==

function nascondiProdottiConPrezzoMaggioreDi(prezzoMax) {
    // var productsList = document.getElementsByClassName('product-price');
   var productsList = document.getElementsByClassName('s-price');
    for (var prod of productsList) {
        var price = prod.textContent;
        var startIndex = price.search(/\d/i);
        price = parseFloat(price.substring(startIndex, price.length));
        if( price > prezzoMax ) {
            prod.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
        }
    }
}

function autoFilter() {
    var prezzoMax = sessionStorage.getItem('_prezzoMax');
    if( prezzoMax ) {
        nascondiProdottiConPrezzoMaggioreDi(parseFloat(prezzoMax));
    }
    var nextPageButton = document.getElementById('pagnNextLink');
    nextPageButton.addEventListener('click', function(e) { setTimeout(reAddFeature, 1000); });
}

function filtra() {
    var prezzo = window.prompt("Inserisci il prezzo massimo");
    if( prezzo ) {
        prezzo = parseFloat(prezzo);
        if( prezzo > 0 ) {
            sessionStorage.setItem('_prezzoMax', prezzo);
            nascondiProdottiConPrezzoMaggioreDi(prezzo);
        }
    }
  
  var nextPageButton = document.getElementById('pagnNextLink');
    nextPageButton.addEventListener('click', function(e) { setTimeout(reAddFeature, 1000); });
}

function reAddFeature() {
    addFiltraButton();
    autoFilter();
}

function addFiltraButton() {
    GM_addStyle('.filtri { display: inline-block; margin-top: 6px; cursor: pointer; }');
    var button = document.createElement('div');
    button.appendChild(document.createTextNode('Filtra'));
    button.addEventListener('click', filtra);
    button.classList.add('filtri');
    
    var container = document.getElementsByClassName('s-last-column')[0];
    container.insertBefore(button, container.firstElementChild);
}

if( location.search.indexOf('me=') != -1 || location.search.indexOf('merchant=') != -1 )
    addFiltraButton();
