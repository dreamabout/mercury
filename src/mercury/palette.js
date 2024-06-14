/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Palette = class Palette extends window.Mercury.Dialog {

  constructor(url, name, options) {
    this.url = url;
    this.name = name;
    if (options == null) { options = {}; }
    this.options = options;
    super(...arguments);
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: `mercury-palette mercury-${this.name}-palette loading`, style: 'display:none'});
    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  }


  bindEvents() {
    window.Mercury.on('hide:dialogs', (event, dialog) => { if (dialog !== this) { return this.hide(); } });
    return super.bindEvents(...arguments);
  }


  position(keepVisible) {
    this.element.css({top: 0, left: 0, display: 'block', visibility: 'hidden'});
    const position = this.button.position();
    const width = this.element.width();

    if ((position.left + width) > jQuery(window).width()) { position.left = (position.left - width) + this.button.width(); }

    return this.element.css({
      top: position.top + this.button.height(),
      left: position.left,
      display: keepVisible ? 'block' : 'none',
      visibility: 'visible'
    });
  }
};
