/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Statusbar = class Statusbar {

  constructor(options) {
    if (options == null) { options = {}; }
    this.options = options;
    this.visible = this.options.visible;
    this.build();
    this.bindEvents();
  }


  build() {
    let left;
    this.element = jQuery('<div>', {class: 'mercury-statusbar'});
    this.aboutElement = jQuery('<a>', {class: "mercury-statusbar-about"}).appendTo(this.element).html(`window.Mercury Editor v${window.Mercury.version}`);
    this.pathElement = jQuery('<div>', {class: 'mercury-statusbar-path'}).appendTo(this.element);

    if (!this.visible) { this.element.css({visibility: 'hidden'}); }
    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  }


  bindEvents() {
    window.Mercury.on('region:update', (event, options) => {
      if (options.region && (jQuery.type(options.region.path) === 'function')) { return this.setPath(options.region.path()); }
    });

    return this.aboutElement.on('click', () => {
      return window.Mercury.lightview('/mercury/lightviews/about.html', {title: `window.Mercury Editor v${window.Mercury.version}`});
    });
  }


  height() {
    return this.element.outerHeight();
  }


  top() {
    const {
      top
    } = this.element.offset();
    const currentTop = parseInt(this.element.css('bottom')) < 0 ? top - this.element.outerHeight() : top;
    if (this.visible) { return currentTop; } else { return top + this.element.outerHeight(); }
  }


  setPath(elements) {
    const path = [];
    for (var element of Array.from(elements)) { path.push(`<a>${element.tagName.toLowerCase()}</a>`); }

    return this.pathElement.html(`<span><strong>${window.Mercury.I18n('Path:')} </strong>${path.reverse().join(' &raquo; ')}</span>`);
  }


  show() {
    this.visible = true;
    this.element.css({opacity: 0, visibility: 'visible'});
    return this.element.animate({opacity: 1}, 200, 'easeInOutSine');
  }


  hide() {
    this.visible = false;
    return this.element.css({visibility: 'hidden'});
  }
};
