/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.PageEditor = class PageEditor {

  // options
  // saveStyle: 'form', or 'json' (defaults to json)
  // saveDataType: 'xml', 'json', 'jsonp', 'script', 'text', 'html' (defaults to json)
  // saveMethod: 'POST', or 'PUT', create or update actions on save (defaults to PUT)
  // visible: boolean, if the interface should start visible or not (defaults to true)
  constructor(saveUrl = null, options) {
    let token;
    this.saveUrl = saveUrl;
    if (options == null) { options = {}; }
    this.options = options;
    if (window.mercuryInstance) { throw window.Mercury.I18n('window.Mercury.PageEditor can only be instantiated once.'); }

    if ((this.options.visible !== false) && (this.options.visible !== 'false')) { this.options.visible = true; }
    this.visible = this.options.visible;
    if ((this.options.saveDataType !== false) && !this.options.saveDataType) { this.options.saveDataType = 'json'; }

    window.mercuryInstance = this;
    this.regions = [];
    this.initializeInterface();
    if (token = jQuery(window.Mercury.config.csrfSelector).attr('content')) { window.Mercury.csrfToken = token; }
  }


  initializeInterface() {
    let left;
    this.focusableElement = jQuery('<input>', {class: 'mercury-focusable', type: 'text'}).appendTo(this.options.appendTo != null ? this.options.appendTo : 'body');

    this.iframe = jQuery('<iframe>', {id: 'mercury_iframe', name: 'mercury_iframe', class: 'mercury-iframe', frameborder: '0', src: 'about:blank'});
    this.iframe.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');

    this.toolbar = new window.Mercury.Toolbar(jQuery.extend(true, {}, this.options, this.options.toolbarOptions));
    this.statusbar = new window.Mercury.Statusbar(jQuery.extend(true, {}, this.options, this.options.statusbarOptions));
    this.resize();

    this.iframe.one('load', () => this.bindEvents());
    this.iframe.on('load', () => this.initializeFrame());
    return this.loadIframeSrc(null);
  }


  initializeFrame() {
    try {
      if (this.iframe.data('loaded')) { return; }
      this.iframe.data('loaded', true);

      // set document reference of iframe
      this.document = jQuery(this.iframe.get(0).contentWindow.document);

      // inject styles for document to be able to highlight regions and other tools
      jQuery("<style mercury-styles=\"true\">").html(window.Mercury.config.injectedStyles).appendTo(this.document.find('head'));

      // jquery: make jQuery evaluate scripts within the context of the iframe window
      const iframeWindow = this.iframe.get(0).contentWindow;
      jQuery.globalEval = function(data) { if (data && /\S/.test(data)) { return (iframeWindow.execScript || (data => iframeWindow["eval"].call(iframeWindow, data)))(data); } };

      iframeWindow.window.Mercury = window.Mercury;
      if (window.History && History.Adapter) { iframeWindow.History = History; }

      // (re) initialize the editor against the new document
      this.bindDocumentEvents();
      this.resize();
      this.initializeRegions();
      this.finalizeInterface();

      // trigger ready events
      window.Mercury.trigger('ready');
      if (iframeWindow.jQuery) { iframeWindow.jQuery(iframeWindow).trigger('mercury:ready'); }
      if (iframeWindow.Event && iframeWindow.Event.fire) { iframeWindow.Event.fire(iframeWindow, 'mercury:ready'); }
      if (iframeWindow.onwindow.MercuryReady) { iframeWindow.onwindow.MercuryReady(); }

      return this.iframe.css({visibility: 'visible'});
    } catch (error) {
      return window.Mercury.notify('window.Mercury.PageEditor failed to load: %s\n\nPlease try refreshing.', error);
    }
  }


  initializeRegions() {
    let region;
    this.regions = [];
    for (region of Array.from(jQuery(`[${window.Mercury.config.regions.attribute}]`, this.document))) { this.buildRegion(jQuery(region)); }
    if (!this.visible) { return; }
    return (() => {
      const result = [];
      for (region of Array.from(this.regions)) {
        if (region.focus) {
          region.focus();
          break;
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }


  buildRegion(region) {
    if (region.data('region')) {
      region = region.data('region');
    } else {
      const type = (region.attr(window.Mercury.config.regions.attribute) || (typeof window.Mercury.config.regions.determineType === 'function' ? window.Mercury.config.regions.determineType(region) : undefined) || 'unknown').titleize();
      if ((type === 'Unknown') || !window.Mercury.Regions[type]) { throw window.Mercury.I18n('Region type is malformed, no data-type provided, or "%s" is unknown for the "%s" region.', type, region.attr('id') || 'unknown'); }
      if (!window.Mercury.Regions[type].supported) {
        window.Mercury.notify('window.Mercury.Regions.%s is unsupported in this client. Supported browsers are %s.', type, window.Mercury.Regions[type].supportedText);
        return false;
      }
      region = new (window.Mercury.Regions[type])(region, this.iframe.get(0).contentWindow);
      if (this.previewing) { region.togglePreview(); }
    }
    return this.regions.push(region);
  }


  finalizeInterface() {
    this.santizerElement = jQuery('<div>', {id: 'mercury_sanitizer', contenteditable: 'true', style: 'position:fixed;width:100px;height:100px;min-width:0;top:0;left:-100px;opacity:0;overflow:hidden'});
    this.santizerElement.appendTo(this.options.appendTo != null ? this.options.appendTo : this.document.find('body'));

    if (this.snippetToolbar) { this.snippetToolbar.release(); }
    this.snippetToolbar = new window.Mercury.SnippetToolbar(this.document);

    this.hijackLinksAndForms();
    if (!this.visible) { return window.Mercury.trigger('mode', {mode: 'preview'}); }
  }


  bindDocumentEvents() {
    this.document.on('mousedown', function(event) {
      window.Mercury.trigger('hide:dialogs');
      if (window.Mercury.region) {
        if (jQuery(event.target).closest(`[${window.Mercury.config.regions.attribute}]`).get(0) !== window.Mercury.region.element.get(0)) { return window.Mercury.trigger('unfocus:regions'); }
      }
    });

    return jQuery(this.document).bind('keydown', event => {
      if (!event.ctrlKey && !event.metaKey) { return; }
      if (event.keyCode === 83) { // meta+S
        window.Mercury.trigger('action', {action: 'save'});
        return event.preventDefault();
      }
    });
  }


  bindEvents() {
    window.Mercury.on('initialize:frame', () => setTimeout(this.initializeFrame, 100));
    window.Mercury.on('focus:frame', () => this.iframe.focus());
    window.Mercury.on('focus:window', () => setTimeout((() => this.focusableElement.focus()), 10));
    window.Mercury.on('toggle:interface', () => this.toggleInterface());
    window.Mercury.on('reinitialize', () => this.initializeRegions());
    window.Mercury.on('mode', (event, options) => { if (options.mode === 'preview') { return this.previewing = !this.previewing; } });
    window.Mercury.on('action', (event, options) => {
      const action = window.Mercury.config.globalBehaviors[options.action] || this[options.action];
      if (typeof(action) !== 'function') { return; }
      event.preventDefault();
      return action.call(this, options);
    });

    jQuery(window).on('resize', () => {
      return this.resize();
    });

    jQuery(window).bind('keydown', event => {
      if (!event.ctrlKey && !event.metaKey) { return; }
      if (event.keyCode === 83) { // meta+S
        window.Mercury.trigger('action', {action: 'save'});
        return event.preventDefault();
      }
    });

    return window.onbeforeunload = this.beforeUnload;
  }


  toggleInterface() {
    if (this.visible) {
      this.visible = false;
      this.toolbar.hide();
      this.statusbar.hide();
      if (!this.previewing) { window.Mercury.trigger('mode', {mode: 'preview'}); }
      this.previewing = true;
      return this.resize();
    } else {
      this.visible = true;
      this.iframe.animate({top: this.toolbar.height(true)}, 200, 'easeInOutSine', () => this.resize());
      this.toolbar.show();
      this.statusbar.show();
      window.Mercury.trigger('mode', {mode: 'preview'});
      return this.previewing = false;
    }
  }


  resize() {
    const width = jQuery(window).width();
    const height = this.statusbar.top();
    const toolbarHeight = this.toolbar.top() + this.toolbar.height();

    window.Mercury.displayRect = {top: toolbarHeight, left: 0, width, height: height - toolbarHeight, fullHeight: height};

    this.iframe.css({
      top: toolbarHeight,
      left: 0,
      height: height - toolbarHeight
    });

    return window.Mercury.trigger('resize');
  }


  iframeSrc(url = null, params) {
    // remove the /editor segment of the url if it gets passed through
    if (params == null) { params = false; }
    url = (url != null ? url : window.location.href).replace(window.Mercury.config.editorUrlRegEx != null ? window.Mercury.config.editorUrlRegEx : (window.Mercury.config.editorUrlRegEx = /([http|https]:\/\/.[^\/]*)\/editor\/?(.*)/i),  "$1/$2");
    url = url.replace(/[\?|\&]mercury_frame=true/gi, '').replace(/\&_=\d+/gi, '').replace(/#$/, '');
    if (params) {
      // add a param allowing the server to know that the request is coming from mercury
      // and add a cache busting param so we don't get stale content
      return `${url}${url.indexOf('?') > -1 ? '&' : '?'}mercury_frame=true&_=${new Date().getTime()}`;
    } else {
      return url;
    }
  }


  loadIframeSrc(url){
    // clear any existing events if we are loading a new iframe to replace the existing one
    if (this.document) { this.document.off(); }

    this.iframe.data('loaded', false);
    return this.iframe.get(0).contentWindow.document.location.href = this.iframeSrc(url, true);
  }


  hijackLinksAndForms() {
    return (() => {
      const result = [];
      for (var element of Array.from(jQuery('a, form', this.document))) {
        var ignored = false;
        for (var classname of Array.from(window.Mercury.config.nonHijackableClasses || [])) {
          if (jQuery(element).hasClass(classname)) {
            ignored = true;
            continue;
          }
        }
        if (!ignored && ((element.target === '') || (element.target === '_self')) && !jQuery(element).closest(`[${window.Mercury.config.regions.attribute}]`).length) {
          result.push(jQuery(element).attr('target', '_parent'));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }


  beforeUnload() {
    if (window.Mercury.changes && !window.Mercury.silent) {
      return window.Mercury.I18n('You have unsaved changes.  Are you sure you want to leave without saving them first?');
    }
    return null;
  }


  getRegionByName(id) {
    for (var region of Array.from(this.regions)) {
      if (region.name === id) { return region; }
    }
    return null;
  }


  save(callback) {
    let left, method;
    const url = (left = this.saveUrl != null ? this.saveUrl : window.Mercury.saveUrl) != null ? left : this.iframeSrc();
    let data = this.serialize();
    data = {content: data};

    if (this.options.saveMethod === 'POST') {
      method = 'POST';
    } else {
      method = 'PUT';
      data['_method'] = method;
    }

    window.Mercury.log('saving', data);

    const options = {
      headers: window.Mercury.ajaxHeaders(),
      type: method,
      dataType: this.options.saveDataType,
      data,
      success: response => {
        window.Mercury.changes = false;
        window.Mercury.trigger('saved', response);
        if (typeof(callback) === 'function') { return callback(); }
      },
      error: response => {
        window.Mercury.trigger('save_failed', response);
        return window.Mercury.notify('window.Mercury was unable to save to the url: %s', url);
      }
    };
    if (this.options.saveStyle !== 'form') {
      options['data'] = jQuery.toJSON(data);
      options['contentType'] = 'application/json';
    }
    return jQuery.ajax(url, options);
  }


  serialize() {
    const serialized = {};
    for (var region of Array.from(this.regions)) { serialized[region.name] = region.serialize(); }
    return serialized;
  }
};

