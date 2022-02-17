/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// DAELER SHOW CARDS
// ===============

var fadeDuration = 300;

$(function() {

  $('.dealer').on('click', '.btn-show-cards', showDealCards)
    .on('click', '.btn-hide-cards', hideDealCards);

});

function showDealCards() {

  $(this).hide();
  $('.btn-hide-cards').removeClass('hidden').show();

  $('.dealer-notification-bar').stop(true, true).fadeOut(fadeDuration);
  $('.dealer-deal').stop(true, true).fadeIn(fadeDuration);

}

function hideDealCards() {

  $(this).hide();
  $('.btn-show-cards').show();

  $('.dealer-notification-bar').stop(true, true).fadeIn(fadeDuration);
  $('.dealer-deal').stop(true, true).fadeOut(fadeDuration);

}
