// ==UserScript==
// @name        Filtro prezzi amazon OP
// @namespace   www.github.com/antoniostasio
// @include     https://www.amazon.co.uk/sp*
// @include     https://www.amazon.co.uk/gp/search/*
// @version     1
// @grant       GM_addStyle
// @run-at      document-end
// ==/UserScript==


var blackList = ['fifa', 'nba', 'pes', 'soccer', 'singstar', 'xbox', 'beijing', 'move req', 'sports', 'sport', 'cricket', 'pga', 'uefa', 'championship', 'football', 'nfl', 'nhl'];
var cachedProducts = [];
var firstElement;

function nascondiProdottiConPrezzoMaggioreDi(prezzoMax) {
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

    var buttonsDiv = document.getElementById('products-results-data');
    var buttons = buttonsDiv.getElementsByClassName('products-pagination-button');
    var nextPageButton = buttons[buttons.length-1];

    if (visibleProducts.length === 0) {

        if (!nextPageButton.classList.contains('a-disabled')) {
            nextPageButton.click();
        }
    } else if ((cachedProducts.length + visibleProducts.length) < 6) {
        for(var prod of visibleProducts) {
            cachedProducts.push(prod.parentElement.removeChild(prod));
        }
        nextPageButton.click();
    } else {
        for(var prod of visibleProducts) {
            var riga = prod.parentElement;
            var visibili = riga.querySelectorAll('.product-column:not([style])').length;
            while(visibili<7) {
                if( cachedProducts.length > 0 ) {
                    riga.appendChild(cachedProducts.pop());
                    visibili++;
                } else {
                    break;
                }
            }
            if( cachedProducts.lenght == 0 ) {
                break;
            }
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
}

function filtra() {
    var prezzo = window.prompt("Inserisci il prezzo massimo");
    if( prezzo ) {
        prezzo = parseFloat(prezzo);
        if( prezzo > 0 ) {
            sessionStorage.setItem('_prezzoMax', prezzo);
        }
    }

    productsAreReady();
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

function productsAreReady() {
    var container = document.getElementById('products-list');
    var productsList = container.getElementsByClassName('product-price');
    if( !firstElement )
        firstElement = productsList[0];
    var mutObserver = new MutationObserver(function(e) {
        console.log('observed event');
        if( container.children.length > 2 ) {
            if( firstElement != productsList[0] ) {
                autoFilter();
                firstElement = productsList[0];
            }
        }
    });
    var config = {childList: true};
    mutObserver.observe(container, config);
}

function modifyLayout() {
    var productContainerStyle = '#seller-profile-container #product-data { max-width: 3000px!important; width: 100%; } #seller-profile-container .product-column {width: 10%!important;}';
    GM_addStyle(productContainerStyle);
}

if(location.search.indexOf('seller=') != -1)
    addFiltraButton();