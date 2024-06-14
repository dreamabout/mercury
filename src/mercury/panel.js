/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Panel = class Panel extends window.Mercury.Dialog {

  constructor(url, name, options) {
    this.url = url;
    this.name = name;
    if (options == null) { options = {}; }
    this.options = options;
    super(...arguments);
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: 'mercury-panel loading', style: 'display:none;'});
    this.titleElement = jQuery(`<h1><span>${window.Mercury.I18n(this.options.title)}</span></h1>`).appendTo(this.element);
    this.paneElement = jQuery('<div>', {class: 'mercury-panel-pane'}).appendTo(this.element);

    if (this.options.closeButton) {
      jQuery('<a/>', {class: 'mercury-panel-close'}).appendTo(this.titleElement).css({opacity: 0});
    }

    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  }


  bindEvents() {
    window.Mercury.on('resize', () => this.position(this.visible));

    window.Mercury.on('hide:panels', (event, panel) => {
      if (panel === this) { return; }
      this.button.removeClass('pressed');
      return this.hide();
    });

    this.titleElement.find('.mercury-panel-close').on('click', function(event) {
      event.preventDefault();
      return window.Mercury.trigger('hide:panels');
    });

    this.element.on('mousedown', event => event.stopPropagation());

    this.element.on('ajax:beforeSend', (event, xhr, options) => {
      return options.success = content => {
        this.loadContent(content);
        return this.resize();
      };
    });

    return super.bindEvents(...arguments);
  }


  show() {
    window.Mercury.trigger('hide:panels', this);
    return super.show(...arguments);
  }


  resize() {
    this.titleElement.find('.mercury-panel-close').css({opacity: 0});
    this.paneElement.css({display: 'none'});
    const preWidth = this.element.width();

    this.paneElement.css({visibility: 'hidden', width: 'auto', display: 'block'});
    const postWidth = this.element.width();

    this.paneElement.css({visibility: 'visible', display: 'none'});
    const position = this.element.offset();
    this.element.animate({left: position.left - (postWidth - preWidth), width: postWidth}, 200, 'easeInOutSine', () => {
      this.titleElement.find('.mercury-panel-close').animate({opacity: 1}, 100);

      this.paneElement.css({display: 'block', width: postWidth});
      jQuery(this.paneElement.find('.focusable').get(0)).focus();
      return this.makeDraggable();
    });

    if (!this.visible) { return this.hide(); }
  }


  position(keepVisible) {
    let left;
    this.element.css({display: 'block', visibility: 'hidden'});
    const offset = this.element.offset();
    const elementWidth = this.element.width();
    const height = window.Mercury.displayRect.height - 16;

    const paneHeight = height - this.titleElement.outerHeight();
    this.paneElement.css({height: paneHeight, overflowY: paneHeight < 30 ? 'hidden' : 'auto'});

    if (!this.moved) { left = window.Mercury.displayRect.width - elementWidth - 20; }
    if (left <= 8) { left = 8; }

    if (this.pinned || ((elementWidth + offset.left) > (window.Mercury.displayRect.width - 20))) {
      left = window.Mercury.displayRect.width - elementWidth - 20;
    }

    this.element.css({
      top: window.Mercury.displayRect.top + 8,
      left,
      height,
      display: keepVisible ? 'block' : 'none',
      visibility: 'visible'
    });

    this.makeDraggable();
    if (!keepVisible) { return this.element.hide(); }
  }


  loadContent(data) {
    this.loaded = true;
    this.element.removeClass('loading');
    this.paneElement.css({visibility: 'hidden'});
    this.paneElement.html(data);
    if (window.Mercury.config.localization.enabled) { return this.paneElement.localize(window.Mercury.locale()); }
  }


  makeDraggable() {
    const elementWidth = this.element.width();
    return this.element.draggable({
      handle: 'h1 span',
      axis: 'x',
      opacity: 0.70,
      scroll: false,
      addClasses: false,
      iframeFix: true,
      containment: [8, 0, window.Mercury.displayRect.width - elementWidth - 20, 0],  //[x1, y1, x2, y2]
      stop: () => {
        const {
          left
        } = this.element.offset();
        this.moved = true;
        this.pinned = left > (window.Mercury.displayRect.width - elementWidth - 30) ? true : false;
        return true;
      }
    });
  }
};
