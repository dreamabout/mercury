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
  const Cls = (window.window.Mercury.Regions.Full = class Full extends window.window.Mercury.Region {
    static initClass() {
      // No IE < 10 support because those versions don't follow the W3C standards for HTML5 contentEditable (aka designMode).
      this.supported = document.designMode
      type = 'full';


      // Custom actions (eg. things that execCommand doesn't do, or doesn't do well)
      this.actions = {

        insertRowBefore() { return window.window.Mercury.tableEditor.addRow('before'); },

        insertRowAfter() { return window.window.Mercury.tableEditor.addRow('after'); },

        insertColumnBefore() { return window.window.Mercury.tableEditor.addColumn('before'); },

        insertColumnAfter() { return window.window.Mercury.tableEditor.addColumn('after'); },

        deleteColumn() { return window.window.Mercury.tableEditor.removeColumn(); },

        deleteRow() { return window.window.Mercury.tableEditor.removeRow(); },

        increaseColspan() { return window.window.Mercury.tableEditor.increaseColspan(); },

        decreaseColspan() { return window.window.Mercury.tableEditor.decreaseColspan(); },

        increaseRowspan() { return window.window.Mercury.tableEditor.increaseRowspan(); },

        decreaseRowspan() { return window.window.Mercury.tableEditor.decreaseRowspan(); },

        undo() { return this.content(this.history.undo()); },

        redo() { return this.content(this.history.redo()); },

        horizontalRule() { return this.execCommand('insertHTML', {value: '<hr/>'}); },

        removeFormatting(selection) { return selection.insertTextNode(selection.textContent()); },

        backColor(selection, options) { return selection.wrap(`<span style=\"background-color:${options.value.toHex()}\">`, true); },

        overline(selection) { return selection.wrap('<span style="text-decoration:overline">', true); },

        style(selection, options) { return selection.wrap(`<span class=\"${options.value}\">`, true); },

        replaceHTML(selection, options) { return this.content(options.value); },

        insertImage(selection, options) { return this.execCommand('insertHTML', {value: jQuery('<img/>', options.value)}); },

        insertTable(selection, options) { return this.execCommand('insertHTML', {value: options.value}); },

        insertLink(selection, options) {
          const anchor = jQuery(`<${options.value.tagName}>`, this.document).attr(options.value.attrs).html(options.value.content);
          return selection.insertNode(anchor);
        },

        replaceLink(selection, options) {
          const anchor = jQuery(`<${options.value.tagName}>`, this.document).attr(options.value.attrs).html(options.value.content);
          selection.selectNode(options.node);
          const html = jQuery('<div>').html(selection.content()).find('a').html();
          return selection.replace(jQuery(anchor, selection.context).html(html));
        },

        insertSnippet(selection, options) {
          let existing;
          const snippet = options.value;
          if ((existing = this.element.find(`[data-snippet=${snippet.identity}]`)).length) {
            selection.selectNode(existing.get(0));
          }
          return selection.insertNode(snippet.getHTML(this.document));
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

    }


    build() {
      // mozilla: set some initial content so everything works correctly
      if (jQuery.browser.mozilla && (this.content() === '')) { this.content('&nbsp;'); }

      // set overflow just in case
      this.element.data({originalOverflow: this.element.css('overflow')});
      this.element.css({overflow: 'auto'});

      // mozilla: there's some weird behavior when the element isn't a div
      this.specialContainer = jQuery.browser.mozilla && (this.element.get(0).tagName !== 'DIV');

      // make it editable
      // mozilla: this makes double clicking in textareas fail: https://bugzilla.mozilla.org/show_bug.cgi?id=490367
      this.element.get(0).contentEditable = true;

      // make all snippets not editable, and set their versions to 1
      for (var element of Array.from(this.element.find('[data-snippet]'))) {
        element.contentEditable = false;
        jQuery(element).attr('data-version', '1');
      }

      // add the basic editor settings to the document (only once)
      if (!this.document.mercuryEditing) {
        this.document.mercuryEditing = true;
        try {
          this.document.execCommand('styleWithCSS', false, false);
          this.document.execCommand('insertBROnReturn', false, true);
          this.document.execCommand('enableInlineTableEditing', false, false);
          return this.document.execCommand('enableObjectResizing', false, false);
        } catch (e) {}
      }
    }
          // intentionally do nothing if any of these fail, to broaden support for Opera


    bindEvents() {
      super.bindEvents(...arguments);

      window.window.Mercury.on('region:update', () => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        setTimeout((() => this.selection().forceSelection(this.element.get(0))), 1);
        const currentElement = this.currentElement();
        if (currentElement.length) {
          // setup the table editor if we're inside a table
          const table = currentElement.closest('table', this.element);
          if (table.length) { window.window.Mercury.tableEditor(table, currentElement.closest('tr, td'), '<br/>'); }
          // display a tooltip if we're in an anchor
          const anchor = currentElement.closest('a', this.element);
          if (anchor.length && anchor.attr('href')) {
            return window.window.Mercury.tooltip(anchor, `<a href=\"${anchor.attr('href')}\" target=\"_blank\">${anchor.attr('href')}</a>`, {position: 'below'});
          } else {
            return window.window.Mercury.tooltip.hide();
          }
        }
      });

      this.element.on('dragenter', event => {
        if (this.previewing) { return; }
        if (!window.window.Mercury.snippet) { event.preventDefault(); }
        return event.originalEvent.dataTransfer.dropEffect = 'copy';
      });

      this.element.on('dragover', event => {
        if (this.previewing) { return; }
        if (!window.window.Mercury.snippet) { event.preventDefault(); }
        return event.originalEvent.dataTransfer.dropEffect = 'copy';
      });
        // removed to fix chrome update issue #362 https://github.com/jejacks0n/mercury/issues/362
        // if jQuery.browser.webkit
          // clearTimeout(@dropTimeout)
          // @dropTimeout = setTimeout((=> @element.trigger('possible:drop')), 10)

      this.element.on('drop', event => {
        if (this.previewing) { return; }

        // handle dropping snippets
        clearTimeout(this.dropTimeout);
        this.dropTimeout = setTimeout((() => this.element.trigger('possible:drop')), 1);

        // handle any files that were dropped
        if (!event.originalEvent.dataTransfer.files.length) { return; }
        event.preventDefault();
        this.focus();
        return window.window.Mercury.uploader(event.originalEvent.dataTransfer.files[0]);
      });

      // possible:drop custom event: we have to do this because webkit doesn't fire the drop event unless both dragover and
      // dragstart default behaviors are canceled.. but when we do that and observe the drop event, the default behavior
      // isn't handled (eg, putting the image where it was dropped,) so to allow the browser to do it's thing, and also do
      // our thing we have this little hack.  *sigh*
      // read: http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
      this.element.on('possible:drop', () => {
        if (this.previewing) { return; }
        if (window.window.Mercury.snippet) {
          this.focus();
          window.window.Mercury.Snippet.displayOptionsFor(window.window.Mercury.snippet.name, {}, window.window.Mercury.snippet.hasOptions);
          return this.document.execCommand('undo', false, null);
        }
      });

      // custom paste handling: we have to do some hackery to get the pasted content since it's not exposed normally
      // through a clipboard in firefox (heaven forbid), and to keep the behavior across all browsers, we manually detect
      // what was pasted by focusing a different (hidden) region, letting it paste there, making our adjustments, and then
      // inserting the content where it was intended.  This is possible, so it doesn't make sense why it wouldn't be
      // exposed in a sensible way.  *sigh*
      this.element.on('paste', event => {
        if (this.previewing || (window.Mercury.region !== this)) { return; }
        if (this.specialContainer) {
          event.preventDefault();
          return;
        }
        if (this.pasting) { return; }
        window.Mercury.changes = true;
        return this.handlePaste(event.originalEvent);
      });

      this.element.on('focus', () => {
        if (this.previewing) { return; }
        window.Mercury.region = this;
        setTimeout((() => this.selection().forceSelection(this.element.get(0))), 1);
        return window.Mercury.trigger('region:focused', {region: this});
      });

      this.element.on('blur', () => {
        if (this.previewing) { return; }
        window.Mercury.trigger('region:blurred', {region: this});
        return window.Mercury.tooltip.hide();
      });

      this.element.on('click', event => {
        if (this.previewing) { return jQuery(event.target).closest('a').attr('target', '_parent'); }
      });

      this.element.on('dblclick', event => {
        if (this.previewing) { return; }
        const image = jQuery(event.target).closest('img', this.element);
        if (image.length) {
          this.selection().selectNode(image.get(0), true);
          return window.Mercury.trigger('button', {action: 'insertMedia'});
        }
      });

      this.element.on('mouseup', () => {
        if (this.previewing) { return; }
        this.pushHistory();
        return window.Mercury.trigger('region:update', {region: this});
      });

      this.element.on('keydown', event => {
        if (this.previewing) { return; }
        switch (event.keyCode) {
          case 90: // undo / redo
            if (!event.metaKey) { return; }
            event.preventDefault();
            if (event.shiftKey) { this.execCommand('redo'); } else { this.execCommand('undo'); }
            return;
            break;

          case 13: // enter
            if (jQuery.browser.webkit && (this.selection().commonAncestor().closest('li, ul, ol', this.element).length === 0)) {
              event.preventDefault();
              this.document.execCommand('insertParagraph', false, null);
            } else if (this.specialContainer || jQuery.browser.opera) {
              // mozilla: pressing enter in any element besides a div handles strangely
              event.preventDefault();
              this.document.execCommand('insertHTML', false, '<br/>');
            }
            break;

          case 9: // tab
            event.preventDefault();
            var container = this.selection().commonAncestor();

            // indent when inside of an li
            if (container.closest('li', this.element).length) {
              if (!event.shiftKey) {
                this.execCommand('indent');
              // do not outdent on last ul/ol parent, or we break out of the list
              } else if (container.parents('ul, ol').length > 1) {
                this.execCommand('outdent');
              }
            } else {
              this.execCommand('insertHTML', {value: '&nbsp;&nbsp;'});
            }
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

      return this.element.on('keyup', () => {
        if (this.previewing) { return; }
        window.Mercury.trigger('region:update', {region: this});
        return window.Mercury.changes = true;
      });
    }


    focus() {
      if (window.Mercury.region !== this) {
        setTimeout((() => this.element.focus()), 10);
        try {
          this.selection().selection.collapseToStart();
        } catch (e) {}
          // intentially do nothing
      } else {
        setTimeout((() => this.element.focus()), 10);
      }

      window.Mercury.trigger('region:focused', {region: this});
      return window.Mercury.trigger('region:update', {region: this});
    }


    content(value = null, filterSnippets, includeMarker) {
      let container, element, snippet;
      if (filterSnippets == null) { filterSnippets = true; }
      if (includeMarker == null) { includeMarker = false; }
      if (value !== null) {
        // sanitize the html before we insert it
        container = jQuery('<div>').appendTo(this.document.createDocumentFragment());
        container.html(value);

        // fill in the snippet contents
        for (element of Array.from(container.find('[data-snippet]'))) {
          element.contentEditable = false;
          element = jQuery(element);
          if (snippet = window.Mercury.Snippet.find(element.data('snippet'))) {
            if (element.data('version')) {
              snippet.setVersion(element.data('version'));
            } else {
              try {
                var version = parseInt(element.html().match(/\/(\d+)\]/)[1]);
                if (version) {
                  snippet.setVersion(version);
                  element.attr({'data-version': version});
                  element.html(snippet.data);
                }
              } catch (error) {}
            }
          }
        }

        // set the html
        this.element.html(container.html());

        // create a selection if there's markers
        return this.selection().selectMarker(this.element);
      } else {
        // remove any meta tags
        let selection;
        this.element.find('meta').remove();

        // place markers for the selection
        if (includeMarker) {
          selection = this.selection();
          selection.placeMarker();
        }

        // sanitize the html before we return it
        container = jQuery('<div>').appendTo(this.document.createDocumentFragment());
        container.html(this.element.html().replace(/^\s+|\s+$/g, ''));

        // replace snippet contents to be an identifier
        if (filterSnippets) { const iterable = container.find('[data-snippet]');
        for (let index = 0; index < iterable.length; index++) {
          element = iterable[index];
          element = jQuery(element);
          if (snippet = window.Mercury.Snippet.find(element.data("snippet"))) {
            snippet.data = element.html();
          }
          element.html(`[${element.data("snippet")}/${element.data("version")}]`);
          element.attr({contenteditable: null, 'data-version': null});
        } }

        // get the html before removing the markers
        const content = container.html();

        // remove the markers from the dom
        if (includeMarker) { selection.removeMarker(); }

        return content;
      }
    }


    togglePreview() {
      if (this.previewing) {
        this.element.get(0).contentEditable = true;
        this.element.css({overflow: 'auto'});
      } else {
        this.content(this.content());
        this.element.get(0).contentEditable = false;
        this.element.css({overflow: this.element.data('originalOverflow')});
        this.element.blur();
      }
      return super.togglePreview(...arguments);
    }


    execCommand(action, options) {
      let handler;
      if (options == null) { options = {}; }
      super.execCommand(...arguments);

      // use a custom handler if there's one, otherwise use execCommand
      if (handler = window.Mercury.config.behaviors[action] || window.Mercury.Regions.Full.actions[action]) {
        handler.call(this, this.selection(), options);
      } else {
        let sibling;
        if (action === 'indent') { sibling = this.element.get(0).previousSibling; }
        if ((action === 'insertHTML') && options.value && options.value.get) { options.value = jQuery('<div>').html(options.value).html(); }
        try {
          this.document.execCommand(action, false, options.value);
        } catch (error) {
          // mozilla: indenting when there's no br tag handles strangely
          // mozilla: trying to justify the first line of any contentEditable fails
          if ((action === 'indent') && (this.element.prev() !== sibling)) { this.element.prev().remove(); }
        }
      }

      // handle any broken images by replacing the source with an alert image
      return this.element.find('img').one('error', function() { return jQuery(this).attr({src: '/assets/mercury/missing-image.png', title: 'Image not found'}); });
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
        this.history.push(this.content(null, false, true));
      } else if (keyCode) {
        // set a timeout for pushing to the history
        this.historyTimeout = setTimeout((() => this.history.push(this.content(null, false, true))), waitTime * 1000);
      } else {
        // push to the history immediately
        this.history.push(this.content(null, false, true));
      }

      return this.lastKnownKeyCode = knownKeyCode;
    }


    selection() {
      return new window.Mercury.Regions.Full.Selection(this.window.getSelection(), this.document);
    }


    path() {
      const container = this.selection().commonAncestor();
      if (!container) { return []; }
      if (container.get(0) === this.element.get(0)) { return []; } else { return container.parentsUntil(this.element); }
    }


    currentElement() {
      let element = [];
      const selection = this.selection();
      if (selection.range) {
        element = selection.commonAncestor();
        if (element.get(0).nodeType === 3) { element = element.parent(); }
      }
      return element;
    }


    handlePaste(event) {
      // get the text content from the clipboard and fall back to using the sanitizer if unavailable
      if ((window.Mercury.config.pasting.sanitize === 'text') && event.clipboardData) {
        this.execCommand('insertHTML', {value: event.clipboardData.getData('text/plain')});
        event.preventDefault();
        return;
      } else {
        // get current selection & range
        const selection = this.selection();
        selection.placeMarker();

        const sanitizer = jQuery('#mercury_sanitizer', this.document).focus();

        // set 1ms timeout to allow paste event to complete
        return setTimeout(() => {
          // sanitize the content
          const content = this.sanitize(sanitizer);

          // move cursor back to original element & position
          selection.selectMarker(this.element);
          selection.removeMarker();

          // paste sanitized content
          this.element.focus();
          return this.execCommand('insertHTML', {value: content});
        }
        , 1);
      }
    }


    sanitize(sanitizer) {
      // always remove nested regions
      let content;
      sanitizer.find(`[${window.Mercury.config.regions.attribute}]`).remove();
      sanitizer.find('[src*="webkit-fake-url://"]').remove();

      if (window.Mercury.config.pasting.sanitize) {
        switch (window.Mercury.config.pasting.sanitize) {
          case 'blacklist':
            // todo: finish writing black list functionality
            sanitizer.find('[style]').removeAttr('style');
            sanitizer.find('[class="Apple-style-span"]').removeClass('Apple-style-span');
            content = sanitizer.html();
            break;
          case 'whitelist':
            for (var element of Array.from(sanitizer.find('*'))) {
              var allowed = false;
              for (var allowedTag in window.Mercury.config.pasting.whitelist) {
                var allowedAttributes = window.Mercury.config.pasting.whitelist[allowedTag];
                if (element.tagName.toLowerCase() === allowedTag.toLowerCase()) {
                  allowed = true;
                  for (var attr of Array.from(jQuery(element.attributes))) {
                    if (!Array.from(allowedAttributes).includes(attr.name)) { jQuery(element).removeAttr(attr.name); }
                  }
                  break;
                }
              }
              if (!allowed) { jQuery(element).replaceWith(jQuery(element).contents()); }
            }
            content = sanitizer.html();
            break;
          default: content = sanitizer.text();
        }
      } else {
        // force text if it looks like it's from word/pages, even if there's no sanitizing requested
        content = sanitizer.html();
        if ((content.indexOf('<!--StartFragment-->') > -1) || (content.indexOf('="mso-') > -1) || (content.indexOf('<o:') > -1) || (content.indexOf('="Mso') > -1)) {
          content = sanitizer.text();
        }
      }

      sanitizer.html('');
      return content;
    }
  });
  Cls.initClass();
  return Cls;
})();


// Helper class for managing selection and getting information from it
window.Mercury.Regions.Full.Selection = class Selection {

  constructor(selection, context) {
    this.selection = selection;
    this.context = context;
    if (!(this.selection.rangeCount >= 1)) { return; }
    this.range = this.selection.getRangeAt(0);
    this.fragment = this.range.cloneContents();
    this.clone = this.range.cloneRange();
    this.collapsed = this.selection.isCollapsed;
  }


  commonAncestor(onlyTag) {
    if (onlyTag == null) { onlyTag = false; }
    if (!this.range) { return null; }
    let ancestor = this.range.commonAncestorContainer;
    if ((ancestor.nodeType === 3) && onlyTag) { ancestor = ancestor.parentNode; }
    return jQuery(ancestor);
  }


  wrap(element, replace) {
    if (replace == null) { replace = false; }
    element = jQuery(element, this.context).html(this.fragment);
    if (replace) { this.replace(element); }
    return element;
  }


  textContent() {
    return this.content().textContent;
  }


  htmlContent() {
    const content = this.content();
    return jQuery('<div>').html(content).html();
    return null;
  }


  content() {
    return this.range.cloneContents();
  }


  is(elementType) {
    const content = this.content();
    if ((jQuery(content).length === 1) && jQuery(content.firstChild).is(elementType)) { return jQuery(content.firstChild); }
    return false;
  }


  forceSelection(element) {
    let lastChild;
    if (!jQuery.browser.webkit) { return; }
    const range = this.context.createRange();

    if (this.range) {
      if (this.commonAncestor(true).closest('[data-snippet]').length) {
        lastChild = this.context.createTextNode("\x00");
        element.appendChild(lastChild);
      }
    } else {
      if (element.lastChild && (element.lastChild.nodeType === 3) && (element.lastChild.textContent.replace(/^[\s+|\n+]|[\s+|\n+]$/, '') === '')) {
        ({
          lastChild
        } = element);
        element.lastChild.textContent = "\x00";
      } else {
        lastChild = this.context.createTextNode("\x00");
        element.appendChild(lastChild);
      }
    }

    if (lastChild) {
      range.setStartBefore(lastChild);
      range.setEndBefore(lastChild);
      return this.selection.addRange(range);
    }
  }


  selectMarker(context) {
    const markers = context.find('em.mercury-marker');
    if (!markers.length) { return; }

    const range = this.context.createRange();
    range.setStartBefore(markers.get(0));
    if (markers.length >= 2) { range.setEndBefore(markers.get(1)); }

    markers.remove();

    this.selection.removeAllRanges();
    return this.selection.addRange(range);
  }


  placeMarker() {
    if (!this.range) { return; }

    this.startMarker = jQuery('<em class="mercury-marker"/>', this.context).get(0);
    this.endMarker = jQuery('<em class="mercury-marker"/>', this.context).get(0);

    // put a single marker (the end)
    const rangeEnd = this.range.cloneRange();
    rangeEnd.collapse(false);
    rangeEnd.insertNode(this.endMarker);

    if (!this.range.collapsed) {
      // put a start marker
      const rangeStart = this.range.cloneRange();
      rangeStart.collapse(true);
      rangeStart.insertNode(this.startMarker);
    }

    this.selection.removeAllRanges();
    return this.selection.addRange(this.range);
  }


  removeMarker() {
    jQuery(this.startMarker).remove();
    return jQuery(this.endMarker).remove();
  }


  insertTextNode(string) {
    const node = this.context.createTextNode(string);
    this.range.extractContents();
    this.range.insertNode(node);
    this.range.selectNodeContents(node);
    return this.selection.addRange(this.range);
  }


  insertNode(element) {
    if (element.get) { element = element.get(0); }
    if (jQuery.type(element) === 'string') { element = jQuery(element, this.context).get(0); }

    this.range.deleteContents();
    this.range.insertNode(element);
    this.range.selectNodeContents(element);
    return this.selection.addRange(this.range);
  }


  selectNode(node, removeExisting) {
    if (removeExisting == null) { removeExisting = false; }
    this.range.selectNode(node);
    if (removeExisting) { this.selection.removeAllRanges(); }
    return this.selection.addRange(this.range);
  }


  replace(element, collapse) {
    if (element.get) { element = element.get(0); }
    if (jQuery.type(element) === 'string') { element = jQuery(element, this.context).get(0); }

    this.range.deleteContents();
    this.range.insertNode(element);
    this.range.selectNodeContents(element);
    this.selection.addRange(this.range);
    if (collapse) { return this.range.collapse(false); }
  }
};
