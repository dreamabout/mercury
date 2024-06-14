/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.lightview = function(url, options) {
  if (options == null) { options = {}; }
  if (!window.Mercury.lightview.instance) { window.Mercury.lightview.instance = new window.Mercury.Lightview(url, options); }
  window.Mercury.lightview.instance.show(url, options);
  return window.Mercury.lightview.instance;
};


window.Mercury.Lightview = class Lightview {

  constructor(url, options) {
    this.hide = this.hide.bind(this);
    this.url = url;
    if (options == null) { options = {}; }
    this.options = options;
  }


  show(url, options) {
    this.url = url || this.url;
    this.options = options || this.options;
    if (this.options.ujsHandling !== false) { this.options.ujsHandling = true; }

    window.Mercury.trigger('focus:window');
    this.initializeLightview();
    if (this.visible) { this.update(); } else { this.appear(); }
    if (this.options.content) {
      return setTimeout((() => this.loadContent(this.options.content)), 500);
    }
  }


  initializeLightview() {
    if (this.initialized) { return; }
    this.build();
    this.bindEvents();
    return this.initialized = true;
  }


  build() {
    let left, left1;
    this.element = jQuery('<div>', {class: 'mercury-lightview loading'});
    this.element.html('<h1 class="mercury-lightview-title"><span></span></h1>');
    this.element.append('<div class="mercury-lightview-content"></div>');

    this.overlay = jQuery('<div>', {class: 'mercury-lightview-overlay'});

    this.titleElement = this.element.find('.mercury-lightview-title');
    if (this.options.closeButton) { this.titleElement.append('<a class="mercury-lightview-close"></a>'); }

    this.contentElement = this.element.find('.mercury-lightview-content');

    this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
    return this.overlay.appendTo((left1 = jQuery(this.options.appendTo).get(0)) != null ? left1 : 'body');
  }


  bindEvents() {
    window.Mercury.on('refresh', () => this.resize(true));
    window.Mercury.on('resize', () => { if (this.visible) { return this.position(); } });

    this.overlay.on('click', () => {
      if (!this.options.closeButton) { return this.hide(); }
    });

    this.titleElement.find('.mercury-lightview-close').on('click', () => {
      return this.hide();
    });

    if (this.options.ujsHandling) {
      this.element.on('ajax:beforeSend', (event, xhr, options) => {
        return options.success = content => {
          return this.loadContent(content);
        };
      });
    }

    return jQuery(document).on('keydown', event => {
       if ((event.keyCode === 27) && this.visible) { return this.hide(); }
    });
  }


  appear() {
    this.showing = true;
    this.position();

    this.overlay.show().css({opacity: 0});
    return this.overlay.animate({opacity: 1}, 200, 'easeInOutSine', () => {
      this.setTitle();
      this.element.show().css({opacity: 0});
      return this.element.stop().animate({opacity: 1}, 200, 'easeInOutSine', () => {
        this.visible = true;
        this.showing = false;
        return this.load();
      });
    });
  }


  resize(keepVisible) {
    const visibility = keepVisible ? 'visible' : 'hidden';

    const viewportWidth = window.Mercury.displayRect.width;
    const viewportHeight = window.Mercury.displayRect.fullHeight;

    const titleHeight = this.titleElement.outerHeight();

    let width = this.contentElement.outerWidth();
    if ((width > (viewportWidth - 40)) || this.options.fullSize) { width = viewportWidth - 40; }

    if (this.contentPane) { this.contentPane.css({height: 'auto'}); }
    this.contentElement.css({height: 'auto', visibility, display: 'block'});

    let height = this.contentElement.outerHeight() + titleHeight;
    if ((height > (viewportHeight - 20)) || this.options.fullSize) { height = viewportHeight - 20; }

    if (width < 300) { width = 300; }
    if (height < 150) { height = 150; }

    return this.element.stop().animate({top: ((viewportHeight - height) / 2) + 10, left: (window.Mercury.displayRect.width - width) / 2, width, height}, 200, 'easeInOutSine', () => {
      this.contentElement.css({visibility: 'visible', display: 'block'});
      if (this.contentPane.length) {
        this.contentElement.css({height: height - titleHeight, overflow: 'visible'});
        const controlHeight = this.contentControl.length ? this.contentControl.outerHeight() : 0;
        this.contentPane.css({height: height - titleHeight - controlHeight - 40});
        return this.contentPane.find('.mercury-display-pane').css({width: width - 40});
      } else {
        return this.contentElement.css({height: height - titleHeight - 30, overflow: 'auto'});
      }
    });
  }


  position() {
    const viewportWidth = window.Mercury.displayRect.width;
    const viewportHeight = window.Mercury.displayRect.fullHeight;

    if (this.contentPane) { this.contentPane.css({height: 'auto'}); }
    this.contentElement.css({height: 'auto'});
    this.element.css({width: 'auto', height: 'auto', display: 'block', visibility: 'hidden'});

    let width = this.contentElement.width() + 40;
    let height = this.contentElement.height() + this.titleElement.outerHeight() + 30;

    if ((width > (viewportWidth - 40)) || this.options.fullSize) { width = viewportWidth - 40; }
    if ((height > (viewportHeight - 20)) || this.options.fullSize) { height = viewportHeight - 20; }

    if (width < 300) { width = 300; }
    if (height < 150) { height = 150; }

    const titleHeight = this.titleElement.outerHeight();
    if (this.contentPane && this.contentPane.length) {
      this.contentElement.css({height: height - titleHeight, overflow: 'visible'});
      const controlHeight = this.contentControl.length ? this.contentControl.outerHeight() : 0;
      this.contentPane.css({height: height - titleHeight - controlHeight - 40});
      this.contentPane.find('.mercury-display-pane').css({width: width - 40});
    } else {
      this.contentElement.css({height: height - titleHeight - 30, overflow: 'auto'});
    }

    return this.element.css({
      top: ((viewportHeight - height) / 2) + 10,
      left: (viewportWidth - width) / 2,
      width,
      height,
      display: this.visible ? 'block' : 'none',
      visibility: 'visible'
    });
  }


  update() {
    this.reset();
    this.resize();
    return this.load();
  }


  load() {
    this.setTitle();
    if (!this.url) { return; }
    this.element.addClass('loading');
    if (window.Mercury.preloadedViews[this.url]) {
      return setTimeout((() => this.loadContent(window.Mercury.preloadedViews[this.url])), 10);
    } else {
      return jQuery.ajax(this.url, {
        headers: window.Mercury.ajaxHeaders(),
        type: this.options.loadType || 'GET',
        data: this.options.loadData,
        success: data => this.loadContent(data),
        error: () => {
          this.hide();
          return window.Mercury.notify('window.Mercury was unable to load %s for the lightview.', this.url);
        }
      });
    }
  }


  loadContent(data, options = null) {
    this.initializeLightview();
    this.options = options || this.options;
    this.setTitle();
    this.loaded = true;
    this.element.removeClass('loading');
    this.contentElement.html(data);
    this.contentElement.css({display: 'none', visibility: 'hidden'});

    // for complex lightview content, we provide panes and controls
    this.contentPane = this.element.find('.mercury-display-pane-container');
    this.contentControl = this.element.find('.mercury-display-controls');

    if (this.options.afterLoad) { this.options.afterLoad.call(this); }
    if (this.options.handler) {
      if (window.Mercury.modalHandlers[this.options.handler]) {
        if (typeof(window.Mercury.modalHandlers[this.options.handler]) === 'function') {
          window.Mercury.modalHandlers[this.options.handler].call(this);
        } else {
          jQuery.extend(this, window.Mercury.modalHandlers[this.options.handler]);
          this.initialize();
        }
      } else if (window.Mercury.lightviewHandlers[this.options.handler]) {
        if (typeof(window.Mercury.lightviewHandlers[this.options.handler]) === 'function') {
          window.Mercury.lightviewHandlers[this.options.handler].call(this);
        } else {
          jQuery.extend(this, window.Mercury.lightviewHandlers[this.options.handler]);
          this.initialize();
        }
      }
    }

    if (window.Mercury.config.localization.enabled) { this.element.localize(window.Mercury.locale()); }
    this.element.find('.lightview-close').on('click', this.hide);
    return this.resize();
  }


  setTitle() {
    return this.titleElement.find('span').html(window.Mercury.I18n(this.options.title));
  }


  serializeForm() {
    return this.element.find('form').serializeObject() || {};
  }


  reset() {
    this.titleElement.find('span').html('');
    return this.contentElement.html('');
  }


  hide() {
    if (this.showing) { return; }
    this.options = {};

    window.Mercury.trigger('focus:frame');
    this.element.hide();
    this.overlay.hide();
    this.reset();

    return this.visible = false;
  }
};
