/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.SnippetToolbar = class SnippetToolbar extends window.window.Mercury.Toolbar {

  constructor(document, options) {
    this.document = document;
    if (options == null) { options = {}; }
    this.options = options;
    this._boundEvents = [];
    super(this.options);
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: 'mercury-toolbar mercury-snippet-toolbar', style: 'display:none'});
    this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');

    return (() => {
      const result = [];
      for (var buttonName of Object.keys(window.window.Mercury.config.toolbars.snippets || {})) {
        var options = window.window.Mercury.config.toolbars.snippets[buttonName];
        var button = this.buildButton(buttonName, options);
        if (button) { result.push(button.appendTo(this.element)); } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }


  bindEvents() {
    this.bindReleasableEvent(window.Mercury, 'show:toolbar', (event, options) => {
      if (!options.snippet) { return; }
      options.snippet.mouseout(() => this.hide());
      return this.show(options.snippet);
    });

    this.bindReleasableEvent(window.Mercury, 'hide:toolbar', (event, options) => {
      if (!options.type || (options.type !== 'snippet')) { return; }
      return this.hide(options.immediately);
    });

    this.bindReleasableEvent(jQuery(this.document), 'scroll', () => {
      if (this.visible) { return this.position(); }
    });

    this.element.mousemove(() => {
      return clearTimeout(this.hideTimeout);
    });

    return this.element.mouseout(() => {
      return this.hide();
    });
  }


  bindReleasableEvent(target, eventName, handler){
    target.on(eventName, handler);
    return this._boundEvents.push([target, eventName, handler]);
  }


  show(snippet) {
    this.snippet = snippet;
    window.window.Mercury.tooltip.hide();
    this.position();
    return this.appear();
  }


  position() {
    const offset = this.snippet.offset();

    const top = ((offset.top + window.window.Mercury.displayRect.top) - jQuery(this.document).scrollTop() - this.height()) + 10;
    const left = offset.left - jQuery(this.document).scrollLeft();

    return this.element.css({
      top,
      left
    });
  }


  appear() {
    clearTimeout(this.hideTimeout);
    if (this.visible) { return; }
    this.visible = true;
    this.element.css({display: 'block', opacity: 0});
    return this.element.stop().animate({opacity: 1}, 200, 'easeInOutSine');
  }


  hide(immediately) {
    if (immediately == null) { immediately = false; }
    clearTimeout(this.hideTimeout);
    if (immediately) {
      this.element.hide();
      return this.visible = false;
    } else {
      return this.hideTimeout = setTimeout(() => {
        this.element.stop().animate({opacity: 0}, 300, 'easeInOutSine', () => {
          return this.element.hide();
        });
        return this.visible = false;
      }
      , 500);
    }
  }

  release() {
    this.element.off();
    this.element.remove();
    for (var [target, eventName, handler] of Array.from(this._boundEvents)) { target.off(eventName, handler); }
    return this._boundEvents = [];
  }
};

