/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// DROPDOWNS
// =========

var $window         = $(window);
var fadeInDuration  = 300;
var fadeOutDuration = 300;


$(function() {

  // Add fadeIn and fadeOut animations to Dropdown/Dropup
  $('.dropdown, .dropup').on({
    'show.bs.dropdown': function(e) {
      $(e.target).find( '.dropdown-menu' ).first().stop( true, true ).fadeIn( fadeInDuration, 'easeOutQuad' )
        .find('.dropdown-body').css({
          'max-height': getDropdownMaxHeight( this )
        });
    },
    'hide.bs.dropdown': function(e) {
      $(e.target).find( '.dropdown-menu' ).first().stop( true, true ).fadeOut( fadeOutDuration, 'easeOutQuad' );
    }
  });

  // Add closing function to Dropdown Close Button only
  $('.dropdown-menu').on('click.bs.dropdown', function(e) {
    if ( !$(e.target).hasClass( 'btn-close-dropdown' ) ) {
      e.stopPropagation();
    }
  });

  // Adjust select dropdowns to maximum width
  $('.dropdown-select').each(setDropdownSelectWidth)
    .one({ 'click.bs.dropdown': setDropdownSelectWidth });

});

function getDropdownMaxHeight(container) {
  var $container      = $(container);
  var $dropdown       = $container.find( '.dropdown-menu' );
  var isDropup        = $container.hasClass( 'dropup' );
  var isDropside      = $container.hasClass( 'dropside' );
  var windowH         = $window.height();
  var dropdownHeight  = $dropdown.height();
  var footerHeight    = $dropdown.find( '.dropdown-footer' ).height();
  var dropdownOffset  = $dropdown.offset().top;
  var safeMargin      = 50;
  var maxHeight       = 0;

  if ( isDropup ) {
    maxHeight = dropdownHeight + dropdownOffset - footerHeight - safeMargin;
  } else if ( isDropside ) {
    maxHeight = dropdownHeight + ( dropdownOffset * 2 ) - footerHeight - ( safeMargin * 2 );
  } else {
    maxHeight = windowH - dropdownOffset - footerHeight - safeMargin;
  }

  return maxHeight;
}

function setDropdownSelectWidth() {
  var $container = $(this);
  var $toggle    = $container.find( '.dropdown-toggle' );
  var $dropdown  = $container.find( '.dropdown-menu' );
  var toggleW    = Math.ceil( $toggle.outerWidth() );
  var newW       = 0;

  if ( $toggle.length === 0 || $dropdown.length === 0 || !toggleW ) {
    return;
  }

  $dropdown.addClass('init').show();

  var dropdownW  = Math.ceil( $dropdown.outerWidth() );

  if ( dropdownW > toggleW ) {
    newW = dropdownW;
    $toggle.addClass('dropdown-toggle-wide');
  }

  if ( newW > toggleW ) {
    $toggle.innerWidth( newW );
    $dropdown.innerWidth( newW );
  }

  $dropdown.removeClass('init').hide();
}
