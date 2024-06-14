/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.lightview", function() {

  beforeEach(function() {
    fixture.load('mercury/lightview.html');
    $.fx.off = true;
    window.Mercury.displayRect = {fullHeight: 200, width: 1000};
    return window.Mercury.determinedLocale = {
      top: {'hello world!': 'bork! bork!'},
      sub: {'foo': 'Bork!'}
    };});

  afterEach(function() {
    window.Mercury.config.localization.enabled = false;
    window.Mercury.lightview.instance = null;
    $(window).unbind('mercury:refresh');
    $(window).unbind('mercury:resize');
    return $(document).unbind('keydown');
  });

  describe("singleton method", function() {

    beforeEach(function() {
      return this.showSpy = spyOn(window.Mercury.Lightview.prototype, 'show').andCallFake(() => {});
    });

    it("calls show", function() {
      window.Mercury.lightview('/foo');
      return expect(this.showSpy.callCount).toEqual(1);
    });

    return it("returns an instance", function() {
      const ret = window.Mercury.lightview('/foo');
      expect(ret).toEqual(window.Mercury.lightview.instance);
      return expect(ret.show).toEqual(window.Mercury.Lightview.prototype.show);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      this.initializeSpy = spyOn(window.Mercury.Lightview.prototype, 'initializeLightview').andCallFake(() => {});
      this.updateSpy = spyOn(window.Mercury.Lightview.prototype, 'update').andCallFake(() => {});
      return this.appearSpy = spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
    });

    it("sets options.ujsHandling to true unless set to false", function() {
      let instance = new window.Mercury.Lightview();
      instance.show();
      expect(instance.options.ujsHandling).toEqual(true);
      instance = new window.Mercury.Lightview('', {ujsHandling: false});
      instance.show();
      return expect(instance.options.ujsHandling).toEqual(false);
    });

    it("triggers the focus:window event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      new window.Mercury.Lightview().show();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:window']);
    });

    it("calls initialize", function() {
      new window.Mercury.Lightview().show();
      return expect(this.initializeSpy.callCount).toEqual(1);
    });

    describe("if already visible", () => it("calls update", function() {
      const lightview = new window.Mercury.Lightview();
      lightview.visible = true;
      lightview.show();
      return expect(this.updateSpy.callCount).toEqual(1);
    }));

    return describe("if not visible", () => it("calls appear", function() {
      const lightview = new window.Mercury.Lightview();
      lightview.visible = false;
      lightview.show();
      return expect(this.appearSpy.callCount).toEqual(1);
    }));
  });


  describe("#initializeLightview", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Lightview.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Lightview.prototype, 'bindEvents').andCallFake(() => {});
      return this.lightview = new window.Mercury.Lightview();
    });

    it("calls build", function() {
      this.lightview.initializeLightview();
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      this.lightview.initializeLightview();
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    it("does nothing if already initialized", function() {
      this.lightview.initialized = true;
      this.lightview.initializeLightview();
      return expect(this.buildSpy.callCount).toEqual(0);
    });

    return it("sets initialized to true", function() {
      this.lightview.initializeLightview();
      return expect(this.lightview.initialized).toEqual(true);
    });
  });


  describe("#build", function() {

    beforeEach(function() {
      return this.lightview = new window.Mercury.Lightview('', {appendTo: fixture.el});
    });

    it("builds an element", function() {
      this.lightview.build();
      return expect($('.mercury-lightview', fixture.el).length).toEqual(1);
    });

    it("builds an overlay element", function() {
      this.lightview.build();
      return expect($('.mercury-lightview-overlay', fixture.el).length).toEqual(1);
    });

    it("creates a titleElement", function() {
      this.lightview.build();
      expect($('.mercury-lightview-title', fixture.el).length).toEqual(1);
      expect($('.mercury-lightview-title', fixture.el).html()).toEqual("<span><\/span>");
      return expect(this.lightview.titleElement).toBeDefined();
    });

    it("creates a contentElement", function() {
      this.lightview.build();
      expect($('.mercury-lightview-content', fixture.el).length).toEqual(1);
      return expect(this.lightview.contentElement).toBeDefined();
    });

    it("appends to any element", function() {
      this.lightview.options = {appendTo: $('#lightview_container')};
      this.lightview.build();
      expect($('#lightview_container .mercury-lightview').length).toEqual(1);
      return expect($('#lightview_container .mercury-lightview-overlay').length).toEqual(1);
    });

    return it("creates a close button if asked to in the options", function() {
      this.lightview.options.closeButton = true;
      this.lightview.build();
      return expect($('.mercury-lightview-close', fixture.el).length).toEqual(1);
    });
  });


  describe("observed events", function() {

    beforeEach(() => spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {}));

    describe("without a close button", function() {

      beforeEach(function() {
        return this.lightview = window.Mercury.lightview('/foo', {appendTo: fixture.el});
      });

      describe("custom event: refresh", () => it("calls resize telling it stay visible", function() {
        const spy = spyOn(this.lightview, 'resize').andCallFake(() => {});
        window.Mercury.trigger('refresh');
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual([true]);
      }));

      describe("custom event: resize", function() {

        beforeEach(function() {
          return this.lightview.visible = true;
        });

        return it("calls position", function() {
          const spy = spyOn(this.lightview, 'position').andCallFake(() => {});
          window.Mercury.trigger('resize');
          return expect(spy.callCount).toEqual(1);
        });
      });

      describe("clicking on the overlay", () => it("calls hide", function() {
        const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
        jasmine.simulate.click($('.mercury-lightview-overlay').get(0));
        return expect(spy.callCount).toEqual(1);
      }));

      return describe("pressing esc on document", function() {

        beforeEach(function() {
          return this.lightview.visible = true;
        });

        return it("calls hide", function() {
          const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
          jasmine.simulate.keydown(document, {keyCode: 27});
          return expect(spy.callCount).toEqual(1);
        });
      });
    });

    return describe("with a close button", function() {

      beforeEach(function() {
        return this.lightview = window.Mercury.lightview('/foo', {appendTo: fixture.el, closeButton: true});
      });

      describe("clicking on the close button", () => it("calls hide", function() {
        const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
        jasmine.simulate.click($('.mercury-lightview-close').get(0));
        return expect(spy.callCount).toEqual(1);
      }));

      describe("clicking on the overlay", () => it("doesn't call hide", function() {
        const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
        jasmine.simulate.click($('.mercury-lightview-overlay').get(0));
        return expect(spy.callCount).toEqual(0);
      }));

      return describe("ajax:beforeSend", () => it("sets a success that will load the contents of the response", function() {
        const options = {};
        const spy = spyOn(this.lightview, 'loadContent').andCallFake(() => {});
        this.lightview.element.trigger('ajax:beforeSend', [null, options]);
        expect(options.success).toBeDefined();
        options.success('new content');
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['new content']);
      }));
    });
  });


  describe("#appear", function() {

    beforeEach(function() {
      this.lightview = new window.Mercury.Lightview('/blank.html', {appendTo: fixture.el});
      this.lightview.visible = true;
      spyOn(this.lightview, 'update').andCallFake(() => {});
      this.loadSpy = spyOn(this.lightview, 'load').andCallFake(() => {});
      this.positionSpy = spyOn(this.lightview, 'position').andCallFake(() => {});
      return this.lightview.show();
    });

    it("calls position", function() {
      this.lightview.appear();
      return expect(this.positionSpy.callCount).toEqual(1);
    });

    it("shows the overlay", function() {
      expect($('.mercury-lightview-overlay').css('display')).toEqual('none');
      this.lightview.appear();
      return expect($('.mercury-lightview-overlay').css('display')).toEqual('block');
    });

    it("animates the overlay to full opacity", function() {
      expect($('.mercury-lightview-overlay').css('opacity')).toEqual('0');
      this.lightview.appear();
      return expect($('.mercury-lightview-overlay').css('opacity')).toEqual('1');
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.lightview, 'setTitle').andCallFake(() => {});
      this.lightview.appear();
      return expect(spy.callCount).toEqual(1);
    });

    it("shows the element", function() {
      expect($('.mercury-lightview').css('display')).toEqual('none');
      this.lightview.appear();
      return expect($('.mercury-lightview').css('display')).toEqual('block');
    });

    it("animates the element opacity", function() {
      expect($('.mercury-lightview').css('opacity')).toEqual('0');
      this.lightview.appear();
      return expect($('.mercury-lightview').css('opacity')).toEqual('1');
    });

    it("sets visible to true", function() {
      this.lightview.visible = false;
      this.lightview.appear();
      return expect(this.lightview.visible).toEqual(true);
    });

    return it("calls load", function() {
      this.lightview.appear();
      return expect(this.loadSpy.callCount).toEqual(1);
    });
  });


  describe("#resize", function() {

    beforeEach(function() {
      this.lightview = new window.Mercury.Lightview('/blank.html', {appendTo: fixture.el});
      spyOn(this.lightview, 'appear').andCallFake(() => {});
      this.lightview.show();
      return this.lightview.contentPane = $();
    });

    it("will keep the content element visible if asked to do so", function() {
      $('.mercury-lightview-content').css('visibility', 'visible');
      this.lightview.resize(true);
      return expect($('.mercury-lightview-content').css('visibility')).toEqual('visible');
    });

    it("resizes the element and adjusts it's position when empty", function() {
      $('.mercury-lightview').css({display: 'block', visibility: 'visible', top: 0});
      this.lightview.resize();
      expect($('.mercury-lightview').width()).toEqual(300);
      expect($('.mercury-lightview').offset()).toEqual({top: 35, left: 350});
      return expect($('.mercury-lightview').height()).toEqual(150);
    });

    return it("resizes the element and adjusts it's position when it has content", function() {
      this.lightview.loadContent('<div style="width:600px;height:400px"></div>');
      $('.mercury-lightview').css({display: 'block', visibility: 'visible', top: 0});
      this.lightview.resize();
      expect($('.mercury-lightview').width()).toEqual(300);
      expect($('.mercury-lightview').offset()).toEqual({top: 20, left: 350});
      return expect($('.mercury-lightview').height()).toEqual(180);
    });
  });


  describe("#position", function() {

    beforeEach(() => spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {}));

    // todo: test this
    return it("positions the element", function() {});
  });


  describe("#update", function() {

    beforeEach(function() {
      this.lightview = new window.Mercury.Lightview();
      this.resetSpy = spyOn(this.lightview, 'reset').andCallFake(() => {});
      this.resizeSpy = spyOn(this.lightview, 'resize').andCallFake(() => {});
      this.loadSpy = spyOn(this.lightview, 'load').andCallFake(() => {});
      return this.lightview.update();
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
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      this.ajaxSpy = spyOn($, 'ajax');
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el});
    });

    it("does nothing if there's no url", function() {
      this.lightview.url = null;
      $('.mercury-lightview').removeClass('loading');
      this.lightview.load();
      return expect($('.mercury-lightview').hasClass('loading')).toEqual(false);
    });

    it("sets the loading class on the element", function() {
      this.lightview.load();
      return expect($('.mercury-lightview').hasClass('loading')).toEqual(true);
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.lightview, 'setTitle').andCallFake(() => {});
      this.lightview.load();
      return expect(spy.callCount).toEqual(1);
    });

    describe("on a preloaded view", function() {

      beforeEach(function() {
        this.setTimeoutSpy = spyOn(window, 'setTimeout').andCallFake((callback, timeout) => callback());
        return window.Mercury.preloadedViews = {'/blank.html': 'this is the preloaded content'};});

      afterEach(() => window.Mercury.preloadedViews = {});

      return it("calls loadContent with the content in the preloaded view", function() {
        const spy = spyOn(this.lightview, 'loadContent').andCallFake(() => {});
        this.lightview.load();
        expect(this.setTimeoutSpy.callCount).toEqual(1);
        return expect(spy.callCount).toEqual(1);
      });
    });

    return describe("when not a preloaded view", function() {

      it("makes an ajax request", function() {
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury, 'ajaxHeaders').andCallFake(() => ({'X-CSRFToken': 'f00'}));
        this.lightview.load();
        expect(this.ajaxSpy.callCount).toEqual(1);
        return expect(this.ajaxSpy.argsForCall[0][1]['headers']).toEqual({'X-CSRFToken': 'f00'});
      });

      describe("on success", function() {

        beforeEach(function() {
          return this.ajaxSpy.andCallFake((url, options) => options.success('return value'));
        });

        return it("calls loadContent and passes the returned data", function() {
          const spy = spyOn(this.lightview, 'loadContent').andCallFake(() => {});
          this.lightview.load();
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
          const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
          this.lightview.load();
          return expect(spy.callCount).toEqual(1);
        });

        return it("alerts an error message", function() {
          spyOn(this.lightview, 'hide').andCallFake(() => {});
          const spy = spyOn(window, 'alert').andCallFake(() => {});
          this.lightview.load();
          expect(spy.callCount).toEqual(1);
          return expect(spy.argsForCall[0]).toEqual(['window.Mercury was unable to load /blank.html for the lightview.']);
        });
      });
    });
  });


  describe("#loadContent", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      this.resizeSpy = spyOn(window.Mercury.Lightview.prototype, 'resize').andCallFake(() => {});
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    it("accepts options and sets them to the instance options", function() {
      this.lightview.loadContent('content', {title: 'title'});
      return expect(this.lightview.options).toEqual({title: 'title'});
    });

    it("calls initializeLightview", function() {
      const spy = spyOn(this.lightview, 'initializeLightview').andCallFake(() => {});
      this.lightview.loadContent('content');
      return expect(spy.callCount).toEqual(1);
    });

    it("calls setTitle", function() {
      const spy = spyOn(this.lightview, 'setTitle').andCallFake(() => {});
      this.lightview.loadContent('content');
      return expect(spy.callCount).toEqual(1);
    });

    it("sets loaded to true", function() {
      this.lightview.loaded = false;
      this.lightview.loadContent('content');
      return expect(this.lightview.loaded).toEqual(true);
    });

    it("removes the loading class", function() {
      $('.mercury-lightview').addClass('loading');
      this.lightview.loadContent('content');
      return expect($('.mercury-lightview').hasClass('loading')).toEqual(false);
    });

    it("sets the content elements html to whatever was passed", function() {
      this.lightview.loadContent('<span>content</span>');
      return expect($('.mercury-lightview-content').html()).toEqual('<span>content</span>');
    });

    it("hides the contentElement", function() {
      $('.mercury-lightview-content').css('display', 'block');
      this.lightview.loadContent('content');
      expect($('.mercury-lightview-content').css('display')).toEqual('none');
      return expect($('.mercury-lightview-content').css('visibility')).toEqual('hidden');
    });

    it("calls an afterLoad callback (if provided in options)", function() {
      let callCount = 0;
      this.lightview.loadContent('content', {afterLoad: () => callCount += 1});
      return expect(callCount).toEqual(1);
    });

    it("calls a handler method if one is set in lightviewHandlers");//, ->
//      callCount = 0
//      window.Mercury.lightviewHandlers['foo'] = => callCount += 1
//      @lightview.loadContent('content', {handler: 'foo'})
//      expect(callCount).toEqual(1)

    it("translates the content if configured", function() {
      window.Mercury.config.localization.enabled = true;
      this.lightview.loadContent('<span>foo</span>');
      return expect($('.mercury-lightview-content').html()).toEqual('<span>Bork!</span>');
    });

    it("makes any element with the lightview-close class close the lightview", function() {
      const spy = spyOn(this.lightview, 'hide').andCallFake(() => {});
      this.lightview.loadContent('<span class="lightview-close">foo</span>');
      jasmine.simulate.click(this.lightview.contentElement.find('.lightview-close').get(0));
      return expect(spy.callCount).toEqual(1);
    });

    return it("calls resize", function() {
      this.lightview.loadContent('content');
      return expect(this.resizeSpy.callCount).toEqual(1);
    });
  });


  describe("#setTitle", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    return it("sets the the title contents to what was provided in the options", function() {
      this.lightview.options = {title: 'new title'};
      this.lightview.setTitle();
      return expect($('.mercury-lightview-title span').html()).toEqual('new title');
    });
  });


  describe("#serializeForm", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    describe("without a form", () => it("returns an empty object", function() {
      return expect(this.lightview.serializeForm()).toEqual({});
    }));

    return describe("with a form", () => it("returns an object of the serialized form", function() {
      this.lightview.loadContent('<form><input name="options[foo]" value="bar"/></form>');
      return expect(this.lightview.serializeForm()).toEqual({options: {foo: 'bar'}});
    }));
  });


  describe("#reset", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el, title: 'title'});
    });

    return it("clears the title and content elements", function() {
      $('.mercury-lightview-content').html('content');
      this.lightview.reset();
      expect($('.mercury-lightview-content').html()).toEqual('');
      return expect($('.mercury-lightview-title span').html()).toEqual('');
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Lightview.prototype, 'appear').andCallFake(() => {});
      return this.lightview = window.Mercury.lightview('/blank.html', {appendTo: fixture.el});
    });

    it("triggers the focus:frame event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.lightview.hide();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:frame']);
    });

    it("hides the element", function() {
      this.lightview.element.css('display:block');
      this.lightview.hide();
      return expect($('.mercury-lightview').css('display')).toEqual('none');
    });

    it("hides the overlay element", function() {
      this.lightview.overlay.css('display:block');
      this.lightview.hide();
      return expect($('.mercury-lightview-overlay').css('display')).toEqual('none');
    });

    it("calls reset", function() {
      const spy = spyOn(this.lightview, 'reset').andCallFake(() => {});
      this.lightview.hide();
      return expect(spy.callCount).toEqual(1);
    });

    return it("sets visible to false", function() {
      this.lightview.visible = true;
      this.lightview.hide();
      return expect(this.lightview.visible).toEqual(false);
    });
  });
});
