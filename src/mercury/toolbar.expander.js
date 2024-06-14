/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.Toolbar.Expander = class Expander extends window.window.Mercury.Palette {

  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.container = this.options.for;
    super(null, this.name, this.options);
    return this.element;
  }


  build() {
    let left;
    this.container.css({whiteSpace: 'normal', visibility: 'hidden', display: 'block'});
    this.container.css({visibility: 'visible'});
    this.trigger = jQuery('<div>', {class: 'mercury-toolbar-expander'}).appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
    this.element = jQuery('<div>', {class: `mercury-palette mercury-expander mercury-${this.name}-expander`, style: 'display:none'});
    return this.windowResize();
  }


  bindEvents() {
    window.window.Mercury.on('hide:dialogs', (event, dialog) => { if (dialog !== this) { return this.hide(); } });
    window.window.Mercury.on('resize', () => this.windowResize());

    super.bindEvents(...arguments);

    this.trigger.click(event => {
      event.stopPropagation();
      const hiddenButtons = [];
      for (var button of Array.from(this.container.find('.mercury-button'))) {
        button = jQuery(button);
        if (button.position().top > 5) { hiddenButtons.push(button.data('expander')); }
      }

      this.loadContent(hiddenButtons.join(''));
      return this.toggle();
    });

    return this.element.click(event => {
      const buttonName = jQuery(event.target).closest('[data-button]').data('button');
      const button = this.container.find(`.mercury-${buttonName}-button`);
      return button.click();
    });
  }


  windowResize() {
    if (jQuery(window).width() === this.container.outerWidth()) { this.trigger.show(); } else { this.trigger.hide(); }
    return this.hide();
  }


  position(keepVisible) {
    this.element.css({top: 0, left: 0, display: 'block', visibility: 'hidden'});
    const position = this.trigger.position();
    const width = this.element.width();

    if ((position.left + width) > jQuery(window).width()) { position.left = (position.left - width) + this.trigger.width(); }

    return this.element.css({
      top: position.top + this.trigger.height(),
      left: position.left,
      display: keepVisible ? 'block' : 'none',
      visibility: 'visible'
    });
  }
};
