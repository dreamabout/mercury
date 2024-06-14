/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.insertCharacter = function() {

  return this.element.find('.character').on('click', event => {
    window.window.Mercury.trigger('action', {action: 'insertHTML', value: `&${jQuery(event.target).attr('data-entity')};`});
    return this.hide();
  });
};
