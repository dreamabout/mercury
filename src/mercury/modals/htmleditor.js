/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.htmlEditor = function() {

  // fill the text area with the content
  const content = window.window.Mercury.region.content(null, true, false);
  this.element.find('textarea').val(content);

  // replace the contents on form submit
  return this.element.find('form').on('submit', event => {
    event.preventDefault();
    const value = this.element.find('textarea').val();
    window.window.Mercury.trigger('action', {action: 'replaceHTML', value});
    return this.hide();
  });
};
