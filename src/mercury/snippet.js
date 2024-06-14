/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cls = (window.Mercury.Snippet = class Snippet {
  static initClass() {
  
    this.all = [];
  }

  static displayOptionsFor(name, options, displayOptions) {
    let snippet;
    if (options == null) { options = {}; }
    if (displayOptions == null) { displayOptions = true; }
    if (displayOptions) {
      window.Mercury.modal(this.optionsUrl(name), jQuery.extend({
        title: 'Snippet Options',
        handler: 'insertSnippet',
        snippetName: name,
        loadType: window.Mercury.config.snippets.method
      }, options)
      );
    } else {
      snippet = window.Mercury.Snippet.create(name);
      window.Mercury.trigger('action', {action: 'insertSnippet', value: snippet});
    }
    return window.Mercury.snippet = null;
  }


  static optionsUrl(name) {
    let url = window.Mercury.config.snippets.optionsUrl;
    if (typeof(url) === 'function') { url = url(); }
    return url.replace(':name', name);
  }


  static previewUrl(name) {
    let url = window.Mercury.config.snippets.previewUrl;
    if (typeof(url) === 'function') { url = url(); }
    return url.replace(':name', name);
  }


  static create(name, options) {
    const instance = new window.Mercury.Snippet(name, this.uniqueId(), options);
    this.all.push(instance);
    return instance;
  }

  static uniqueId() {
    let [i, identity] = Array.from([0, "snippet_0"]);
    const identities = (Array.from(this.all).map((snippet) => snippet.identity));

    while (identities.indexOf(identity) !== -1) {
      i += 1;
      identity = `snippet_${i}`;
    }

    return identity;
  }


  static find(identity) {
    for (var snippet of Array.from(this.all)) {
      if (snippet.identity === identity) { return snippet; }
    }
    return null;
  }


  static load(snippets) {
    return (() => {
      const result = [];
      for (var identity of Object.keys(snippets || {})) {
        var details = snippets[identity];
        var instance = new window.Mercury.Snippet(details.name, identity, details);
        result.push(this.all.push(instance));
      }
      return result;
    })();
  }


  static clearAll() {
    delete this.all;
    return this.all = [];
  }


  constructor(name, identity, options) {
    this.name = name;
    this.identity = identity;
    if (options == null) { options = {}; }
    this.version = 0;
    this.data = '';
    this.wrapperTag = 'div';
    this.wrapperClass = '';
    this.history = new window.Mercury.HistoryBuffer();
    this.setOptions(options);
  }


  getHTML(context, callback = null) {
    let elementClass = `${this.name}-snippet`;
    if (this.wrapperClass) { elementClass += ` ${this.wrapperClass}`; }
    const element = jQuery(`<${this.wrapperTag}>`, {
      class: elementClass,
      contenteditable: "false",
      'data-snippet': this.identity,
      'data-version': this.version
    }, context);
    element.html(`[${this.identity}]`);
    this.loadPreview(element, callback);
    return element;
  }


  getText(callback) {
    return `[--${this.identity}--]`;
  }


  loadPreview(element, callback = null) {
    return jQuery.ajax(Snippet.previewUrl(this.name), {
      headers: window.Mercury.ajaxHeaders(),
      type: window.Mercury.config.snippets.method,
      data: this.options,
      success: data => {
        this.data = data;
        element.html(data);
        if (callback) { return callback(); }
      },
      error: () => {
        return window.Mercury.notify('Error loading the preview for the \"%s\" snippet.', this.name);
      }
    });
  }


  displayOptions() {
    window.Mercury.snippet = this;
    return window.Mercury.modal(Snippet.optionsUrl(this.name), {
      title: 'Snippet Options',
      handler: 'insertSnippet',
      loadType: window.Mercury.config.snippets.method,
      loadData: this.options
    });
  }


  setOptions(options) {
    this.options = options;
    delete(this.options['authenticity_token']);
    delete(this.options['utf8']);
    if (this.options.wrapperTag) { this.wrapperTag = this.options.wrapperTag; }
    if (this.options.wrapperClass) { this.wrapperClass = this.options.wrapperClass; }
    this.version += 1;
    return this.history.push(this.options);
  }


  setVersion(version = null) {
    version = parseInt(version);
    if (version && this.history.stack[version - 1]) {
      this.version = version;
      this.options = this.history.stack[version - 1];
      return true;
    }
    return false;
  }


  serialize() {
    return $.extend({name: this.name}, this.options );
  }
});
Cls.initClass();


