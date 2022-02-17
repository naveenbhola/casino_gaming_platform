/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// PLAYER CARDS FLIP
// =================

$(function() {

  $('.btn-group').on('click', '.btn-toggle-player-cards:not(.active)', flipCards);

  function flipCards() {
    if ( $('.flip-game-player-cards').length !== 0 ) {
      $('.flip-game-player-cards .game-player-card:not(.empty)').toggleClass('flip-back');
    }
  }

});
