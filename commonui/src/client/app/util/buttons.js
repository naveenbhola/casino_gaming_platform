/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// BUTTONS
// =======

var transitionDuration = 150;

$(function() {

  // BUTTON GROUPS WITH TOGGLE
  // =========================

  $('.btn-group').on('click', '.btn-toggle', btnGroupToggleClicked);

});

function btnGroupToggleClicked() {
  var $thisBtn     = $(this);
  var $thisGroup   = $thisBtn.closest('.btn-group');
  var $thisPanel   = $( $thisBtn.attr('href') );
  var $activeBtn   = $thisGroup.find('.btn-toggle.active');
  var $activePanel = $( $activeBtn.attr('href') );

  $activeBtn.removeClass('active');
  $thisBtn.addClass('active');

  if ( $activePanel.length !== 0 ) {
    $activePanel.removeClass('in active')
      .one('bsTransitionEnd', changeActivePanel)
      .emulateTransitionEnd(transitionDuration);
  }

  function changeActivePanel() {
    $activePanel.addClass('hidden');
    $thisPanel.removeClass('hidden')
      .fadeIn(transitionDuration)
      .addClass('in active');
  }
}
