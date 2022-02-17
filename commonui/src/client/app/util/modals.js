/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// MODAL WINDOWS
// =============

var growDuration = 300;

$(function() {

  $('.modal').on('shown.bs.modal', adjustModalWidth);

  $('.scale-iframe-modal').on('show.bs.modal', scaleIframeModal)
    .on('hide.bs.modal', resetScaleIframeModal);

});

function adjustModalWidth() {
  var $this        = $(this);
  var $thisDialog  = $this.find('.modal-dialog')
  var windowW      = $(window).width();
  var modalW       = $thisDialog.innerWidth();
  var contentW     = $thisDialog.find('.modal-content').outerWidth();

  if ( contentW > modalW && contentW < windowW ) {
    $thisDialog.animate({ 'width': contentW }, growDuration, 'easeOutQuad');
  }
}

function scaleIframeModal() {
  var $this       = $(this);
  var $thisDialog = $this.find('.modal-dialog')
  var margins     = 20;
  var windowW     = $(window).width() - margins;
  var windowH     = $(window).height() - margins;
  var modalW      = 0;
  var modalH      = 0;
  var scaleAmount = 0;

  // Wait until content is visible for size calculations
  setTimeout(function() {

    modalW      = $thisDialog.width();
    modalH      = $thisDialog.height();
    scaleAmount = 0;

    if ( modalW < windowW && modalH < windowH ) {
      var wScale = windowW / modalW;
      var hScale = windowH / modalH;

      scaleAmount = wScale < hScale ? wScale : hScale;
    }

    $thisDialog.css({ 'transform': 'scale(' + scaleAmount + ')' });

  }, 200);
}

function resetScaleIframeModal() {
  var $this       = $(this);
  var $thisDialog = $this.find('.modal-dialog')

  $thisDialog.removeAttr('style');
}
