/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.Toolbar.Button = class Button {

  constructor(name, title, summary = null, types, options) {
    this.name = name;
    this.title = title;
    this.summary = summary;
    if (types == null) { types = {}; }
    this.types = types;
    if (options == null) { options = {}; }
    this.options = options;
    if (this.title) { this.title = window.window.Mercury.I18n(this.title); }
    if (this.summary) { this.summary = window.window.Mercury.I18n(this.summary); }

    this.build();
    this.bindEvents();
    return this.element;
  }


  build() {
    this.element = jQuery('<div>', {title: this.summary != null ? this.summary : this.title, class: `mercury-button mercury-${this.name}-button`}).html(`<em>${this.title}</em>`);
    this.element.data('expander', `<div class=\"mercury-expander-button\" data-button=\"${this.name}\"><em></em><span>${this.title}</span></div>`);

    this.handled = {};

    return (() => {
      const result1 = [];
      for (var type of Object.keys(this.types || {})) {
        var mixed = this.types[type];
        switch (type) {
          case 'preload': result1.push(true); break;

          case 'regions':
            this.element.addClass('disabled');
            result1.push(this.handled[type] = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed);
            break;

          case 'toggle':
            result1.push(this.handled[type] = true);
            break;

          case 'mode':
            result1.push(this.handled[type] = mixed === true ? this.name : mixed);
            break;

          case 'context':
            result1.push(this.handled[type] = jQuery.isFunction(mixed) ? mixed : window.window.Mercury.Toolbar.Button.contexts[this.name]);
            break;

          case 'palette':
            this.element.addClass("mercury-button-palette");
            var result = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed;
            result1.push(this.handled[type] = typeof result === 'string' ? new window.window.Mercury.Palette(result, this.name, this.defaultDialogOptions()) : result);
            break;

          case 'select':
            this.element.addClass("mercury-button-select").find('em').html(this.title);
            result = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed;
            result1.push(this.handled[type] = typeof result === 'string' ? new window.window.Mercury.Select(result, this.name, this.defaultDialogOptions()) : result);
            break;

          case 'panel':
            this.element.addClass('mercury-button-panel');
            this.handled['toggle'] = true;
            result = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed;
            result1.push(this.handled[type] = typeof result === 'string' ? new window.window.Mercury.Panel(result, this.name, this.defaultDialogOptions()) : result);
            break;

          case 'modal':
            result1.push(this.handled[type] = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed);
            break;

          case 'lightview':
            result1.push(this.handled[type] = jQuery.isFunction(mixed) ? mixed.call(this, this.name) : mixed);
            break;

          default: throw window.window.Mercury.I18n('Unknown button type \"%s\" used for the \"%s\" button.', type, this.name);
        }
      }
      return result1;
    })();
  }


  bindEvents() {
    window.window.Mercury.on('button', (event, options) => { if (options.action === this.name) { return this.element.click(); } });
    window.window.Mercury.on('mode', (event, options) => { if ((this.handled.mode === options.mode) && this.handled.toggle) { return this.togglePressed(); } });

    window.window.Mercury.on('region:update', (event, options) => {
      let element;
      if (this.handled.context && options.region && (jQuery.type(options.region.currentElement) === 'function')) {
        element = options.region.currentElement();
        if (element.length && this.handled.context.call(this, element, options.region.element)) {
          return this.element.addClass('active');
        } else {
          return this.element.removeClass('active');
        }
      } else {
        return this.element.removeClass('active');
      }
    });

    window.window.Mercury.on('region:focused', (event, options) => {
      if (this.handled.regions && options.region && options.region.type()) {
        if (this.handled.regions.indexOf(options.region.type()) > -1) {
          return this.element.removeClass('disabled');
        } else {
          return this.element.addClass('disabled');
        }
      }
    });

    window.window.Mercury.on('region:blurred', () => {
      if (this.handled.regions) { return this.element.addClass('disabled'); }
    });

    this.element.on('mousedown', () => {
      return this.element.addClass('active');
    });

    this.element.on('mouseup', () => {
      return this.element.removeClass('active');
    });

    return this.element.on('click', event => {
      if (this.element.closest('.disabled').length) { return; }
      return this.handleClick(event);
    });
  }


  handleClick(event) {
    let handled = false;
    for (var type of Object.keys(this.handled || {})) {
      var mixed = this.handled[type];
      switch (type) {
        case 'toggle':
          if (!this.handled.mode) { this.togglePressed(); }
          break;

        case 'mode':
          handled = true;
          window.window.Mercury.trigger('mode', {mode: mixed});
          break;

        case 'modal':
          handled = this.handleModal(event);
          break;

        case 'lightview':
          handled = this.handleLightview(event);
          break;

        case 'palette': case 'select': case 'panel':
          handled = this.handleDialog(event, type);
          break;
      }
    }

    if (!handled) { window.window.Mercury.trigger('action', {action: this.name}); }
    if (this.options['regions'] && this.options['regions'].length) { return window.window.Mercury.trigger('focus:frame'); }
  }


  handleModal(event) {
    window.window.Mercury.modal(this.handled.modal, {title: this.summary || this.title, handler: this.name});
    return true;
  }


  handleLightview(event) {
    window.window.Mercury.lightview(this.handled.lightview, {title: this.summary || this.title, handler: this.name, closeButton: true});
    return true;
  }


  handleDialog(event, type) {
    event.stopPropagation();
    this.handled[type].toggle();
    return true;
  }


  defaultDialogOptions() {
    return {
      title: this.summary || this.title,
      preload: this.types.preload,
      appendTo: this.options.appendDialogsTo || 'body',
      closeButton: true,
      for: this.element
    };
  }


  togglePressed() {
    return this.element.toggleClass('pressed');
  }
};



// Button contexts
window.window.Mercury.Toolbar.Button.contexts = {

  backColor(node) { return this.element.css('background-color', node.css('background-color')); },

  foreColor(node) { return this.element.css('background-color', node.css('color')); },

  bold(node) {
    const weight = node.css('font-weight');
    return (weight === 'bold') || (weight > 400);
  },

  italic(node) { return node.css('font-style') === 'italic'; },

  // overline is weird because <u> and <strike> override text-decoration -- we can't always tell without checking parents
  overline(node) {
    if (node.css('text-decoration') === 'overline') { return true; }
    for (var parent of Array.from(node.parentsUntil(this.element))) {
      if (jQuery(parent).css('text-decoration') === 'overline') { return true; }
    }
    return false;
  },

  strikethrough(node, region) { return (node.css('text-decoration') === 'line-through') || !!node.closest('strike', region).length; },

  underline(node, region) { return (node.css('text-decoration') === 'underline') || !!node.closest('u', region).length; },

  subscript(node, region) { return !!node.closest('sub', region).length; },

  superscript(node, region) { return !!node.closest('sup', region).length; },

  justifyLeft(node) { return node.css('text-align').indexOf('left') > -1; },

  justifyCenter(node) { return node.css('text-align').indexOf('center') > -1; },

  justifyRight(node) { return node.css('text-align').indexOf('right') > -1; },

  justifyFull(node) { return node.css('text-align').indexOf('justify') > -1; },

  insertOrderedList(node, region) { return !!node.closest('ol', region.element).length; },

  insertUnorderedList(node, region) { return !!node.closest('ul', region.element).length; }
};
