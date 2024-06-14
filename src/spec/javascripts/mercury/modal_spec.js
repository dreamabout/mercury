/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modal", function() {

  beforeEach(function() {
    fixture.load('mercury/modal.html');
    $.fx.off = true;
    window.Mercury.displayRect = {fullHeight: 200};
    return window.Mercury.determinedLocale = {
      top: {'hello world!': 'bork! bork!'},
      sub: {'foo': 'Bork!'}
    };});

  afterEach(function() {
    window.Mercury.config.localization.enabled = false;
    window.Mercury.modal.instance = false;
    $(window).unbind('mercury:refresh');
    $(window).unbind('mercury:resize');
    return $(document).unbind('keydown');
  });

  describe("builder method", function() {

    beforeEach(function() {
      return this.showSpy = spyOn(window.Mercury.Modal.prototype, 'show').andCallFake(() => {});
    });

    it("calls show", function() {
      window.Mercury.modal('/foo');
      return expect(this.showSpy.callCount).toEqual(1);
    });

    return it("returns an instance", function() {
      const ret = window.Mercury.modal('/foo');
      expect(ret.constructor).toEqual(window.Mercury.Modal);
      return expect(ret.show).toEqual(window.Mercury.Modal.prototype.show);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      this.initializeSpy = spyOn(window.Mercury.Modal.prototype, 'initializeModal').andCallFake(() => {});
      this.updateSpy = spyOn(window.Mercury.Modal.prototype, 'update').andCallFake(() => {});
      return this.appearSpy = spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
    });

    it("sets options.ujsHandling to true unless set to false", function() {
      let instance = new window.Mercury.Modal();
      instance.show();
      expect(instance.options.ujsHandling).toEqual(true);
      instance = new window.Mercury.Modal('', {ujsHandling: false});
      instance.show();
      return expect(instance.options.ujsHandling).toEqual(false);
    });

    it("triggers the focus:window event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      new window.Mercury.Modal().show();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:window']);
    });

    it("calls initialize", function() {
      new window.Mercury.Modal().show();
      return expect(this.initializeSpy.callCount).toEqual(1);
    });

    describe("if already visible", () => it("calls update", function() {
      const modal = new window.Mercury.Modal();
      modal.visible = true;
      modal.show();
      return expect(this.updateSpy.callCount).toEqual(1);
    }));

    return describe("if not visible", () => it("calls appear", function() {
      const modal = new window.Mercury.Modal();
      modal.visible = false;
      modal.show();
      return expect(this.appearSpy.callCount).toEqual(1);
    }));
  });


  describe("#initializeModal", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Modal.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Modal.prototype, 'bindEvents').andCallFake(() => {});
      return this.modal = new window.Mercury.Modal();
    });

    it("calls build", function() {
      this.modal.initializeModal();
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      this.modal.initializeModal();
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    it("does nothing if already initialized", function() {
      this.modal.initialized = true;
      this.modal.initializeModal();
      return expect(this.buildSpy.callCount).toEqual(0);
    });

    return it("sets initialized to true", function() {
      this.modal.initializeModal();
      return expect(this.modal.initialized).toEqual(true);
    });
  });


  describe("#build", function() {

    beforeEach(function() {
      return this.modal = new window.Mercury.Modal('', {appendTo: fixture.el});
    });

    it("builds an element", function() {
      this.modal.build();
      return expect($('.mercury-modal', fixture.el).length).toEqual(1);
    });

    it("builds an overlay element", function() {
      this.modal.build();
      return expect($('.mercury-modal-overlay', fixture.el).length).toEqual(1);
    });

    it("creates a titleElement", function() {
      this.modal.build();
      expect($('.mercury-modal-title', fixture.el).length).toEqual(1);
      expect($('.mercury-modal-title', fixture.el).html()).toMatch(/<span><\/span><a>.+<\/a>/);
      return expect(this.modal.titleElement).toBeDefined();
    });

    it("creates a contentContainerElement", function() {
      this.modal.build();
      expect($('.mercury-modal-content-container', fixture.el).length).toEqual(1);
      return expect(this.modal.contentContainerElement).toBeDefined();
    });

    it("creates a contentElement", function() {
      this.modal.build();
      expect($('.mercury-modal-content-container .mercury-modal-content', fixture.el).length).toEqual(1);
      return expect(this.modal.contentElement).toBeDefined();
    });

    it("appends to any element", function() {
      this.modal.options = {appendTo: $('#modal_container')};
      this.modal.build();
      expect($('#modal_container .mercury-modal').length).toEqual(1);
      return expect($('#modal_container .mercury-modal-overlay').length).toEqual(1);
    });
      
    return it("reuses the .mercury-modal and .mercury-modal-overlay elements", function() {
      this.modal2 = new window.Mercury.Modal('', {appendTo: fixture.el});
      this.modal.build();
      this.modal2.build();
      expect($('.mercury-modal').length).toEqual(1);
      expect($('.mercury-modal-overlay').length).toEqual(1);
      expect(this.modal2.element.get(0)).toEqual($('.mercury-modal').get(0));
      return expect(this.modal2.overlay.get(0)).toEqual($('.mercury-modal-overlay').get(0));
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/foo', {appendTo: fixture.el});
    });

    describe("custom event: refresh", () => it("calls resize telling it stay visible", function() {
      const spy = spyOn(this.modal, 'resize').andCallFake(() => {});
      window.Mercury.trigger('refresh');
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual([true]);
    }));

    describe("custom event: resize", () => it("calls position", function() {
      const spy = spyOn(this.modal, 'position').andCallFake(() => {});
      window.Mercury.trigger('resize');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("clicking on the overlay (options.allowHideUsingOverlay = true)", () => it("calls hide", function() {
      this.modal.options.allowHideUsingOverlay = true;
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('.mercury-modal-overlay').get(0));
      return expect(spy.callCount).toEqual(1);
    }));

    describe("clicking on the overlay (options.allowHideUsingOverlay = false)", () => it("doesn't call hide", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('.mercury-modal-overlay').get(0));
      return expect(spy.callCount).toEqual(0);
    }));

    describe("clicking on the close button", () => it("calls hide", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('.mercury-modal-title a').get(0));
      return expect(spy.callCount).toEqual(1);
    }));

    describe("pressing esc on document", function() {

      beforeEach(function() {
        return this.modal.visible = true;
      });

      return it("calls hide", function() {
        const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
        jasmine.simulate.keydown(document, {keyCode: 27});
        return expect(spy.callCount).toEqual(1);
      });
    });

    return describe("ajax:beforeSend", () => it("sets a success that will load the contents of the response", function() {
      const options = {};
      const spy = spyOn(this.modal, 'loadContent').andCallFake(() => {});
      this.modal.element.trigger('ajax:beforeSend', [null, options]);
      expect(options.success).toBeDefined();
      options.success('new content');
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['new content']);
    }));
  });


  describe("#appear", function() {

    beforeEach(function() {
      this.modal = new window.Mercury.Modal('/blank.html', {appendTo: fixture.el});
      this.modal.visible = true;
      spyOn(this.modal, 'update').andCallFake(() => {});
      this.loadSpy = spyOn(this.modal, 'load').andCallFake(() => {});
      this.positionSpy = spyOn(this.modal, 'position').andCallFake(() => {});
      return this.modal.show();
    });

    it("calls position", function() {
      this.modal.appear();
      return expect(this.positionSpy.callCount).toEqual(1);
    });

    it("shows the overlay", function() {
      expect($('.mercury-modal-overlay').css('display')).toEqual('none');
      this.modal.appear();
      return expect($('.mercury-modal-overlay').css('display')).toEqual('block');
    });

    it("animates the overlay to full opacity", function() {
      expect($('.mercury-modal-overlay').css('opacity')).toEqual('0');
      this.modal.appear();
      return expect($('.mercury-modal-overlay').css('opacity')).toEqual('1');
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.modal, 'setTitle').andCallFake(() => {});
      this.modal.appear();
      return expect(spy.callCount).toEqual(1);
    });

    it("shows the element", function() {
      expect($('.mercury-modal').css('display')).toEqual('none');
      this.modal.appear();
      return expect($('.mercury-modal').css('display')).toEqual('block');
    });

    it("animates the element down", function() {
      expect($('.mercury-modal').css('top')).toEqual('-100px');
      this.modal.appear();
      return expect($('.mercury-modal').css('top')).toEqual('0px');
    });

    it("sets visible to true", function() {
      this.modal.visible = false;
      this.modal.appear();
      return expect(this.modal.visible).toEqual(true);
    });

    return it("calls load", function() {
      this.modal.appear();
      return expect(this.loadSpy.callCount).toEqual(1);
    });
  });


  describe("#resize", function() {

    beforeEach(function() {
      this.modal = new window.Mercury.Modal('/blank.html', {appendTo: fixture.el});
      spyOn(this.modal, 'appear').andCallFake(() => {});
      this.modal.show();
      return this.modal.contentPane = $();
    });

    it("will keep the content element visible if asked to do so", function() {
      $('.mercury-modal-content').css('visibility', 'visible');
      this.modal.resize(true);
      return expect($('.mercury-modal-content').css('visibility')).toEqual('visible');
    });

    it("resizes the element and adjusts it's position", function() {
      window.Mercury.displayRect.width = 1000;
      $('.mercury-modal').css({display: 'block', visibility: 'visible', top: 0});
      this.modal.resize();
      expect($('.mercury-modal').width()).toEqual(400);
      expect($('.mercury-modal').offset()).toEqual({top: 0, left: 300});
      return expect($('.mercury-modal').height()).toBeGreaterThan(20);
    });

    return it("respects minWidth provided in options", function() {
      this.modal.options.minWidth = 500;
      this.modal.resize();
      return expect($('.mercury-modal').width()).toEqual(500);
    });
  });


  describe("#position", function() {

    beforeEach(() => spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {}));

    // todo: test this
    return it("positions the element", function() {});
  });


  describe("#update", function() {

    beforeEach(function() {
      this.modal = new window.Mercury.Modal();
      this.resetSpy = spyOn(this.modal, 'reset').andCallFake(() => {});
      this.resizeSpy = spyOn(this.modal, 'resize').andCallFake(() => {});
      this.loadSpy = spyOn(this.modal, 'load').andCallFake(() => {});
      return this.modal.update();
    });

    it("calls reset", function() {
      return expect(this.resetSpy.callCount).toEqual(1);
    });

    it("calls resize", function() {
      return expect(this.resizeSpy.callCount).toEqual(1);
    });

    return it("calls load", function() {
      return expect(this.loadSpy.callCount).toEqual(1);
    });
  });


  describe("#load", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      this.ajaxSpy = spyOn($, 'ajax');
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el});
    });

    it("does nothing if there's no url", function() {
      this.modal.url = null;
      $('.mercury-modal').removeClass('loading');
      this.modal.load();
      return expect($('.mercury-modal').hasClass('loading')).toEqual(false);
    });

    it("sets the loading class on the element", function() {
      this.modal.load();
      return expect($('.mercury-modal').hasClass('loading')).toEqual(true);
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.modal, 'setTitle').andCallFake(() => {});
      this.modal.load();
      return expect(spy.callCount).toEqual(1);
    });

    describe("on a preloaded view", function() {

      beforeEach(function() {
        this.setTimeoutSpy = spyOn(window, 'setTimeout').andCallFake((callback, timeout) => callback());
        return window.Mercury.preloadedViews = {'/blank.html': 'this is the preloaded content'};});

      afterEach(() => window.Mercury.preloadedViews = {});

      return it("calls loadContent with the content in the preloaded view", function() {
        const spy = spyOn(this.modal, 'loadContent').andCallFake(() => {});
        this.modal.load();
        expect(this.setTimeoutSpy.callCount).toEqual(1);
        return expect(spy.callCount).toEqual(1);
      });
    });

    return describe("when not a preloaded view", function() {

      it("makes an ajax request", function() {
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury, 'ajaxHeaders').andCallFake(() => ({'X-CSRFToken': 'f00'}));
        this.modal.load();
        expect(this.ajaxSpy.callCount).toEqual(1);
        return expect(this.ajaxSpy.argsForCall[0][1]['headers']).toEqual({'X-CSRFToken': 'f00'});
      });

      describe("on success", function() {

        beforeEach(function() {
          return this.ajaxSpy.andCallFake((url, options) => options.success('return value'));
        });

        return it("calls loadContent and passes the returned data", function() {
          const spy = spyOn(this.modal, 'loadContent').andCallFake(() => {});
          this.modal.load();
          expect(spy.callCount).toEqual(1);
          return expect(spy.argsForCall[0]).toEqual(['return value']);
        });
      });

      return describe("on failure", function() {

        beforeEach(function() {
          return this.ajaxSpy.andCallFake((url, options) => options.error());
        });

        it("calls hide", function() {
          spyOn(window, 'alert').andCallFake(() => {});
          const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
          this.modal.load();
          return expect(spy.callCount).toEqual(1);
        });

        return it("alerts an error message", function() {
          spyOn(this.modal, 'hide').andCallFake(() => {});
          const spy = spyOn(window, 'alert').andCallFake(() => {});
          this.modal.load();
          expect(spy.callCount).toEqual(1);
          return expect(spy.argsForCall[0]).toEqual(['window.Mercury was unable to load /blank.html for the modal.']);
        });
      });
    });
  });


  describe("#loadContent", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      this.resizeSpy = spyOn(window.Mercury.Modal.prototype, 'resize').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    it("accepts options and sets them to the instance options", function() {
      this.modal.loadContent('content', {title: 'title'});
      return expect(this.modal.options).toEqual({title: 'title'});
    });

    it("calls initialize", function() {
      const spy = spyOn(this.modal, 'initializeModal').andCallFake(() => {});
      this.modal.loadContent('content');
      return expect(spy.callCount).toEqual(1);
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.modal, 'setTitle').andCallFake(() => {});
      this.modal.loadContent('content');
      return expect(spy.callCount).toEqual(1);
    });

    it("sets loaded to true", function() {
      this.modal.loaded = false;
      this.modal.loadContent('content');
      return expect(this.modal.loaded).toEqual(true);
    });

    it("removes the loading class", function() {
      $('.mercury-modal').addClass('loading');
      this.modal.loadContent('content');
      return expect($('.mercury-modal').hasClass('loading')).toEqual(false);
    });

    it("sets the content elements html to whatever was passed", function() {
      this.modal.loadContent('<span>content</span>');
      return expect($('.mercury-modal-content').html()).toEqual('<span>content</span>');
    });

    it("hides the contentElement", function() {
      $('.mercury-modal-content').css('display', 'block');
      this.modal.loadContent('content');
      expect($('.mercury-modal-content').css('display')).toEqual('none');
      return expect($('.mercury-modal-content').css('visibility')).toEqual('hidden');
    });

    it("finds the content panes and control elements in case they were added with the content", function() {
      this.modal.loadContent('<div class="mercury-display-pane-container"></div><div class="mercury-display-controls"></div>');
      expect(this.modal.contentPane.get(0)).toEqual($('.mercury-display-pane-container', fixture.el).get(0));
      return expect(this.modal.contentControl.get(0)).toEqual($('.mercury-display-controls', fixture.el).get(0));
    });

    it("calls an afterLoad callback (if provided in options)", function() {
      let callCount = 0;
      this.modal.loadContent('content', {afterLoad: () => callCount += 1});
      return expect(callCount).toEqual(1);
    });

    it("calls a handler method if one is set in modalHandlers", function() {
      let callCount = 0;
      window.Mercury.modalHandlers['foo'] = () => callCount += 1;
      this.modal.loadContent('content', {handler: 'foo'});
      return expect(callCount).toEqual(1);
    });

    it("translates the content if configured", function() {
      window.Mercury.config.localization.enabled = true;
      this.modal.loadContent('<span>foo</span>');
      return expect($('.mercury-modal-content').html()).toEqual('<span>Bork!</span>');
    });

    it("makes any element with the modal-close class close the modal", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      this.modal.loadContent('<span class="modal-close">foo</span>');
      jasmine.simulate.click(this.modal.contentElement.find('.modal-close').get(0));
      return expect(spy.callCount).toEqual(1);
    });

    return it("calls resize", function() {
      this.modal.loadContent('content');
      return expect(this.resizeSpy.callCount).toEqual(1);
    });
  });


  describe("#setTitle", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    it("sets the the title contents to what was provided in the options", function() {
      this.modal.options = {title: 'new title'};
      this.modal.setTitle();
      expect($('.mercury-modal-title span').html()).toEqual('new title');
      return expect($('.mercury-modal-title a').css('display')).toEqual('inline');
    });

    return it("hides the close button if the options.closeButton is false", function() {
      this.modal.options = {title: 'new title', closeButton: false};
      this.modal.setTitle();
      return expect($('.mercury-modal-title a').css('display')).toEqual('none');
    });
  });


  describe("#serializeForm", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    describe("without a form", () => it("returns an empty object", function() {
      return expect(this.modal.serializeForm()).toEqual({});
    }));

    return describe("with a form", () => it("returns an object of the serialized form", function() {
      this.modal.loadContent('<form><input name="options[foo]" value="bar"/></form>');
      return expect(this.modal.serializeForm()).toEqual({options: {foo: 'bar'}});
    }));
  });


  describe("#reset", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    return it("clears the title and content elements", function() {
      $('.mercury-modal-content').html('content');
      this.modal.reset();
      expect($('.mercury-modal-content').html()).toEqual('');
      return expect($('.mercury-modal-title span').html()).toEqual('');
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Modal.prototype, 'appear').andCallFake(() => {});
      return this.modal = window.Mercury.modal('/blank.html', {appendTo: fixture.el});
    });

    it("triggers the focus:frame event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.modal.hide();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:frame']);
    });

    it("hides the element", function() {
      this.modal.element.css('display:block');
      this.modal.hide();
      return expect($('.mercury-modal').css('display')).toEqual('none');
    });

    it("hides the overlay element", function() {
      this.modal.overlay.css('display:block');
      this.modal.hide();
      return expect($('.mercury-modal-overlay').css('display')).toEqual('none');
    });

    it("calls reset", function() {
      const spy = spyOn(this.modal, 'reset').andCallFake(() => {});
      this.modal.hide();
      return expect(spy.callCount).toEqual(1);
    });

    it("sets visible to false", function() {
      this.modal.visible = true;
      this.modal.hide();
      return expect(this.modal.visible).toEqual(false);
    });

    return it("does nothing if the modal is still in the process of showing", function() {
      const spy = spyOn(this.modal, 'reset').andCallFake(() => {});
      this.modal.showing = true;
      this.modal.hide();
      return expect(spy.callCount).toEqual(0);
    });
  });
});
