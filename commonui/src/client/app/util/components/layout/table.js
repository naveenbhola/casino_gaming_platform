/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// TABLES
// ======

$(function() {

  // STICKY TABLE HEADERS
  // ====================

  $('.sticky-table-header').each( stickyTableHeader );


  // ALERTS TABLE
  // ============

  $('.table-alerts').on('click', '.table-action-checkbox', toggleCheckboxActions);

});

function stickyTableHeader() {
  var $this              = $(this);
  var insideModal        = $this.closest('.modal').length;
  var $container         = insideModal ? $this.closest('.modal-content') : $this.closest('.main-content');
  var mainContentBaseTop = insideModal ? 0 : 25;
  var topOffset          = parseInt( $container.css('padding-top'), 10) - mainContentBaseTop;
      topOffset          = topOffset < 0 ? 0 : topOffset;

  if ( insideModal ) {
    $this.stickyTableHeaders({
      fixedOffset: topOffset,
      marginTop: -10,
      scrollableArea: $container
    });
  } else {
    $this.stickyTableHeaders({
      fixedOffset: topOffset
    });
  }
}

function toggleCheckboxActions() {
  var $this                = $(this);
  var $thisTable           = $this.closest('table');
  var $thisCheckboxes      = $thisTable.find('.table-action-checkbox');
  var $thisAllCheckbox     = $thisTable.find('.toggle-all-checkbox');

  if ( $this.hasClass('toggle-all-checkbox') ) {
    $thisCheckboxes.prop('checked', this.checked);
  }

  if ( $thisCheckboxes.is(':checked') ) {
    $thisAllCheckbox.attr('data-checked', 'partially');
    $('.table-action-option.not-visible').removeClass('not-visible');
  } else {
    $thisAllCheckbox.removeAttr('data-checked');
    $('.table-action-option.hideable').addClass('not-visible');
  }
}
