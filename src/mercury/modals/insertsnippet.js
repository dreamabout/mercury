/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.insertSnippet = function() {

  return this.element.find('form').on('submit', event => {
    let snippet;
    event.preventDefault();
    const serializedForm = this.element.find('form').serializeObject();
    if (window.window.Mercury.snippet) {
      ({
        snippet
      } = window.Mercury);
      snippet.setOptions(serializedForm);
      window.window.Mercury.snippet = null;
    } else {
      snippet = window.window.Mercury.Snippet.create(this.options.snippetName, serializedForm);
    }
    window.window.Mercury.trigger('action', {action: 'insertSnippet', value: snippet});
    return this.hide();
  });
};

