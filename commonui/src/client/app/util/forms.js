/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// FORMS
// =======

$(function() {

  $('.form-control').each(setFormControlStyles)
    .on('focus', setFormControlStyles)
    .on('blur', setFormControlStyles);

  $('body').one('click', '.input-checkbox[data-checked=partially]', removePartiallyChecked)
    .on('focus', 'input, textarea, label', '.has-error', removeErrorStyles);

  $('.number-selector-btn').on('click', numberSelectorChange);

  $('.input-search-clear').on('click', clearSearchInput);

});

function setFormControlStyles(e) {
  var $this    = $(this);
  var thisVal  = $this.val();
  var hasFocus = e.type === 'focus';

  if ( !thisVal && !hasFocus ) {
    $this.addClass('empty');
  } else {
    $this.removeClass('empty');
  }
}

function removePartiallyChecked() {
  $(this).removeAttr('data-checked');
}

function removeErrorStyles() {
  $(this).closest('.has-error').removeClass('has-error');
}

function numberSelectorChange(e) {
  e.preventDefault();

  var $this      = $(this);
  var $container = $this.closest('.number-selector');
  var $input     = $container.find('.input-number-selector');
  var value      = $input.val() ? parseInt( $input.val(), 10) : 0;

  if ( $this.hasClass('number-selector-increase') ) {
    $input.val( value + 1 );
  } else if ( $this.hasClass('number-selector-decrease') ) {
    $input.val( value - 1 );
  }
}

function clearSearchInput() {
  var $input = $(this).siblings('.input-search');

  $input.blur().focus().val('');
}
