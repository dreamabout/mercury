/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Toolbar", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.html');
    $.fx.off = true;
    return spyOn($, 'ajax').andCallFake((url, options) => {
      if (options.success) { return options.success('data'); }
    });
  });

  afterEach(function() {
    this.toolbar = null;
    return delete(this.toolbar);
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Toolbar.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Toolbar.prototype, 'bindEvents').andCallFake(() => {});
      return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, foo: true});
    });

    it("accepts options as an argument", function() {
      return expect(this.toolbar.options).toEqual({appendTo: fixture.el, foo: true});
    });

    it("calls build", function() {
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    describe("with a primary toolbar", function() {

      beforeEach(function() {
        this.buildButtonSpy = spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
        return this.toolbar = new window.Mercury.Toolbar({appendTo: '#toolbar_container', visible: false});
      });

      it("builds an element", () => expect($('.mercury-toolbar-container').length).toEqual(1));

      it("hides the element if options.visible is false", () => expect($('.mercury-toolbar-container').css('display')).toEqual('none'));

      it("can append to any element", () => expect($('#toolbar_container .mercury-toolbar-container').length).toEqual(1));

      it("builds out toolbar elements from the configuration", function() {
        expect($('.mercury-primary-toolbar').length).toEqual(1);
        expect($('.mercury-editable-toolbar').length).toEqual(1);
        return expect($('.mercury-editable-toolbar').data('regions')).toEqual('full,markdown');
      });

      it("builds buttons etc.", function() {
        return expect(this.buildButtonSpy.callCount).toBeGreaterThan(10);
      });

      it("sets it's width back to 100%", function() {
        return expect(this.toolbar.element.get(0).style.width).toEqual('100%');
      });

      it("disables all but the primary toolbar", () => expect($('.mercury-editable-toolbar').hasClass('disabled')).toEqual(true));

      return it("adds an expander when white-space: nowrap (meaning the toolbar shouldn't wrap)", function() {
        expect($('.mercury-toolbar-button-container').length).toBeGreaterThan(1);
        return expect($('.mercury-toolbar-expander').length).toEqual(1);
      });
    });

    return describe("without a primary toolbar", function() {

      beforeEach(function() {
        this.primaryToolbar = window.Mercury.config.toolbars.primary;
        delete(window.Mercury.config.toolbars.primary);
        this.buildButtonSpy = spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
        return this.toolbar = new window.Mercury.Toolbar({appendTo: '#toolbar_container', visible: false});
      });

      afterEach(function() {
        return window.Mercury.config.toolbars.primary = this.primaryToolbar;
      });

      return it("doesn't disable the toolbars", () => expect($('.mercury-editable-toolbar').hasClass('disabled')).toEqual(false));
    });
  });



  describe("#buildButton", function() {

    beforeEach(function() {
      return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el});
    });

    it("throws an exception when invalid options are passed", function() {
      return expect(() => this.toolbar.buildButton('foo', false)).toThrow('Unknown button structure -- please provide an array, object, or string for "foo".');
    });

    it("returns false if the name is _custom, or _regions", function() {
      expect(this.toolbar.buildButton('_custom', 'foo')).toEqual(false);
      return expect(this.toolbar.buildButton('_regions', ['regiontype', 'another_regiontype'])).toEqual(false);
    });

    it("builds buttons", function() {
      const html = $('<div>').html(this.toolbar.buildButton('foobutton', ['title', 'summary', {}])).html();
      expect(html).toContain('title="summary"');
      expect(html).toContain('class="mercury-button mercury-foobutton-button"');
      return expect(html).toContain('<em>title</em>');
    });

    it("builds button groups", function() {
      const html = $('<div>').html(this.toolbar.buildButton('foogroup', {foobutton: ['title', 'summary', {}]})).html();
      expect(html).toContain('class="mercury-button-group mercury-foogroup-group"');
      expect(html).toContain('title="summary"');
      expect(html).toContain('class="mercury-button mercury-foobutton-button"');
      return expect(html).toContain('<em>title</em>');
    });

    it("builds separators", function() {
      let html = $('<div>').html(this.toolbar.buildButton('foosep1', ' ')).html();
      expect(html).toEqual('<hr class="mercury-separator">');

      html = $('<div>').html(this.toolbar.buildButton('foosep1', '-')).html();
      return expect(html).toEqual('<hr class="mercury-line-separator">');
    });

    it("builds buttons from configuration", function() {
      expect($('.mercury-primary-toolbar .mercury-save-button').length).toEqual(1);
      return expect($('.mercury-primary-toolbar .mercury-preview-button').length).toEqual(1);
    });

    it("builds button groups from configuration", function() {
      expect($('.mercury-editable-toolbar .mercury-decoration-group').length).toEqual(1);
      return expect($('.mercury-editable-toolbar .mercury-script-group').length).toEqual(1);
    });

    return it("builds separators from configuration", function() {
      expect($('.mercury-separator').length).toBeGreaterThan(1);
      return expect($('.mercury-line-separator').length).toBeGreaterThan(1);
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el});
    });

    describe("custom event: region:focused", () => it("enables toolbars based on the region type", function() {
      $('.mercury-editable-toolbar').addClass('disabled');
      window.Mercury.trigger('region:focused', {region: {type() { return 'full'; }}});
      expect($('.mercury.editable-toolbar').hasClass('disabled')).toEqual(false);

      $('.mercury-editable-toolbar').addClass('disabled');
      window.Mercury.trigger('region:focused', {region: {type() { return 'markdown'; }}});
      return expect($('.mercury.editable-toolbar').hasClass('disabled')).toEqual(false);
    }));

    describe("custom event: region:blurred", () => it("disables toolbars for the region type", function() {
      $('.mercury-editable-toolbar').removeClass('disabled');
      window.Mercury.trigger('region:blurred', {region: {type() { return 'full'; }}});
      return expect($('.mercury-editable-toolbar').hasClass('disabled')).toEqual(true);
    }));

    return describe("click", () => it("triggers hide:dialogs", function() {
      const spy = spyOn(window.Mercury, 'trigger');

      jasmine.simulate.click(this.toolbar.element.get(0));

      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['hide:dialogs']);
    }));
  });


  describe("#height", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
      return spyOn(window.Mercury.Toolbar.prototype, 'bindEvents').andCallFake(() => {});
    });

    describe("when visible", function() {

      beforeEach(function() {
        return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: true});
      });

      return it("returns the element outerheight", function() {
        return expect(this.toolbar.height()).toEqual($('.mercury-toolbar-container').outerHeight());
      });
    });

    describe("when not visible", function() {

      beforeEach(function() {
        return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: false});
      });

      return it("returns 0", function() {
        return expect(this.toolbar.height()).toEqual(0);
      });
    });

    return describe("when forced", function() {

      beforeEach(function() {
        return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: false});
      });

      return it("returns the element outerheight", function() {
        return expect(this.toolbar.height(true)).toEqual($('.mercury-toolbar-container').outerHeight());
      });
    });
  });

  describe("#top", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
      return spyOn(window.Mercury.Toolbar.prototype, 'bindEvents').andCallFake(() => {});
    });

    describe("when visible", function() {

      beforeEach(function() {
        return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: true});
      });

      return it("returns the element offests top", function() {
        return expect(this.toolbar.top()).toEqual($('.mercury-toolbar-container').offset().top);
      });
    });

    return describe("when not visible", function() {

      beforeEach(function() {
        return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: false});
      });

      return it("returns the element offests top", function() {
        return expect(this.toolbar.top()).toEqual(0);
      });
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
      spyOn(window.Mercury.Toolbar.prototype, 'bindEvents').andCallFake(() => {});
      return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: false});
    });

    it("sets visible to true", function() {
      this.toolbar.visible = false;
      this.toolbar.show();
      return expect(this.toolbar.visible).toEqual(true);
    });

    it("displays the element", function() {
      $('.mercury-toolbar-container').css({display: 'none'});
      this.toolbar.show();
      return expect($('.mercury-toolbar-container').css('display')).toEqual('block');
    });

    return it("sets the top of the element", function() {
      $('.mercury-toolbar-container').css({top: '-20px'});
      this.toolbar.show();
      return expect($('.mercury-toolbar-container').css('top')).toEqual('0px');
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Toolbar.prototype, 'buildButton').andCallFake(() => $('<div>'));
      spyOn(window.Mercury.Toolbar.prototype, 'bindEvents').andCallFake(() => {});
      return this.toolbar = new window.Mercury.Toolbar({appendTo: fixture.el, visible: true});
    });

    it("sets visible to false", function() {
      this.toolbar.visible = true;
      this.toolbar.hide();
      return expect(this.toolbar.visible).toEqual(false);
    });

    return it("hides the element", function() {
      $('.mercury-toolbar-container').css({display: 'block'});
      this.toolbar.hide();
      return expect($('.mercury-toolbar-container').css('display')).toEqual('none');
    });
  });
});
