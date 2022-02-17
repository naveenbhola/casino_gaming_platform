/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// ANTENNA VIEW
// ============

$(function() {

  $(window).on('load resize', scaleDealerIframe);

});

function scaleDealerIframe() {

  var $topSection = $('.antenna-rows-top');
  var $iframe     = $('.iframe-dealer-screen');
  var $container  = $('.iframe-dealer-screen-container');
  var $oWrapper   = $('.iframe-dealer-screen-outer-wrapper');
  var iframeW     = $iframe.attr('width');
  var iframeH     = $iframe.attr('height');
  var $equalCols  = $('.iframe-dealer-screen-sidebar, .iframe-dealer-screen-inner-wrapper');

  if ( $iframe.length === 0 || $container.length === 0 || $oWrapper.length === 0 || $equalCols.length === 0 || !iframeW || !iframeH ) {
    return;
  }

  // Reset elements for available space calculations
  $iframe.hide();

  $equalCols.height('');

  $topSection.addClass('standby');


  var containerW  = $container.outerWidth();
  var oWrapperH   = $oWrapper.outerHeight();
  var orgAspectR  = iframeH / iframeW;
  var newAspectR  = oWrapperH / containerW;

  var scaleAmount = newAspectR < orgAspectR ?
    // Available space is wider than iframe would fill, so we scale by max height
    oWrapperH / iframeH :
    // Available space is taller than iframe would fill, so we scale by max width
    containerW / iframeW;


  $equalCols.height( iframeH * scaleAmount );

  $iframe.css({ 'transform': 'scale('+scaleAmount+')' }).show();

  $topSection.removeClass('standby');

}
