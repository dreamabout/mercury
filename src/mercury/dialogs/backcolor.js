/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.dialogHandlers.backColor = function() {
  return this.element.find('.picker, .last-picked').on('click', event => {
    const color = jQuery(event.target).css('background-color');
    this.element.find('.last-picked').css({background: color});
    this.button.css({backgroundColor: color});
    return window.window.Mercury.trigger('action', {action: 'backColor', value: color});
  });
};
