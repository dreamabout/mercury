/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.Region = class Region {

  constructor(element, window, options) {
    this.element = element;
    this.window = window;
    if (options == null) { options = {}; }
    this.options = options;
    window.Mercury.log(`building ${this.type()}`, this.element, this.options);
    this.document = this.window.document;
    this.name = this.element.attr(window.Mercury.config.regions.identifier);
    this.history = new window.Mercury.HistoryBuffer();
    this.build();
    this.bindEvents();
    this.pushHistory();
    this.element.data('region', this);
  }


  type() { return 'unknown'; }


  build() {}


  focus() {}


  bindEvents() {
    window.Mercury.on('mode', (event, options) => { if (options.mode === 'preview') { return this.togglePreview(); } });

    window.Mercury.on('focus:frame', () => {
      if (this.previewing || (window.Mercury.region !== this)) { return; }
      return this.focus();
    });

    window.Mercury.on('action', (event, options) => {
      if (this.previewing || (window.Mercury.region !== this) || event.isDefaultPrevented()) { return; }
      if (options.action) { return this.execCommand(options.action, options); }
    });

    this.element.on('mousemove', event => {
      if (this.previewing || (window.Mercury.region !== this)) { return; }
      const snippet = jQuery(event.target).closest('[data-snippet]');
      if (snippet.length) {
        this.snippet = snippet;
        if (this.snippet.data('snippet')) { return window.Mercury.trigger('show:toolbar', {type: 'snippet', snippet: this.snippet}); }
      }
    });

    return this.element.on('mouseout', () => {
      if (this.previewing) { return; }
      return window.Mercury.trigger('hide:toolbar', {type: 'snippet', immediately: false});
    });
  }


  content(value = null, filterSnippets) {
    if (filterSnippets == null) { filterSnippets = false; }
    if (value !== null) {
      return this.element.html(value);
    } else {
      // sanitize the html before we return it
      // create the element without jQuery since $el.html() executes <script> tags
      let container = document.createElement('div');
      container.innerHTML = this.element.html().replace(/^\s+|\s+$/g, '');
      container = $(container);

      // replace snippet contents to be an identifier
      if (filterSnippets) { for (var snippet of Array.from(container.find('[data-snippet]'))) {
        snippet = jQuery(snippet);
        snippet.attr({contenteditable: null, 'data-version': null});
        snippet.html(`[${snippet.data('snippet')}]`);
      } }

      return container.html();
    }
  }


  togglePreview() {
    if (this.previewing) {
      this.previewing = false;
      this.element.attr(window.Mercury.config.regions.attribute, this.type());
      if (window.Mercury.region === this) { return this.focus(); }
    } else {
      this.previewing = true;
      this.element.removeAttr(window.Mercury.config.regions.attribute);
      return window.Mercury.trigger('region:blurred', {region: this});
    }
  }


  execCommand(action, options) {
    if (options == null) { options = {}; }
    this.focus();
    if (action !== 'redo') { this.pushHistory(); }

    window.Mercury.log('execCommand', action, options.value);
    return window.Mercury.changes = true;
  }


  pushHistory() {
    return this.history.push(this.content());
  }


  snippets() {
    const snippets = {};
    for (var element of Array.from(this.element.find('[data-snippet]'))) {
      var snippet = window.Mercury.Snippet.find(jQuery(element).data('snippet'));
      if (!snippet) { continue; }
      snippets[snippet.identity] = snippet.serialize();
    }
    return snippets;
  }


  dataAttributes() {
    const data = {};
    for (var attr of Array.from(window.Mercury.config.regions.dataAttributes)) { data[attr] = (this.container || this.element).attr('data-' + attr); }
    return data;
  }


  serialize() {
    return {
      type: this.type(),
      data: this.dataAttributes(),
      value: this.content(null, true),
      snippets: this.snippets()
    };
  }
};
