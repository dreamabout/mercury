/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.dialogHandlers.snippetPanel = function() {
  // make the filter work
  this.element.find('input.filter').on('keyup', () => {
    const value = this.element.find('input.filter').val();
    return Array.from(this.element.find('li[data-filter]')).map((snippet) =>
      LiquidMetal.score(jQuery(snippet).data('filter'), value) === 0 ? jQuery(snippet).hide() : jQuery(snippet).show());
  });

  // when an element is dragged, set it so we have a global object
  return this.element.find('img[data-snippet]').on('dragstart', function() {
    return window.window.Mercury.snippet = {name: jQuery(this).data('snippet'), hasOptions: !(jQuery(this).data('options') === false)};
});
};
