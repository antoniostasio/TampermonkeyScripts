// ==UserScript==
// @name        yts movie stars
// @namespace   http://localhost
// @description Shows the ratings of every movie
// @include     https://yts.ag/*
// @version     1
// @grant       GM_addStyle
// ==/UserScript==
// @run-at document-end


function showRating() {
  var list = document.querySelectorAll('.browse-movie-wrap');
  for( var elem of list ) {
    var rating = elem.querySelector('h4.rating').textContent;
    var container = elem.querySelector('div.browse-movie-year');
    container.appendChild(document.createTextNode(' - Rating: ' + rating));
  }
}

function showGenres() {
  var list = document.querySelectorAll('.browse-movie-wrap');
  for (var elem of list) {
    var genres = elem.querySelectorAll('figcaption h4:not(.rating)');
    var genresDiv = '';
    for (var gen of genres) {
      genresDiv = genresDiv + gen.textContent + ', ';
    }
    genresDiv = genresDiv.substring(0, genresDiv.length-2);
    var newEl = document.createElement('div');
    newEl.classList.add('browse-movie-year');
    newEl.appendChild(document.createTextNode(genresDiv));
    elem.insertBefore(newEl, elem.firstElementChild);
  }
}

showRating();
showGenres();