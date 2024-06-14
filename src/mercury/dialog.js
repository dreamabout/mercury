/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// # window.Mercury Dialog
//
// Dialog is a base class that's used by Palette, Select, Panel, and through Palette, the Toolbar.Expander.  It's basic
// function is to provide an interface element that can be opened, interacted with, and then closed.
//
window.Mercury.Dialog = class Dialog {

  // The constructor expects a url to load, a name, and options.
  //
  // @url _string_ used to load the contents, either using Ajax or by pulling content from preloadedViews
  //
  // @name _string_ used in building of the element, and is assigned as part of the elements class (eg.
  //     `mercury-[name]-dialog`)
  //
  // @options _object_
  //
  // **Options**
  //
  // @for _Toolbar.Button_ used so the dialog can be shown/hidden based on button interactions.
  //
  // @preload _boolean_ if true, the view for this dialog will be loaded prior to being shown, otherwise the view will be
  //     loaded the first time it's shown, and cached for all future interactions.
  //
  // @appendTo _element_ you can append a dialog to any element by providing this option.
  constructor(url, name, options) {
    this.url = url;
    this.name = name;
    if (options == null) { options = {}; }
    this.options = options;
    this.button = this.options.for;

    this.build();
    this.bindEvents();
    this.preload();
  }


  // ## #build
  //
  // Builds the element and appends it to the DOM.  You can provide an element to append it to in the options, otherwise
  // it will be appended to the body.
  build() {
    let left;
    this.element = jQuery('<div>', {class: `mercury-dialog mercury-${this.name}-dialog loading`, style: 'display:none'});
    return this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
  }


  // ## #bindEvents
  //
  // Bind to all the events we should handle.  In this case we only stop the mousedown event, since dialogs aren't
  // expected to have inputs etc.
  //
  // **Note:** By stopping the mousedown event we're limiting what's possible in dialogs, but this is needed to keep
  // focus from being taken away from the active region when different things are clicked on in dialogs.
  bindEvents() {
    return this.element.on('mousedown', event => event.stopPropagation());
  }


  // ## #preload
  //
  // If the options dictate that the content should be preloaded we load the view before we do anything else.  This is
  // useful if you don't want to make the user wait the half second or however long the server may take to respond when
  // they open various dialogs.
  preload() {
    if (this.options.preload) { return this.load(); }
  }


  // ## #toggle
  //
  // Toggle the dialog based on current visibility.
  toggle() {
    if (this.visible) { return this.hide(); } else { return this.show(); }
  }


  // ## #resize
  //
  // In the base class resize just calls through to show, but in the implementation classes resize typically adjusts the
  // size based on it's contents.
  resize() {
    return this.show();
  }


  // ## #show
  //
  // When showing a dialog it's expected that all other dialogs will close, and we fire an event for this.  The dialog is
  // then positioned and shown.  The show animation of the dialog is typically dictated by the implementation class.
  show() {
    // Tell all other dialogs to close.
    window.Mercury.trigger('hide:dialogs', this);
    this.visible = true;
    if (this.loaded) {
      this.element.css({width: 'auto', height: 'auto'});
      this.position(this.visible);
    } else {
      this.position();
    }
    // Then show the element.
    return this.appear();
  }


  // ## #position
  //
  // Interface method.  Implementations are expected to position the dialog themselves.
  //
  // @keepVisible _boolean_ specifies if the element should stay visible if it's already visible.
  position(keepVisible) {}


  // ## #appear
  //
  // Animate the element into view.  After it's done showing, we load and resize it if it's not already loaded, so in
  // cases where content is not preloaded we can display the dialog, fill it's contents, and then animate the resize.
  appear() {
    this.element.css({display: 'block', opacity: 0});
    return this.element.animate({opacity: 0.95}, 200, 'easeInOutSine', () => {
      if (!this.loaded) { return this.load(() => this.resize()); }
    });
  }


  // ## #hide
  //
  // Hides the element and keeps track of it's visibility.
  hide() {
    this.element.hide();
    return this.visible = false;
  }


  // ## #load
  //
  // Fetches the content that will be loaded into the dialog.
  //
  // @callback _function_ will be called after the content is loaded.
  load(callback) {
    if (!this.url) { return; }
    if (window.Mercury.preloadedViews[this.url]) {
      // If there's a preloadedView defined for the url being requested, load that one.
      this.loadContent(window.Mercury.preloadedViews[this.url]);
      // And call the dialog handler if there's one.  We've broken the handlers out into separate files so they can be
      // tested more easily, but you can define your own by putting them in dialogHandlers.
      if (window.Mercury.dialogHandlers[this.name]) { window.Mercury.dialogHandlers[this.name].call(this); }
      if (callback) { return callback(); }
    } else {
      // Otherwise make an Ajax request to get the content.
      return jQuery.ajax(this.url, {
        success: data => {
          this.loadContent(data);
          if (window.Mercury.dialogHandlers[this.name]) { window.Mercury.dialogHandlers[this.name].call(this); }
          if (callback) { return callback(); }
        },
        error: () => {
          // If the Ajax fails, we hide the dialog and alert the user about the error.
          this.hide();
          if (this.button) { this.button.removeClass('pressed'); }
          return window.Mercury.notify('window.Mercury was unable to load %s for the "%s" dialog.', this.url, this.name);
        }
      });
    }
  }


  // ## #loadContent
  //
  // Loads content into the element, and removes the loading class.
  //
  // @data _mixed_ a string or jQuery object that can be inserted into the dialog.
  loadContent(data) {
    this.loaded = true;
    this.element.removeClass('loading');
    this.element.html(data);
    if (window.Mercury.config.localization.enabled) { return this.element.localize(window.Mercury.locale()); }
  }
};
