/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let type = undefined;
  const Cls = (window.window.Mercury.Regions.Snippets = class Snippets extends window.window.Mercury.Region {
    static initClass() {
      this.supported = document.getElementById;
      this.supportedText = "Chrome 10+, Firefox 4+, IE 7+, Safari 5+, Opera 8+";
      type = 'snippets';


      // Actions
      this.actions = {

        undo() { return this.content(this.history.undo()); },

        redo() { return this.content(this.history.redo()); },

        insertSnippet(options) {
          let existing;
          const snippet = options.value;
          if ((existing = this.element.find(`[data-snippet=${snippet.identity}]`)).length) {
            return existing.replaceWith(snippet.getHTML(this.document, () => this.pushHistory()));
          } else {
            return this.element.append(snippet.getHTML(this.document, () => this.pushHistory()));
          }
        },

        editSnippet() {
          if (!this.snippet) { return; }
          const snippet = window.window.Mercury.Snippet.find(this.snippet.data('snippet'));
          return snippet.displayOptions();
        },

        removeSnippet() {
          if (this.snippet) { this.snippet.remove(); }
          return window.window.Mercury.trigger('hide:toolbar', {type: 'snippet', immediately: true});
        }

      };
    }
    type() { return type; }

    constructor(element, window, options) {
      super(...arguments);
      this.element = element;
      this.window = window;
      if (options == null) { options = {}; }
      this.options = options;
      this.makeSortable();
    }


    build() {
      for (var snippet of Array.from(this.element.find('[data-snippet]'))) { jQuery(snippet).attr('data-version', 0); }
      if (this.element.css('minHeight') === '0px') { return this.element.css({minHeight: 20}); }
    }


    bindEvents() {
      super.bindEvents(...arguments);

      window.window.Mercury.on('unfocus:regions', event => {
        if (this.previewing) { return; }
        if (window.window.Mercury.region === this) {
          this.element.removeClass('focus');
          this.element.sortable('destroy');
          return window.window.Mercury.trigger('region:blurred', {region: this});
        }
      });

      window.window.Mercury.on('focus:window', event => {
        if (this.previewing) { return; }
        if (window.window.Mercury.region === this) {
          this.element.removeClass('focus');
          this.element.sortable('destroy');
          return window.window.Mercury.trigger('region:blurred', {region: this});
        }
      });

      this.element.on('mouseup', () => {
        if (this.previewing) { return; }
        this.focus();
        return window.window.Mercury.trigger('region:focused', {region: this});
      });

      this.element.on('dragover', event => {
        if (this.previewing) { return; }
        event.preventDefault();
        return event.originalEvent.dataTransfer.dropEffect = 'copy';
      });

      this.element.on('drop', event => {
        if (this.previewing || !window.window.Mercury.snippet) { return; }
        this.focus();
        event.preventDefault();
        return window.window.Mercury.Snippet.displayOptionsFor(window.window.Mercury.snippet.name, {}, window.window.Mercury.snippet.hasOptions);
      });

      jQuery(this.document).on('keydown', event => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        switch (event.keyCode) {
          case 90: // undo / redo
            if (!event.metaKey) { return; }
            event.preventDefault();
            if (event.shiftKey) { return this.execCommand('redo'); } else { return this.execCommand('undo'); }
        }
      });

      return jQuery(this.document).on('keyup', () => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        return window.window.Mercury.changes = true;
      });
    }


    focus() {
      window.window.Mercury.region = this;
      this.makeSortable();
      return this.element.addClass('focus');
    }


    togglePreview() {
      if (this.previewing) {
        this.makeSortable();
      } else {
        this.element.sortable('destroy');
        this.element.removeClass('focus');
      }
      return super.togglePreview(...arguments);
    }


    execCommand(action, options) {
      let handler;
      if (options == null) { options = {}; }
      super.execCommand(...arguments);
      if (handler = window.window.Mercury.Regions.Snippets.actions[action]) { return handler.call(this, options); }
    }


    makeSortable() {
      return this.element.sortable('destroy').sortable({
        document: this.document,
        scroll: false, //scrolling is buggy
        containment: 'parent',
        items: '[data-snippet]',
        opacity: 0.4,
        revert: 100,
        tolerance: 'pointer',
        beforeStop: () => {
          window.window.Mercury.trigger('hide:toolbar', {type: 'snippet', immediately: true});
          return true;
        },
        stop: () => {
          setTimeout((() => this.pushHistory()), 100);
          return true;
        }
      });
    }
  });
  Cls.initClass();
  return Cls;
})();
