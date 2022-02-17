/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// ALERTS DROPDOWN
// ===============

var slideSpeed = 300;

$(function() {

  $('.dropdown-alert-filter-link').on('click', toggleAlertsVisibility);

});

function toggleAlertsVisibility() {
  var $this         = $(this);
  var $thisTarget   = $( $this.data('target') );
  var $container    = $this.closest('.dropdown-alert-filters-header');
  var $activeBtn    = $container.find('.active');
  var $activeTarget = $thisTarget.siblings('.in');

  if ( $thisTarget.length == 0 ) return;

  $activeBtn.removeClass('active');

  $this.addClass('active');

  $activeTarget.not($thisTarget).slideUp(slideSpeed, function() {
    $(this).removeClass('in');
  });

  $thisTarget.slideDown(slideSpeed).addClass('in');
}
