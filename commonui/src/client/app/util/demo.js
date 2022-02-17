/*!
 * Perfect Pay UI Frame Work v1.0.0
 * DEMO functions
*/

var slideDuration  = 300;

$(function() {

  // DROPDOWNS
  // =========

  $('.demo-tall-dropdown-content').slideUp(0);

  // Add height toggle function to dropdown demo buttons
  $('.demo-toggle-dropdown-height').on('click', function(e) {
    var $dropdown  = $(e.target).closest('.dropdown-menu');

    $dropdown.find('.demo-tall-dropdown-content').slideToggle(slideDuration, 'easeOutQuad');
  });


  // TABLES
  // ======

  if ( $('.sticky-table-header').length !== 0 ) {
    $('.sticky-table-header').stickyTableHeaders();
  }


  // PLAYER CARDS
  // ============

  if ( $('.game-player-card').length !== 0 ) {
    setInterval(flipCards, 3000);
  }

  function flipCards() {
    $('.game-player-card:not(.empty)').toggleClass('flip-back');
  }


  // GAME HISTORY
  // ============

  if ( $('.demo-history-edit').length !== 0 ) {

    $('.demo-history-edit').click(function() {
      $(this).addClass('hidden');
      $('.demo-history-cancel, .demo-history-save').removeClass('hidden');
      $('.current-game').addClass('edit-mode');
    });

    $('.demo-history-cancel, .demo-history-save').click(function() {
      $('.demo-history-cancel, .demo-history-save').addClass('hidden');
      $('.demo-history-edit').removeClass('hidden');
      $('.current-game').removeClass('edit-mode');
    });

  }


  // ALERT BAR
  // =========

  $('.demo-toggle-alert-bar').on('click', function() {
    $('.fixed-alert-bar').toggleClass('visible');
  });


  // DATE/TIME PICKER
  // ================

  if($('#datetimepicker1').datetimepicker) {
    $('#datetimepicker1').datetimepicker({
      language: 'en',
      pick12HourFormat: true
    });
  }
});
