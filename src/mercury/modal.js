/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.modal = function(url, options) {
  if (options == null) { options = {}; }
  const instance = new window.Mercury.Modal(url, options);
  instance.show();
  return instance;
};


window.Mercury.Modal = class Modal {

  constructor(url, options) {
    this.hide = this.hide.bind(this);
    this.url = url;
    if (options == null) { options = {}; }
    this.options = options;
  }


  show(url = null, options = null) {
    this.url = url || this.url;
    this.options = options || this.options;
    if (!this.options.minWidth) { this.options.minWidth = 400; }
    if (this.options.ujsHandling !== false) { this.options.ujsHandling = true; }

    window.Mercury.trigger('focus:window');
    this.initializeModal();
    if (this.visible) { this.update(); } else { this.appear(); }
    if (this.options.content) {
      return setTimeout((() => this.loadContent(this.options.content)), 500);
    }
  }


  initializeModal() {
    if (this.initialized) { return; }
    this.build();
    this.bindEvents();
    return this.initialized = true;
  }


  build() {
    this.element = jQuery('.mercury-modal');
    this.overlay = jQuery('.mercury-modal-overlay');
    
    if (!this.element.get(0) || !this.overlay.get(0)) {
      let left, left1;
      this.element = jQuery('<div>', {class: 'mercury-modal loading'});
      this.element.html('<h1 class="mercury-modal-title"><span></span><a>&times;</a></h1>');
      this.element.append('<div class="mercury-modal-content-container"><div class="mercury-modal-content"></div></div>');
      
      this.overlay = jQuery('<div>', {class: 'mercury-modal-overlay'});
      
      this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
      this.overlay.appendTo((left1 = jQuery(this.options.appendTo).get(0)) != null ? left1 : 'body');
    }
    
    this.titleElement = this.element.find('.mercury-modal-title');
    this.contentContainerElement = this.element.find('.mercury-modal-content-container');
    return this.contentElement = this.element.find('.mercury-modal-content');
  }


  bindEvents() {
    window.Mercury.on('refresh', () => this.resize(true));
    window.Mercury.on('resize', () => this.position());

    this.overlay.on('click', () => {
      if (this.options.allowHideUsingOverlay) { return this.hide(); }
    });

    this.titleElement.find('a').on('click', () => {
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

    this.overlay.show();
    return this.overlay.animate({opacity: 1}, 200, 'easeInOutSine', () => {
      this.element.css({top: -this.element.height()});
      this.setTitle();
      this.element.show();
      return this.element.animate({top: 0}, 200, 'easeInOutSine', () => {
        this.visible = true;
        this.showing = false;
        return this.load();
      });
    });
  }


  resize(keepVisible) {
    const visibility = keepVisible ? 'visible' : 'hidden';

    const titleHeight = this.titleElement.outerHeight();

    let width = this.contentElement.outerWidth();

    if (this.contentPane) { this.contentPane.css({height: 'auto'}); }
    this.contentElement.css({height: 'auto', visibility, display: 'block'});

    let height = this.contentElement.outerHeight() + titleHeight;

    if (width < this.options.minWidth) { width = this.options.minWidth; }
    if ((height > window.Mercury.displayRect.fullHeight) || this.options.fullHeight) { height = window.Mercury.displayRect.fullHeight; }

    return this.element.stop().animate({left: (window.Mercury.displayRect.width - width) / 2, width, height}, 200, 'easeInOutSine', () => {
      this.contentElement.css({visibility: 'visible', display: 'block'});
      if (this.contentPane.length) {
        this.contentElement.css({height: height - titleHeight, overflow: 'visible'});
        const controlHeight = this.contentControl.length ? this.contentControl.outerHeight() + 10 : 0;
        this.contentPane.css({height: height - titleHeight - controlHeight - 20});
        return this.contentPane.find('.mercury-display-pane').css({width: width - 20});
      } else {
        return this.contentElement.css({height: height - titleHeight, overflow: 'auto'});
      }
    });
  }


  position() {
    const viewportWidth = window.Mercury.displayRect.width;

    if (this.contentPane) { this.contentPane.css({height: 'auto'}); }
    this.contentElement.css({height: 'auto'});
    this.element.css({width: 'auto', height: 'auto', display: 'block', visibility: 'hidden'});

    let width = this.element.width();
    let height = this.element.height();

    if (width < this.options.minWidth) { width = this.options.minWidth; }
    if ((height > window.Mercury.displayRect.fullHeight) || this.options.fullHeight) { height = window.Mercury.displayRect.fullHeight; }

    const titleHeight = this.titleElement.outerHeight();
    if (this.contentPane && this.contentPane.length) {
      this.contentElement.css({height: height - titleHeight, overflow: 'visible'});
      const controlHeight = this.contentControl.length ? this.contentControl.outerHeight() + 10 : 0;
      this.contentPane.css({height: height - titleHeight - controlHeight - 20});
      this.contentPane.find('.mercury-display-pane').css({width: width - 20});
    } else {
      this.contentElement.css({height: height - titleHeight, overflow: 'auto'});
    }

    return this.element.css({
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
          return window.Mercury.notify("window.Mercury was unable to load %s for the modal.", this.url);
        }
      });
    }
  }


  loadContent(data, options = null) {
    this.initializeModal();
    this.options = options || this.options;
    this.setTitle();
    this.loaded = true;
    this.element.removeClass('loading');
    this.contentElement.html(data);
    this.contentElement.css({display: 'none', visibility: 'hidden'});

    // for complex modal content, we provide panes and controls
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
    this.element.find('.modal-close').on('click', this.hide);
    return this.resize();
  }


  setTitle() {
    this.titleElement.find('span').html(window.Mercury.I18n(this.options.title));
    const closeButton = this.titleElement.find('a');
    if (this.options.closeButton === false) { return closeButton.hide(); } else { return closeButton.show(); }
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
