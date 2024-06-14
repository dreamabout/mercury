/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Dialog", function() {

  beforeEach(function() {
    fixture.load('mercury/dialog.html');
    $.fx.off = true;
    return window.Mercury.determinedLocale = {
      top: {'hello world!': 'bork! bork!'},
      sub: {'foo': 'Bork!'}
    };});

  afterEach(function() {
    delete(this.dialog);
    return window.Mercury.config.localization.enabled = false;
  });


  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Dialog.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Dialog.prototype, 'bindEvents').andCallFake(() => {});
      return this.preloadSpy = spyOn(window.Mercury.Dialog.prototype, 'preload').andCallFake(() => {});
    });

    it("expects a url and name", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo');
      expect(this.dialog.url).toEqual('/blank.html');
      return expect(this.dialog.name).toEqual('foo');
    });

    it("accepts options", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {for: 'something', foo: 'bar'});
      return expect(this.dialog.options).toEqual({for: 'something', foo: 'bar'});
    });

    it("calls build", function() {
      this.dialog = new window.Mercury.Dialog();
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      this.dialog = new window.Mercury.Dialog();
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    return it("preloads if configured", function() {
      this.dialog = new window.Mercury.Dialog();
      return expect(this.preloadSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    beforeEach(function() {
      this.bindEventsSpy = spyOn(window.Mercury.Dialog.prototype, 'bindEvents').andCallFake(() => {});
      return this.preloadSpy = spyOn(window.Mercury.Dialog.prototype, 'preload').andCallFake(() => {});
    });

    it("builds an element", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
      const html = $('<div>').html(this.dialog.element).html();
      expect(html).toContain('class="mercury-dialog mercury-foo-dialog loading"');
      return expect(html).toContain('style="display:none"');
    });

    return it("appends to any element", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: '#dialog_container'});
      return expect($('#dialog_container .mercury-dialog').length).toEqual(1);
    });
  });


  describe("#bindEvents", () => it("only observes mousedown to stop the event"));


  describe("#preload", function() {

    beforeEach(function() {
      return this.loadSpy = spyOn(window.Mercury.Dialog.prototype, 'load').andCallFake(() => {});
    });

    it("calls load if configured", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el, preload: true});
      return expect(this.loadSpy.callCount).toEqual(1);
    });

    return it("doesn't call load if configured", function() {
      this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el, preload: false});
      return expect(this.loadSpy.callCount).toEqual(0);
    });
  });


  describe("#toggle", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    return it("shows or hides", function() {
      expect(this.dialog.element.css('display')).toEqual('none');
      this.dialog.toggle();
      expect(this.dialog.element.css('display')).toEqual('block');
      this.dialog.toggle();
      return expect(this.dialog.element.css('display')).toEqual('none');
    });
  });


  describe("#resize", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    return it("calls show", function() {
      const spy = spyOn(window.Mercury.Dialog.prototype, 'show').andCallFake(() => {});
      this.dialog.resize();
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    it("triggers a custom event to hide all other dialogs", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.dialog.show();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['hide:dialogs', this.dialog]);
    });

    describe("when already loaded", function() {

      beforeEach(function() {
        return this.dialog.loaded = true;
      });

      it("sets width and height on the element to auto", function() {
        this.dialog.element.css({width: 100});
        this.dialog.show();
        expect(this.dialog.element.get(0).style.width).toEqual('auto');
        return expect(this.dialog.element.get(0).style.height).toEqual('auto');
      });

      it("calls position", function() {
        const spy = spyOn(window.Mercury.Dialog.prototype, 'position').andCallFake(() => {});
        this.dialog.show();
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual([true]);
      });

      return it("calls appear", function() {
        const spy = spyOn(window.Mercury.Dialog.prototype, 'appear').andCallFake(() => {});
        this.dialog.show();
        return expect(spy.callCount).toEqual(1);
      });
    });

    return describe("when not loaded", function() {

      it("calls position", function() {
        const spy = spyOn(window.Mercury.Dialog.prototype, 'position').andCallFake(() => {});
        this.dialog.show();
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual([]);
      });

      return it("calls appear", function() {
        const spy = spyOn(window.Mercury.Dialog.prototype, 'appear').andCallFake(() => {});
        this.dialog.show();
        return expect(spy.callCount).toEqual(1);
      });
    });
  });


  describe("#position", () => it("does nothing and is there as an interface method"));


  describe("#appear", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    it("animates the dialog in", function() {
      this.dialog.appear();
      expect(this.dialog.element.css('display')).toEqual('block');
      return expect(parseFloat(this.dialog.element.css('opacity')).toPrecision(2)).toEqual('0.95');
    });

    return it("calls load if it's not already loaded", function() {});
  });


  describe("#hide", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    return it("hides the dialog", function() {
      this.dialog.element.css({display: 'block'});
      this.dialog.hide();
      expect(this.dialog.element.css('display')).toEqual('none');
      return expect(this.dialog.visible).toEqual(false);
    });
  });


  describe("#load", function() {

    beforeEach(function() {
      this.spyFunction = function() {};
      window.Mercury.dialogHandlers.foo = function() {};
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
    });

    it("does nothing if there's no url", function() {
      const spy = spyOn($, 'ajax').andCallFake(() => {});
      this.dialog.url = false;
      this.dialog.load();
      return expect(spy.callCount).toEqual(0);
    });

    describe("on a preloaded view", function() {

      beforeEach(() => window.Mercury.preloadedViews = {'/blank.html': 'this is the preloaded content'});

      afterEach(() => window.Mercury.preloadedViews = {});

      return it("calls loadContent with the content in the preloaded view", function() {
        const spy = spyOn(window.Mercury.Dialog.prototype, 'loadContent').andCallFake(() => {});
        this.dialog.load();
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['this is the preloaded content']);
      });
    });

    return describe("when not a preloaded view", function() {

      it("makes an ajax request", function() {
        const spy = spyOn($, 'ajax').andCallFake(() => {});
        this.dialog.load();
        return expect(spy.callCount).toEqual(1);
      });

      describe("on success", function() {

        beforeEach(function() {
          this.loadContentSpy = spyOn(window.Mercury.Dialog.prototype, 'loadContent').andCallFake(() => {});
          return this.ajaxSpy = spyOn($, 'ajax').andCallFake((url, options) => {
            if (options.success) { return options.success('return value'); }
          });
        });

        it("calls loadContent with data", function() {
          this.dialog.load();
          expect(this.loadContentSpy.callCount).toEqual(1);
          return expect(this.loadContentSpy.argsForCall[0]).toEqual(['return value']);
        });

        it("calls a dialog handler if there's one", function() {
          const spy = spyOn(window.Mercury.dialogHandlers, 'foo').andCallFake(() => {});
          this.dialog.load();
          return expect(spy.callCount).toEqual(1);
        });

        return it("calls a callback if one was provided", function() {
          const spy = spyOn(this, 'spyFunction').andCallFake(() => {});
          this.dialog.load(this.spyFunction);
          return expect(spy.callCount).toEqual(1);
        });
      });

      return describe("on failure", function() {

        beforeEach(function() {
          this.alertSpy = spyOn(window, 'alert').andCallFake(() => {});
          return this.ajaxSpy = spyOn($, 'ajax').andCallFake((url, options) => {
            if (options.error) { return options.error(); }
          });
        });

        it("hides", function() {
          const spy = spyOn(window.Mercury.Dialog.prototype, 'hide').andCallFake(() => {});
          this.dialog.load();
          return expect(spy.callCount).toEqual(1);
        });

        it("removes the pressed state for it's button", function() {
          $('#button').addClass('pressed');
          this.dialog.load();
          return expect($('#button').hasClass('pressed')).toEqual(false);
        });

        return it("alerts the user", function() {
          this.dialog.load();
          expect(this.alertSpy.callCount).toEqual(1);
          return expect(this.alertSpy.argsForCall[0]).toEqual(['window.Mercury was unable to load /blank.html for the "foo" dialog.']);
        });
      });
    });
  });


  return describe("#loadContent", function() {

    beforeEach(function() {
      return this.dialog = new window.Mercury.Dialog('/blank.html', 'foo', {appendTo: fixture.el});
    });

    it("sets loaded to be true", function() {
      this.dialog.loadContent();
      return expect(this.dialog.loaded).toEqual(true);
    });

    it("removes the loading class from the element", function() {
      this.dialog.loadContent();
      return expect(this.dialog.element.hasClass('loading')).toEqual(false);
    });

    it("sets the element html to be the data passed to it", function() {
      this.dialog.loadContent('<span>hello world!</span>');
      return expect(this.dialog.element.html()).toEqual('<span>hello world!</span>');
    });

    return it("translates the content if configured", function() {
      window.Mercury.config.localization.enabled = true;
      this.dialog.loadContent('<span>hello world!</span>');
      return expect(this.dialog.element.html()).toEqual('<span>bork! bork!</span>');
    });
  });
});
