// ==UserScript==
// @name        Filtro prezzi amazon OP
// @namespace   www.github.com/antoniostasio
// @include     https://www.amazon.co.uk/sp*
// @include     https://www.amazon.co.uk/gp/search/*
// @version     1
// @grant       GM_addStyle
// @run-at      document-end
// ==/UserScript==


var blackList = ['fifa', 'nba', 'pes', 'soccer', 'singstar', 'xbox', 'beijing', 'move req', 'sports', 'sport', 'cricket', 'pga'];


function nascondiProdottiConPrezzoMaggioreDi(prezzoMax) {
    console.log('nascondo prodotti');
    var productsList = document.getElementById('products-list').getElementsByClassName('product-price');
    for (var prod of productsList) {
        var price = prod.textContent;
        var startIndex = price.search(/\d/i);
        price = parseFloat(price.substring(startIndex, price.length));
        var title = prod.parentElement.getElementsByClassName('product-title')[0].textContent;

        if( price > prezzoMax ) {
            prod.parentElement.parentElement.style.display = "none";
        } else {
            var searchIndex = -1;
            var i = 0;
            while ((searchIndex == -1) && (i < blackList.length)) {
                searchIndex = title.search(new RegExp(blackList[i], "i"));
                i += 1;
            }
            if (searchIndex != -1) {
                prod.parentElement.parentElement.style.display = "none";
            }
        }
    }
    var visibleProducts = [];
    var sellerProducts = document.getElementById('products-list').getElementsByClassName('product-column');
    for (var produ of sellerProducts) {
        if (produ.style.display !== "none") {
            visibleProducts.push(produ);
        }
    }

    if (visibleProducts.length === 0) {
        var buttonsDiv = document.getElementById('products-results-data');
        var buttons = buttonsDiv.getElementsByClassName('products-pagination-button');
        var nextPageButton = buttons[buttons.length-1];
        if (!nextPageButton.classList.contains('a-disabled')) {
            nextPageButton.click();
            setTimeout(autoFilter, 1500);
        }
    }
}

function autoFilter() {
    var prezzoMax = sessionStorage.getItem('_prezzoMax');
    if( prezzoMax ) {
        nascondiProdottiConPrezzoMaggioreDi(parseFloat(prezzoMax));
    }

    var buttonsDiv = document.getElementById('products-results-data');
    var buttons = buttonsDiv.getElementsByClassName('products-pagination-button');
    var nextPageButton = buttons[buttons.length-1];
    nextPageButton.addEventListener('click', function(e) { setTimeout(autoFilter, 1500); console.log('clicked button');});
}

function filtra() {
    var prezzo = window.prompt("Inserisci il prezzo massimo");
    if( prezzo ) {
        prezzo = parseFloat(prezzo);
        if( prezzo > 0 ) {
            sessionStorage.setItem('_prezzoMax', prezzo);
            //nascondiProdottiConPrezzoMaggioreDi(prezzo);
        }
    }

    autoFilter();
    modifyLayout();
}

function reAddFeature() {
    addFiltraButton();
    autoFilter();
}

function addFiltraButton() {
    GM_addStyle('.filtri { display: inline-block; margin-top: 6px; cursor: pointer; }');
    var button = document.createElement('span');
    button.appendChild(document.createTextNode('Filtra'));
    button.addEventListener('click', filtra);
    button.classList.add('filtri');

    var container = document.getElementById('product-search-row');
    container.appendChild(button);
}

function modifyLayout() {
    var productContainerStyle = '#seller-profile-container #product-data { max-width: 3000px!important; width: 100%; } #seller-profile-container .product-column {width: 10%!important;}';
    GM_addStyle(productContainerStyle);
}

if(location.search.indexOf('seller=') != -1)
    addFiltraButton();
