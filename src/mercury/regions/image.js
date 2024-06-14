/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// The image region is designed for a single, stand-along image and allows drag & drop uploading of a replacement right
// into the page, but provides no editing of other DOM attributes at this time.
(function() {
  let type = undefined;
  const Cls = (window.window.Mercury.Regions.Image = class Image extends window.window.Mercury.Region {
    static initClass() {
      this.supported = document.getElementById;
      this.supportedText = "Chrome 10+, Firefox 4+, IE 7+, Safari 5+, Opera 8+";
      type = 'image';


      this.actions = {

        undo() { let prev;
        if (prev = this.history.undo()) { return this.updateSrc(prev.src); } },

        redo() { let next;
        if (next = this.history.redo()) { return this.updateSrc(next.src); } },

        insertImage(options) { return this.updateSrc(options.value.src); }

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


    bindEvents() {
      window.window.Mercury.on('mode', (event, options) => { if (options.mode === 'preview') { return this.togglePreview(); } });

      window.window.Mercury.on('focus:frame', () => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        return this.focus();
      });

      window.window.Mercury.on('action', (event, options) => {
        if (this.previewing || (window.window.Mercury.region !== this)) { return; }
        if (options.action) { return this.execCommand(options.action, options); }
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
        if (event.originalEvent.dataTransfer.files.length) {
          event.preventDefault();
          this.focus();
          return window.window.Mercury.uploader(event.originalEvent.dataTransfer.files[0]);
        }
      });

      return this.element.on('focus', () => {
        return this.focus();
      });
    }


    togglePreview() {
      if (this.previewing) {
        this.previewing = false;
        this.element.attr(window.window.Mercury.config.regions.attribute, type);
        return this.build();
      } else {
        this.previewing = true;
        this.element.removeAttr(window.window.Mercury.config.regions.attribute);
        return window.window.Mercury.trigger('region:blurred', {region: this});
      }
    }


    focus() {
      if (this.previewing) { return; }
      window.window.Mercury.region = this;
      window.window.Mercury.trigger('region:focused', {region: this});
      return window.window.Mercury.trigger('region:update', {region: this});
    }


    execCommand(action, options) {
      let handler;
      if (options == null) { options = {}; }
      super.execCommand(...arguments);
      if (handler = window.window.Mercury.Regions.Image.actions[action]) { return handler.call(this, options); }
    }


    pushHistory() {
      return this.history.push({src: this.element.attr('src')});
    }


    updateSrc(src) {
      return this.element.attr('src', src);
    }


    serialize() {
      return {
        type,
        data: this.dataAttributes(),
        attributes: {
          src: this.element.attr('src')
        }
      };
    }
  });
  Cls.initClass();
  return Cls;
})();
