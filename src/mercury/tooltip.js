/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.tooltip = function(forElement, content, options) {
  if (options == null) { options = {}; }
  window.Mercury.tooltip.show(forElement, content, options);
  return window.Mercury.tooltip;
};

jQuery.extend(window.Mercury.tooltip, {

  show(forElement, content, options) {
    this.forElement = forElement;
    this.content = content;
    if (options == null) { options = {}; }
    this.options = options;
    this.document = this.forElement.get(0).ownerDocument;
    this.initialize();
    if (this.visible) { return this.update(); } else { return this.appear(); }
  },


  initialize() {
    if (this.initialized) { return; }
    this.build();
    this.bindEvents();
    return this.initialized = true;
  },


  build() {
    let left;
    this.element = jQuery('<div>', {class: 'mercury-tooltip'});
    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  },


  bindEvents() {
    window.Mercury.on('resize', () => { if (this.visible) { return this.position(); } });

    this.element.on('mousedown', function(event) {
      event.preventDefault();
      return event.stopPropagation();
    });

    for (var parent of Array.from(this.forElement.parentsUntil(jQuery('body', this.document)))) {
      if (!(parent.scrollHeight > parent.clientHeight)) { continue; }
      jQuery(parent).on('scroll', () => {
        if (this.visible) { return this.position(); }
      });
    }

    return jQuery(this.document).on('scroll', () => {
      if (this.visible) { return this.position(); }
    });
  },


  appear() {
    this.update();

    this.element.show();
    return this.element.animate({opacity: 1}, 200, 'easeInOutSine', () => {
      return this.visible = true;
    });
  },


  update() {
    this.element.html(this.content);
    return this.position();
  },


  position() {
    const offset = this.forElement.offset();
    const width = this.element.width();

    const top = offset.top + (window.Mercury.displayRect.top - jQuery(this.document).scrollTop()) + this.forElement.outerHeight();
    let left = offset.left - jQuery(this.document).scrollLeft();

    if ((left + width + 25) > window.Mercury.displayRect.width) { left = left - (left + width + 25) - window.Mercury.displayRect.width; }
    left = left <= 0 ? 0 : left;

    return this.element.css({
      top,
      left
    });
  },


  hide() {
    if (!this.initialized) { return; }
    this.element.hide();
    return this.visible = false;
  }
}
);

