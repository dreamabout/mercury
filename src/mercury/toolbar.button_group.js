/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.Toolbar.ButtonGroup = class ButtonGroup {

  constructor(name, options) {
    this.name = name;
    if (options == null) { options = {}; }
    this.options = options;
    this.build();
    this.bindEvents();
    this.regions = this.options._regions;
    return this.element;
  }


  build() {
    this.element = jQuery('<div>', {class: `mercury-button-group mercury-${this.name}-group`});
    if (this.options._context || this.options._regions) {
      return this.element.addClass('disabled');
    }
  }


  bindEvents() {
    window.window.Mercury.on('region:update', (event, options) => {
      const context = window.window.Mercury.Toolbar.ButtonGroup.contexts[this.name];
      if (context) {
        if (options.region && (jQuery.type(options.region.currentElement) === 'function')) {
          const element = options.region.currentElement();
          if (element.length && context.call(this, element, options.region.element)) {
            return this.element.removeClass('disabled');
          } else {
            return this.element.addClass('disabled');
          }
        }
      }
    });

    window.window.Mercury.on('region:focused', (event, options) => {
      if (this.regions && options.region && options.region.type()) {
        if (this.regions.indexOf(options.region.type()) > -1) {
          if (!this.options._context) { return this.element.removeClass('disabled'); }
        } else {
          return this.element.addClass('disabled');
        }
      }
    });

    return window.window.Mercury.on('region:blurred', (event, options) => {
      if (this.options.regions) { return this.element.addClass('disabled'); }
    });
  }
};



// ButtonGroup contexts
window.window.Mercury.Toolbar.ButtonGroup.contexts =

  {table(node, region) { return !!node.closest('table', region).length; }};
