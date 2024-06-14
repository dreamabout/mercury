/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let type = undefined;
  const Cls = (window.window.Mercury.Regions.Simple = class Simple extends window.window.Mercury.Region {
    static initClass() {
      this.supported = document.getElementById;
      this.supportedText = "Chrome 10+, Firefox 4+, IE 7+, Safari 5+, Opera 8+";
      type = 'simple';


      // Actions
      this.actions = {

        undo() { return this.content(this.history.undo()); },

        redo() { return this.content(this.history.redo()); },

        insertHTML(selection, options) {
          let element;
          if (options.value.get && (element = options.value.get(0))) {
            options.value = jQuery('<div>').html(element).html();
          }
          return selection.replace(options.value, false, true);
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
    }


    build() {
      let height, width;
      if (this.element.css('display') === 'block') {
        width = '100%';
        height = this.element.height();
      } else {
        width = this.element.width();
        height = this.element.height(); // 'auto'
      }

      const value = this.element.text();
      this.textarea = jQuery('<textarea>', this.document).val(value).addClass('mercury-textarea');
      this.textarea.css({
        border: 0,
        background: 'transparent',
        'overflow-y': 'hidden',
        width,
        height,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        fontStyle: 'inherit',
        color: 'inherit',
        'min-height': 0,
        padding: '0',
        margin: 0,
        'border-radius': 0,
        display: 'inherit',
        lineHeight: 'inherit',
        textAlign: 'inherit'
      });

      this.element.empty().append(this.textarea);

      this.container = this.element;
      this.container.data('region', this);
      this.element = this.textarea;
      return this.resize();
    }


    bindEvents() {
      window.window.Mercury.on('mode', (event, options) => { if (options.mode === 'preview') { return this.togglePreview(); } });
      window.window.Mercury.on('focus:frame', () => { if (!this.previewing && (window.window.Mercury.region === this)) { return this.focus(); } });

      window.window.Mercury.on('action', (event, options) => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        if (options.action) { return this.execCommand(options.action, options); }
      });

      window.window.Mercury.on('unfocus:regions', () => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        this.element.blur();
        this.container.removeClass('focus');
        return window.window.Mercury.trigger('region:blurred', {region: this});
      });

      return this.bindElementEvents();
    }


    bindElementEvents() {
      this.element.on('focus', () => {
        if (this.previewing) { return; }
        window.window.Mercury.region = this;
        this.container.addClass('focus');
        return window.window.Mercury.trigger('region:focused', {region: this});
      });

      this.element.on('keydown', event => {
        if (this.previewing) { return; }
        this.resize();
        switch (event.keyCode) {
          case 90: // undo / redo
            if (!event.metaKey) { return; }
            event.preventDefault();
            if (event.shiftKey) { this.execCommand('redo'); } else { this.execCommand('undo'); }
            return;
            break;

          case 13: // enter or return
            var selection = this.selection();
            var text = this.element.val();
            var start = text.lastIndexOf('\n', selection.start);
            var end = text.indexOf('\n', selection.end);
            if (end < start) { end = text.length; }
            if (text[start] === '\n') { start = text.lastIndexOf('\n', selection.start - 1); }
            if (text[start + 1] === '-') {
              selection.replace('\n- ', false, true);
            }
            if (/\d/.test(text[start + 1])) {
              const lineText = text.substring(start, end);
              if (/(\d+)\./.test(lineText)) {
                let number = parseInt(RegExp.$1);
                selection.replace(`\n${(number += 1)}. `, false, true);
              }
            }
            // Never allow return. Newlines won't survive the
            // change-over to HTML, so just don't encourage their
            // use.
            event.preventDefault();
            break;

          case 9: // tab
            event.preventDefault();
            this.execCommand('insertHTML', {value: '  '});
            break;
        }

        return this.pushHistory(event.keyCode);
      });

      this.element.on('keyup', () => {
        if (this.previewing) { return; }
        window.window.Mercury.changes = true;
        this.resize();
        return window.window.Mercury.trigger('region:update', {region: this});
      });

      this.element.on('mouseup', () => {
        if (this.previewing) { return; }
        this.focus();
        return window.window.Mercury.trigger('region:focused', {region: this});
      });

      return this.element.on('paste', event => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        if (this.specialContainer) {
          event.preventDefault();
          return;
        }
        if (this.pasting) { return; }
        window.window.Mercury.changes = true;
        return this.handlePaste(event.originalEvent);
      });
    }


    handlePaste(event) {
      // get the text content from the clipboard and fall back to using the sanitizer if unavailable
      this.execCommand('insertHTML', {value: event.clipboardData.getData('text/plain').replace(/\n/g, ' ')});
      event.preventDefault();
    }


    path() {
      return [this.container.get(0)];
    }


    focus() {
      return this.element.focus();
    }


    content(value = null, filterSnippets) {
      if (filterSnippets == null) { filterSnippets = true; }
      if (value !== null) {
        if (jQuery.type(value) === 'string') {
          return this.element.val(value);
        } else {
          this.element.val(value.html);
          return this.selection().select(value.selection.start, value.selection.end);
        }
      } else {
        return this.element.val();
      }
    }


    contentAndSelection() {
      return {html: this.content(null, false), selection: this.selection().serialize()};
    }


    togglePreview() {
      if (this.previewing) {
        this.previewing = false;
        this.element = this.container;
        this.container.attr(window.window.Mercury.config.regions.attribute, type);
        this.build();
        this.bindElementEvents();
        if (window.window.Mercury.region === this) { return this.focus(); }
      } else {
        this.previewing = true;
        const value = jQuery('<div></div>').text(this.element.val()).html();
        this.container.removeAttr(window.window.Mercury.config.regions.attribute);
        this.container.html(value);
        return window.window.Mercury.trigger('region:blurred', {region: this});
      }
    }


    execCommand(action, options) {
      let handler;
      if (options == null) { options = {}; }
      super.execCommand(...arguments);

      if (handler = window.window.Mercury.Regions.Simple.actions[action]) { handler.call(this, this.selection(), options); }
      return this.resize();
    }


    pushHistory(keyCode) {
      // when pressing return, delete or backspace it should push to the history
      // all other times it should store if there's a 1 second pause
      let knownKeyCode;
      const keyCodes = [13, 46, 8];
      const waitTime = 2.5;
      if (keyCode) { knownKeyCode = keyCodes.indexOf(keyCode); }

      // clear any pushes to the history
      clearTimeout(this.historyTimeout);

      // if the key code was return, delete, or backspace store now -- unless it was the same as last time
      if ((knownKeyCode >= 0) && (knownKeyCode !== this.lastKnownKeyCode)) { // || !keyCode
        this.history.push(this.contentAndSelection());
      } else if (keyCode) {
        // set a timeout for pushing to the history
        this.historyTimeout = setTimeout((() => this.history.push(this.contentAndSelection())), waitTime * 1000);
      } else {
        // push to the history immediately
        this.history.push(this.contentAndSelection());
      }

      return this.lastKnownKeyCode = knownKeyCode;
    }


    selection() {
      return new window.window.Mercury.Regions.Simple.Selection(this.element);
    }


    resize() {
      this.element.css({height: this.element.get(0).scrollHeight - 100});
      return this.element.css({height: this.element.get(0).scrollHeight});
    }


    snippets() {}
  });
  Cls.initClass();
  return Cls;
})();


// Helper class for managing selection and getting information from it
window.Mercury.Regions.Simple.Selection = class Selection {

  constructor(element) {
    this.element = element;
    this.el = this.element.get(0);
    this.getDetails();
  }


  serialize() {
    return {start: this.start, end: this.end};
  }


  getDetails() {
    this.length = this.el.selectionEnd - this.el.selectionStart;
    this.start = this.el.selectionStart;
    this.end = this.el.selectionEnd;
    return this.text = this.element.val().substr(this.start, this.length);
  }


  replace(text, select, placeCursor) {
    if (select == null) { select = false; }
    if (placeCursor == null) { placeCursor = false; }
    this.getDetails();
    const val = this.element.val();
    const savedVal = this.element.val();
    this.element.val(val.substr(0, this.start) + text + val.substr(this.end, val.length));
    const changed = this.element.val() !== savedVal;
    if (select) { this.select(this.start, this.start + text.length); }
    if (placeCursor) { this.select(this.start + text.length, this.start + text.length); }
    return changed;
  }


  select(start, end) {
    this.start = start;
    this.end = end;
    this.element.focus();
    this.el.selectionStart = this.start;
    this.el.selectionEnd = this.end;
    return this.getDetails();
  }


  wrap(left, right) {
    this.getDetails();
    this.deselectNewLines();
    this.replace(left + this.text + right, this.text !== '');
    if (this.text === '') { return this.select(this.start + left.length, this.start + left.length); }
  }


  deselectNewLines() {
    const {
      text
    } = this;
    const {
      length
    } = text.replace(/\n+$/g, '');
    return this.select(this.start, this.start + length);
  }


  placeMarker() {
    return this.wrap('[mercury-marker]', '[mercury-marker]');
  }


  removeMarker() {
    const val = this.element.val();
    const start = val.indexOf('[mercury-marker]');
    if (!(start > -1)) { return; }
    const end = val.indexOf('[mercury-marker]', start + 1) - '[mercury-marker]'.length;
    this.element.val(this.element.val().replace(/\[mercury-marker\]/g, ''));
    return this.select(start, end);
  }


  textContent() {
    return this.text;
  }
};
