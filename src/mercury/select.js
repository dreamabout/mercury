/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Select = class Select extends window.Mercury.Dialog {

  constructor(url, name, options) {
    this.url = url;
    this.name = name;
    if (options == null) { options = {}; }
    this.options = options;
    super(...arguments);
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: `mercury-select mercury-${this.name}-select loading`, style: 'display:none'});
    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  }


  bindEvents() {
    window.Mercury.on('hide:dialogs', (event, dialog) => { if (dialog !== this) { return this.hide(); } });

    this.element.on('mousedown', event => {
      return event.preventDefault();
    });

    return super.bindEvents(...arguments);
  }


  position(keepVisible) {
    this.element.css({top: 0, left: 0, display: 'block', visibility: 'hidden'});
    const position = this.button.position();
    const elementWidth = this.element.width();
    const elementHeight = this.element.height();
    const documentHeight = jQuery(document).height();

    let top = (position.top + (this.button.height() / 2)) - (elementHeight / 2);
    if (top < (position.top - 100)) { top = position.top - 100; }
    if (top < 20) { top = 20; }

    let height = this.loaded ? 'auto' : elementHeight;
    if ((top + elementHeight) >= (documentHeight - 20)) { height = documentHeight - top - 20; }

    let {
      left
    } = position;
    if ((left + elementWidth) > jQuery(window).width()) { left = (left - elementWidth) + this.button.width(); }

    return this.element.css({
      top,
      left,
      height,
      display: keepVisible ? 'block' : 'none',
      visibility: 'visible'
    });
  }
};
