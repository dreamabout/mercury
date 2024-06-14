/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.insertMedia = {

  initialize() {
    this.element.find('.control-label input').on('click', this.onLabelChecked);
    this.element.find('.controls .optional, .controls .required').on('focus', event => this.onInputFocused($(event.target)));

    this.focus('#media_image_url');
    this.initializeForm();

    // build the image or embed/iframe on form submission
    return this.element.find('form').on('submit', event => {
      event.preventDefault();
      this.validateForm();
      if (!this.valid) {
        this.resize();
        return;
      }
      this.submitForm();
      return this.hide();
    });
  },


  initializeForm() {
    // get the selection and initialize its information into the form
    let iframe, image;
    if (!window.window.Mercury.region || !window.window.Mercury.region.selection) {
      return;
    }
    const selection = window.window.Mercury.region.selection();
    if (typeof selection.is === 'function' ? selection.is('img') : undefined) {
      image = selection;
    }
    // if we're editing an image prefill the information
    if (image) {
      this.element.find('#media_image_url').val(image.attr('src'));
      this.element.find('#media_image_alignment').val(image.attr('align'));
      this.element.find('#media_image_float').val((image.attr('style') != null) ? image.css('float') : '');
      this.element.find('#media_image_width').val(image.width() || '');
      this.element.find('#media_image_height').val(image.height() || '');
      this.focus('#media_image_url');
    }
    if (typeof selection.is === 'function' ? selection.is('iframe') : undefined) {
      iframe = selection;
    }
    // if we're editing an iframe (assume it's a video for now)
    if (iframe) {
      const src = iframe.attr('src');
      if (/^https?:\/\/www.youtube.com\//i.test(src)) {
        // it's a youtube video
        this.element.find('#media_youtube_url').val(`${src.match(/^https?/)[0]}://youtu.be/${src.match(/\/embed\/(\w+)/)[1]}`);
        this.element.find('#media_youtube_width').val(iframe.width());
        this.element.find('#media_youtube_height').val(iframe.height());
        return this.focus('#media_youtube_url');
      } else if (/^https?:\/\/player.vimeo.com\//i.test(src)) {
        // it's a vimeo video
        this.element.find('#media_vimeo_url').val(`${src.match(/^https?/)[0]}://vimeo.com/${src.match(/\/video\/(\w+)/)[1]}`);
        this.element.find('#media_vimeo_width').val(iframe.width());
        this.element.find('#media_vimeo_height').val(iframe.height());
        return this.focus('#media_vimeo_url');
      }
    }
  },


  focus(selector) {
    return setTimeout((() => this.element.find(selector).focus()), 300);
  },


  onLabelChecked() {
    const forInput = jQuery(this).closest('.control-label').attr('for');
    return jQuery(this).closest('.control-group').find(`#${forInput}`).focus();
  },


  onInputFocused(input) {
    input.closest('.control-group').find('input[type=radio]').prop('checked', true);

    if (input.closest('.media-options').length) {
      return;
    }
    this.element.find(".media-options").hide();
    this.element.find(`#${input.attr('id').replace('media_', '')}_options`).show();
    return this.resize(true);
  },


  addInputError(input, message) {
    input.after('<span class="help-inline error-message">' + window.window.Mercury.I18n(message) + '</span>').closest('.control-group').addClass('error');
    return this.valid = false;
  },


  clearInputErrors() {
    this.element.find('.control-group.error').removeClass('error').find('.error-message').remove();
    return this.valid = true;
  },


  validateForm() {
    this.clearInputErrors();

    const type = this.element.find('input[name=media_type]:checked').val();
    const el = this.element.find(`#media_${type}`);

    switch (type) {
      case 'youtube_url':
        var url = this.element.find('#media_youtube_url').val();
        if (!/^https?:\/\/youtu.be\//.test(url)) {
          return this.addInputError(el, "is invalid");
        }
        break;
      case 'vimeo_url':
        url = this.element.find('#media_vimeo_url').val();
        if (!/^https?:\/\/vimeo.com\//.test(url)) {
          return this.addInputError(el, "is invalid");
        }
        break;
      default:
        if (!el.val()) {
          return this.addInputError(el, "can't be blank");
        }
    }
  },


  submitForm() {
    let alignment, float, height, width;
    const type = this.element.find('input[name=media_type]:checked').val();
    let url, code, protocol, value;
    switch (type) {
      case 'image_url':
        var attrs = { src: this.element.find('#media_image_url').val() };
        alignment = this.element.find('#media_image_alignment').val()
        if (alignment) {
          attrs['align'] = alignment;
        }
        attrs['style'] = '';
        float = this.element.find('#media_image_float').val()
        if (float) {
          attrs['style'] += 'float: ' + float + '; ';
        }
        width = this.element.find('#media_image_width').val()
        if (width) {
          attrs['style'] += 'width: ' + width + 'px; ';
        }
        height = this.element.find('#media_image_height').val()
        if (height) {
          attrs['style'] += 'height: ' + height + 'px;';
        }
        return window.window.Mercury.trigger('action', { action: 'insertImage', value: attrs });

      case 'youtube_url':
        url = this.element.find('#media_youtube_url').val();
        code = url.replace(/https?:\/\/youtu.be\//, '');
        protocol = 'http';
        if (/^https:/.test(url)) {
          protocol = 'https';
        }
        value = jQuery('<iframe>', {
          width: parseInt(this.element.find('#media_youtube_width').val(), 10) || 560,
          height: parseInt(this.element.find('#media_youtube_height').val(), 10) || 349,
          src: `${protocol}://www.youtube.com/embed/${code}?wmode=transparent`,
          frameborder: 0,
          allowfullscreen: 'true'
        });
        return window.window.Mercury.trigger('action', { action: 'insertHTML', value });

      case 'vimeo_url':
        url = this.element.find('#media_vimeo_url').val();
        code = url.replace(/^https?:\/\/vimeo.com\//, '');
        protocol = 'http';
        if (/^https:/.test(url)) {
          protocol = 'https';
        }
        value = jQuery('<iframe>', {
          width: parseInt(this.element.find('#media_vimeo_width').val(), 10) || 400,
          height: parseInt(this.element.find('#media_vimeo_height').val(), 10) || 225,
          src: `${protocol}://player.vimeo.com/video/${code}?title=1&byline=1&portrait=0&color=ffffff`,
          frameborder: 0
        });
        return window.window.Mercury.trigger('action', { action: 'insertHTML', value });
    }
  }

};
