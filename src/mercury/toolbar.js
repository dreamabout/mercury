/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Toolbar = class Toolbar {

  constructor(options) {
    if (options == null) { options = {}; }
    this.options = options;
    this.visible = this.options.visible;
    this.build();
    this.bindEvents();
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: 'mercury-toolbar-container', style: 'width:10000px'});
    this.element.css({width: '100%'});
    this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');

    for (var toolbarName of Object.keys(window.Mercury.config.toolbars || {})) {
      var buttons = window.Mercury.config.toolbars[toolbarName];
      if (buttons._custom) { continue; }
      var toolbar = jQuery('<div>', {class: `mercury-toolbar mercury-${toolbarName}-toolbar`}).appendTo(this.element);
      if (buttons._regions) { toolbar.attr('data-regions', buttons._regions); }
      var container = jQuery('<div>', {class: 'mercury-toolbar-button-container'}).appendTo(toolbar);

      for (var buttonName of Object.keys(buttons || {})) {
        var options = buttons[buttonName];
        if (buttonName === '_regions') { continue; }
        var button = this.buildButton(buttonName, options);
        if (button) { button.appendTo(container); }
      }

      if (container.css('white-space') === 'nowrap') {
        var expander = new window.Mercury.Toolbar.Expander(toolbarName, {appendTo: toolbar, for: container});
        expander.appendTo(this.element);
      }

      if (window.Mercury.config.toolbars['primary'] && (toolbarName !== 'primary')) { toolbar.addClass('disabled'); }
    }

    if (!this.visible) { return this.element.css({display: 'none'}); }
  }


  buildButton(name, options) {
    if (name[0] === '_') { return false; }
    switch (jQuery.type(options)) {
      case 'array': // button
        var [title, summary, handled] = Array.from(options);
        return new window.Mercury.Toolbar.Button(name, title, summary, handled, {appendDialogsTo: this.element});

      case 'object': // button group
        var group = new window.Mercury.Toolbar.ButtonGroup(name, options);
        for (var action of Object.keys(options || {})) {
          var opts = options[action];
          var button = this.buildButton(action, opts);
          if (button) { button.appendTo(group); }
        }
        return group;

      case 'string': // separator
        return jQuery('<hr>', {class: `mercury-${options === '-' ? 'line-separator' : 'separator'}`});

      default: throw window.Mercury.I18n('Unknown button structure -- please provide an array, object, or string for "%s".', name);
    }
  }


  bindEvents() {
    window.Mercury.on('region:focused', (event, options) => {
      return (() => {
        const result = [];
        for (var toolbar of Array.from(this.element.find(".mercury-toolbar"))) {
          var regions;
          toolbar = jQuery(toolbar);
          if (regions = toolbar.data('regions')) {
            if (regions.split(',').indexOf(options.region.type()) > -1) { result.push(toolbar.removeClass('disabled')); } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    });

    window.Mercury.on('region:blurred', (event, options) => {
      return (() => {
        const result = [];
        for (var toolbar of Array.from(this.element.find(".mercury-toolbar"))) {
          var regions;
          toolbar = jQuery(toolbar);
          if (regions = toolbar.data('regions')) {
            if (regions.split(',').indexOf(options.region.type()) > -1) { result.push(toolbar.addClass('disabled')); } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    });

    this.element.on('click', () => window.Mercury.trigger('hide:dialogs'));

    return this.element.on('mousedown', event => event.preventDefault());
  }


  height(force) {
    if (force == null) { force = false; }
    if (this.visible || force) { return this.element.outerHeight(); } else { return 0; }
  }


  top() {
    if (this.visible) { return this.element.offset().top; } else { return 0; }
  }


  show() {
    this.visible = true;
    this.element.css({top: -this.element.outerHeight(), display: 'block'});
    return this.element.animate({top: 0}, 200, 'easeInOutSine');
  }


  hide() {
    this.visible = false;
    return this.element.hide();
  }
};
