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
  const Cls = (window.window.Mercury.Regions.Markdown = class Markdown extends window.window.Mercury.Region {
    static initClass() {
      this.supported = document.getElementById;
      this.supportedText = "Chrome 10+, Firefox 4+, IE 7+, Safari 5+, Opera 8+";
      type = 'markdown';


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
        },

        insertImage(selection, options) {
          return selection.replace('![add alt text](' + encodeURI(options.value.src) + ')', true);
        },

        insertTable(selection, options) {
          return selection.replace(options.value.replace(/<br>|<br\/>/ig, ''), false, true);
        },

        insertLink(selection, options) {
          return selection.replace(`[${options.value.content}](${options.value.attrs.href} 'optional title')`, true);
        },

        insertUnorderedList(selection) { return selection.addList('unordered'); },

        insertOrderedList(selection) { return selection.addList('ordered'); },

        style(selection, options) { return selection.wrap(`<span class=\"${options.value}\">`, '</span>'); },

        formatblock(selection, options) {
          const wrappers = {
            h1: ['# ', ' #'],
            h2: ['## ', ' ##'],
            h3: ['### ', ' ###'],
            h4: ['#### ', ' ####'],
            h5: ['##### ', ' #####'],
            h6: ['###### ', ' ######'],
            pre: ['    ', ''],
            blockquote: ['> ', ''],
            p: ['\n', '\n']
          };
          for (var wrapperName in wrappers) { var wrapper = wrappers[wrapperName]; selection.unWrapLine(`${wrapper[0]}`, `${wrapper[1]}`); }
          if (options.value === 'blockquote') {
            window.window.Mercury.Regions.Markdown.actions.indent.call(this, selection, options);
            return;
          }
          return selection.wrapLine(`${wrappers[options.value][0]}`, `${wrappers[options.value][1]}`);
        },

        bold(selection) { return selection.wrap('**', '**'); },

        italic(selection) { return selection.wrap('_', '_'); },

        subscript(selection) { return selection.wrap('<sub>', '</sub>'); },

        superscript(selection) { return selection.wrap('<sup>', '</sup>'); },

        indent(selection) {
          return selection.wrapLine('> ', '', false, true);
        },

        outdent(selection) {
          return selection.unWrapLine('> ', '', false, true);
        },

        horizontalRule(selection) { return selection.replace('\n- - -\n'); },

        insertSnippet(selection, options) {
          const snippet = options.value;
          return selection.replace(snippet.getText());
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
      this.converter = new Showdown.converter();
    }


    build() {
      const width = '100%';
      const height = this.element.height();
      const value = this.element.html().replace(/^\s+|\s+$/g, '').replace('&gt;', '>');

      this.textarea = jQuery('<textarea>', this.document).val(value).addClass('mercury-textarea');
      this.textarea.css({
        border: 0,
        background: 'transparent',
        display: 'block',
        'overflow-y': 'hidden',
        width,
        height,
        fontFamily: '"Courier New", Courier, monospace'
      });

      this.element.empty().append(this.textarea);

      this.previewElement = jQuery('<div>', this.document);
      this.element.append(this.previewElement);
      this.container = this.element;
      this.container.data('region', this);
      this.element = this.textarea;
      return this.resize();
    }


    dataAttributes() {
      const data = {};
      for (var attr of Array.from(window.window.Mercury.config.regions.dataAttributes)) { data[attr] = this.container.attr('data-' + attr); }
      return data;
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

      this.element.on('dragenter', event => {
        if (this.previewing) { return; }
        event.preventDefault();
        return event.originalEvent.dataTransfer.dropEffect = 'copy';
      });

      this.element.on('dragover', event => {
        if (this.previewing) { return; }
        event.preventDefault();
        return event.originalEvent.dataTransfer.dropEffect = 'copy';
      });

      this.element.on('drop', event => {
        if (this.previewing) { return; }

        // handle dropping snippets
        if (window.window.Mercury.snippet) {
          event.preventDefault();
          this.focus();
          window.window.Mercury.Snippet.displayOptionsFor(window.window.Mercury.snippet.name, {}, window.window.Mercury.snippet.hasOptions);
        }

        // handle any files that were dropped
        if (event.originalEvent.dataTransfer.files.length) {
          event.preventDefault();
          this.focus();
          return window.window.Mercury.uploader(event.originalEvent.dataTransfer.files[0]);
        }
      });

      this.element.on('focus', () => {
        if (this.previewing) { return; }
        window.window.Mercury.region = this;
        this.container.addClass('focus');
        return window.Mercury.trigger('region:focused', {region: this});
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
              event.preventDefault();
            }
            if (/\d/.test(text[start + 1])) {
              const lineText = text.substring(start, end);
              if (/(\d+)\./.test(lineText)) {
                let number = parseInt(RegExp.$1);
                selection.replace(`\n${(number += 1)}. `, false, true);
                event.preventDefault();
              }
            }
            break;

          case 9: // tab
            event.preventDefault();
            this.execCommand('insertHTML', {value: '  '});
            break;
        }

        if (event.metaKey) {
          switch (event.keyCode) {
            case 66: // b
              this.execCommand('bold');
              event.preventDefault();
              break;

            case 73: // i
              this.execCommand('italic');
              event.preventDefault();
              break;

            case 85: // u
              this.execCommand('underline');
              event.preventDefault();
              break;
          }
        }

        return this.pushHistory(event.keyCode);
      });

      this.element.on('keyup', () => {
        if (this.previewing) { return; }
        window.Mercury.changes = true;
        this.resize();
        return window.Mercury.trigger('region:update', {region: this});
      });

      this.element.on('mouseup', () => {
        if (this.previewing) { return; }
        this.focus();
        return window.Mercury.trigger('region:focused', {region: this});
      });

      return this.previewElement.on('click', event => {
        if (this.previewing) { return $(event.target).closest('a').attr('target', '_parent'); }
      });
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
        this.container.attr(window.Mercury.config.regions.attribute, type);
        this.previewElement.hide();
        this.element.show();
        if (window.Mercury.region === this) { return this.focus(); }
      } else {
        this.previewing = true;
        this.container.removeAttr(window.Mercury.config.regions.attribute);
        const value = this.converter.makeHtml(this.element.val());
        this.previewElement.html(value);
        this.previewElement.show();
        this.element.hide();
        return window.Mercury.trigger('region:blurred', {region: this});
      }
    }


    execCommand(action, options) {
      let handler;
      if (options == null) { options = {}; }
      super.execCommand(...arguments);

      if (handler = window.Mercury.Regions.Markdown.actions[action]) { handler.call(this, this.selection(), options); }
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
      return new window.Mercury.Regions.Markdown.Selection(this.element);
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
window.Mercury.Regions.Markdown.Selection = class Selection {

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


  wrapLine(left, right, selectAfter, reselect) {
    if (selectAfter == null) { selectAfter = true; }
    if (reselect == null) { reselect = false; }
    this.getDetails();
    const savedSelection = this.serialize();
    const text = this.element.val();
    let start = text.lastIndexOf('\n', this.start);
    let end = text.indexOf('\n', this.end);
    if (end < start) { end = text.length; }
    if (text[start] === '\n') { start = text.lastIndexOf('\n', this.start - 1); }
    this.select(start + 1, end);
    this.replace(left + this.text + right, selectAfter);
    if (reselect) { return this.select(savedSelection.start + left.length, savedSelection.end + left.length); }
  }


  unWrapLine(left, right, selectAfter, reselect) {
    if (selectAfter == null) { selectAfter = true; }
    if (reselect == null) { reselect = false; }
    this.getDetails();
    const savedSelection = this.serialize();
    const text = this.element.val();
    let start = text.lastIndexOf('\n', this.start);
    let end = text.indexOf('\n', this.end);
    if (end < start) { end = text.length; }
    if (text[start] === '\n') { start = text.lastIndexOf('\n', this.start - 1); }
    this.select(start + 1, end);
    window.something = this.text;
    const leftRegExp = new RegExp(`^${left.regExpEscape()}`);
    const rightRegExp = new RegExp(`${right.regExpEscape()}$`);
    const changed = this.replace(this.text.replace(leftRegExp, '').replace(rightRegExp, ''), selectAfter);
    if (reselect && changed) { return this.select(savedSelection.start - left.length, savedSelection.end - left.length); }
  }


  addList(type) {
    const text = this.element.val();
    let start = text.lastIndexOf('\n', this.start);
    let end = text.indexOf('\n', this.end);
    if (end < start) { end = text.length; }
    if (text[start] === '\n') { start = text.lastIndexOf('\n', this.start - 1); }
    this.select(start + 1, end);
    const lines = this.text.split('\n');
    if (type === 'unordered') {
      return this.replace("- " + lines.join("\n- "), true);
    } else {
      return this.replace((Array.from(lines).map((line, index) => `${index + 1}. ${line}`)).join('\n'), true);
    }
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
