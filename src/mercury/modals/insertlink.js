/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.insertLink = {

  initialize() {
    this.editing = false;
    this.content = null;

    // make the inputs work with the radio buttons
    this.element.find('.control-label input').on('click', this.onLabelChecked);
    this.element.find('.controls .optional, .controls .required').on('focus', this.onInputFocused);

    // show/hide the link target options on target change
    this.element.find('#link_target').on('change', () => this.onChangeTarget());

    this.initializeForm();

    // build the link on form submission
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
    let a, img;
    this.fillExistingBookmarks();

    // get the selection and initialize its information into the form
    if (!window.window.Mercury.region || !window.window.Mercury.region.selection) { return; }
    const selection = window.window.Mercury.region.selection();

    // set the text content
    if (selection.textContent) { this.element.find('#link_text').val(selection.textContent()); }

    // if we're editing a link prefill the information

    if (selection && selection.commonAncestor) { a = selection.commonAncestor(true).closest('a'); }
    if (selection.htmlContent) { img = /<img/.test(selection.htmlContent()); }
    if (!img && !(a || !a.length)) { return false; }

    // don't allow changing the content on edit
    this.element.find('#link_text_container').hide();

    if (img) { this.content = selection.htmlContent(); }

    if (!a || !a.length) { return false; }
    this.editing = a;

    // fill in the external url or bookmark select based on what it looks like
    if (a.attr('href') && (a.attr('href').indexOf('#') === 0)) {
      const bookmarkSelect = this.element.find('#link_existing_bookmark');
      bookmarkSelect.val(a.attr('href').replace(/[^#]*#/, ''));
      bookmarkSelect.closest('.control-group').find('input[type=radio]').prop('checked', true);
    } else {
      this.element.find('#link_external_url').val(a.attr('href'));
    }

    // if it has a name, assume it's a bookmark target
    if (a.attr('name')) {
      const newBookmarkInput = this.element.find('#link_new_bookmark');
      newBookmarkInput.val(a.attr('name'));
      newBookmarkInput.closest('.control-group').find('input[type=radio]').prop('checked', true);
    }

    // if it has a target, select it, and try to pull options out
    if (a.attr('target')) {
      this.element.find('#link_target').val(a.attr('target'));
    }

    // if it's a popup window
    if (a.attr('href') && (a.attr('href').indexOf('javascript:void') === 0)) {
      const href = a.attr('href');
      this.element.find('#link_external_url').val(href.match(/window.open\('([^']+)',/)[1]);
      this.element.find('#link_target').val('popup');
      this.element.find('#link_popup_width').val(href.match(/width=(\d+),/)[1]);
      this.element.find('#link_popup_height').val(href.match(/height=(\d+),/)[1]);
      return this.element.find('#popup_options').show();
    }
  },


  fillExistingBookmarks() {
    const bookmarkSelect = this.element.find('#link_existing_bookmark');
    return Array.from(jQuery('a[name]', window.mercuryInstance.document)).map((tag) =>
      bookmarkSelect.append(jQuery('<option>', {value: jQuery(tag).attr('name')}).text(jQuery(tag).text())));
  },


  onLabelChecked() {
    const forInput = jQuery(this).closest('.control-label').attr('for');
    return jQuery(this).closest('.control-group').find(`#${forInput}`).focus();
  },


  onInputFocused() {
    return jQuery(this).closest('.control-group').find('input[type=radio]').prop('checked', true);
  },


  onChangeTarget() {
    this.element.find(".link-target-options").hide();
    this.element.find(`#${this.element.find('#link_target').val()}_options`).show();
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

    const type = this.element.find('input[name=link_type]:checked').val();

    let el = this.element.find(`#link_${type}`);
    if (!el.val()) { this.addInputError(el, "can't be blank"); }

    if (!this.editing && !this.content) {
      el = this.element.find('#link_text');
      if (!el.val()) { return this.addInputError(el, "can't be blank"); }
    }
  },


  submitForm() {
    let attrs;
    const content = this.element.find('#link_text').val();
    const target = this.element.find('#link_target').val();
    const type = this.element.find('input[name=link_type]:checked').val();

    switch (type) {
      case 'existing_bookmark': attrs = {href: `#${this.element.find('#link_existing_bookmark').val()}`}; break;
      case 'new_bookmark': attrs = {name: `${this.element.find('#link_new_bookmark').val()}`}; break;
      default: attrs = {href: this.element.find(`#link_${type}`).val()};
    }

    switch (target) {
      case 'popup':
        var args = {
        width: parseInt(this.element.find('#link_popup_width').val()) || 500,
        height: parseInt(this.element.find('#link_popup_height').val()) || 500,
        menubar: 'no',
        toolbar: 'no'
        };
        attrs['href'] = `javascript:void(window.open('${attrs['href']}', 'popup_window', '${jQuery.param(args).replace(/&/g, ',')}'))`;
        break;
      default:
        if (target) { attrs['target'] = target; }
    }

    const value = {tagName: 'a', attrs, content: this.content || content};

    if (this.editing) {
      return window.window.Mercury.trigger('action', {action: 'replaceLink', value, node: this.editing.get(0)});
    } else {
      return window.window.Mercury.trigger('action', {action: 'insertLink', value});
    }
  }

};
