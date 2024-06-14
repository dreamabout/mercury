/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.dialogHandlers.style = function() {
  return this.element.find('[data-class]').on('click', event => {
    const className = jQuery(event.target).data('class');
    return window.window.Mercury.trigger('action', {action: 'style', value: className});
  });
};
