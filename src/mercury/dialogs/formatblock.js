/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.dialogHandlers.formatblock = function() {
  return this.element.find('[data-tag]').on('click', event => {
    const tag = jQuery(event.target).data('tag');
    return window.window.Mercury.trigger('action', {action: 'formatblock', value: tag});
  });
};
