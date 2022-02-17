/*!
 * Perfect Pay UI Frame Work v1.0.0
*/

// LISTS
// =====

//var slideDuration = 300;

$(function() {

  $('.list').on('click', '.expandable-list-item', expandListItem);

});

function expandListItem() {
  var $this = $(this);

  $this.find('.expandable-list-content.hidden').removeClass('hidden').hide();
  $this.find('.expandable-list-content').slideToggle();
  $this.find('.caret').toggleClass('caret-right');
}
