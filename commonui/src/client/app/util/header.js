/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// HEADER SEARCH
// =============

var searchFadeSpeed  = 150;
var searchSlideSpeed = 300;
var blurTimeout;

$(function() {

  $('.navbar-search-show').on('click', showHeaderSearch);

  $('.navbar-input-search').on('blur', hideHeaderSearch);

});

function showHeaderSearch() {
  $('.navbar-search-show').fadeOut(searchFadeSpeed, function() {
    $('.navbar-input-search-wrapper').animate({ width: 'toggle'}, searchSlideSpeed);
    $('.navbar-input-search').focus();
  });
}

function hideHeaderSearch() {
  var $this = $(this);

  clearTimeout(blurTimeout);

  blurTimeout = setTimeout(hideSearchInput, 150);

  function hideSearchInput() {
    if ( $this.is(':focus') ) return;

    $('.navbar-input-search-wrapper').animate({ width: 'toggle'}, searchSlideSpeed, function() {
      $('.navbar-search-show').fadeIn(searchFadeSpeed);
    });
  }
}
