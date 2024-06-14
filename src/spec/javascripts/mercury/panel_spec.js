/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Panel", function() {

  beforeEach(function() {
    fixture.load('mercury/panel.html');
    window.Mercury.displayRect = {top: 20, left: 20, width: 200, height: 200};
    $.fx.off = true;
    return window.Mercury.determinedLocale = {
      top: {'hello world!': 'bork! bork!'},
      sub: {'foo': 'Bork!'}
    };});

  afterEach(function() {
    window.Mercury.config.localization.enabled = false;
    delete(this.panel);
    $(window).unbind('mercury:resize');
    return $(window).unbind('mercury:hide:panels');
  });

  describe("#build", function() {

    it("builds an element", function() {
      this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel'});
      const html = $('<div>').html(this.panel.element).html();
      expect(html).toContain('class="mercury-panel loading"');
      expect(html).toContain('style="display:none;"');
      expect(html).toContain('<h1><span>foo panel</span></h1><div class="mercury-panel-pane"></div>');
      return expect(html).not.toContain('class="mercury-panel-close"');
    });

    it("appends to any element", function() {
      this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: '#panel_container', title: 'foo panel'});
      return expect($('#panel_container .mercury-panel').length).toEqual(1);
    });

    return it("creates a close button if it should", function() {
      this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel', closeButton: true});
      const html = $('<div>').html(this.panel.element).html();
      expect(html).toContain('class="mercury-panel-close"');
      return expect(this.panel.element.find('.mercury-panel-close').css('opacity')).toEqual('0');
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      return this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel', for: $('#button'), closeButton: true});
    });

    describe("custom event: resize", () => it("calls position", function() {
      const spy = spyOn(window.Mercury.Panel.prototype, 'position').andCallFake(() => {});
      window.Mercury.trigger('resize');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("custom event: hide:panels", function() {

      it("hides", function() {
        this.panel.element.css({display: 'block'});
        window.Mercury.trigger('hide:panels');
        return expect(this.panel.element.css('display')).toEqual('none');
      });

      return it("doesn't hide if it's the same dialog", function() {
        this.panel.element.css({display: 'block'});
        window.Mercury.trigger('hide:panels', this.panel);
        return expect(this.panel.element.css('display')).toEqual('block');
      });
    });

    describe("ajax:beforeSend", () => it("sets a success that will load the contents of the response", function() {
      const options = {};
      const loadContentSpy = spyOn(window.Mercury.Panel.prototype, 'loadContent').andCallFake(() => {});
      const resizeSpy = spyOn(window.Mercury.Panel.prototype, 'resize').andCallFake(() => {});
      this.panel.element.trigger('ajax:beforeSend', [null, options]);
      expect(options.success).toBeDefined();
      options.success('new content');
      expect(loadContentSpy.callCount).toEqual(1);
      expect(loadContentSpy.argsForCall[0]).toEqual(['new content']);
      return expect(resizeSpy.callCount).toEqual(1);
    }));

    return describe("clicking on the close button", () => it("calls hide:panels", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      jasmine.simulate.click(this.panel.element.find('.mercury-panel-close').get(0));
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['hide:panels']);
    }));
  });


  describe("#show", function() {

    beforeEach(function() {
      return this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel'});
    });

    return it("hides other panels and dialogs", function() {
      spyOn(window.Mercury.Panel.prototype, 'position');
      spyOn(window.Mercury.Panel.prototype, 'appear');
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.panel.show();
      expect(spy.callCount).toEqual(2);
      expect(spy.argsForCall[0]).toEqual(['hide:panels', this.panel]);
      return expect(spy.argsForCall[1]).toEqual(['hide:dialogs', this.panel]);
    });
  });


  describe("#resize", function() {

    beforeEach(function() {
      this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: '#panel_container', title: 'foo panel'});
      this.panel.element.css({display: 'block'});
      return this.panel.visible = true;
    });

    it("figures out what size it should be and resizes", function() {
      this.panel.resize();
      expect(this.panel.element.offset()).toEqual({top: 42, left: 84});
      return expect(this.panel.element.css('display')).toEqual('block');
    });

    it("calls makeDraggable", function() {
      const spy = spyOn(window.Mercury.Panel.prototype, 'makeDraggable').andCallFake(() => {});
      this.panel.resize();
      return expect(spy.callCount).toEqual(1);
    });

    return it("keeps it hidden if it's not supposed to be visible", function() {
      this.panel.visible = false;
      this.panel.resize();
      return expect(this.panel.element.css('display')).toEqual('none');
    });
  });


  describe("#position", function() {

    beforeEach(function() {
      this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: '#panel_container', title: 'foo panel'});
      this.panel.element.css({display: 'block'});
      return this.panel.visible = true;
    });

    it("positions based on the display rectangle", function() {
      this.panel.position(true);
      expect(this.panel.element.offset()).toEqual({top: 70, left: 122});
      return expect(this.panel.element.css('display')).toEqual('block');
    });

    it("calls makeDraggable", function() {
      const spy = spyOn(window.Mercury.Panel.prototype, 'makeDraggable').andCallFake(() => {});
      this.panel.position();
      return expect(spy.callCount).toEqual(1);
    });

    return it("keeps it hidden if it's not supposed to be visible", function() {
      this.panel.visible = false;
      this.panel.position();
      return expect(this.panel.element.css('display')).toEqual('none');
    });
  });


  describe("#loadContent", function() {

    beforeEach(function() {
      return this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel'});
    });

    it("sets loaded to be true", function() {
      this.panel.loadContent();
      return expect(this.panel.loaded).toEqual(true);
    });

    it("removes the loading class from the element", function() {
      this.panel.loadContent();
      return expect(this.panel.element.hasClass('loading')).toEqual(false);
    });

    it("sets the element html to be the data passed to it", function() {
      this.panel.loadContent('<span>hello world!</span>');
      const html = this.panel.element.html();
      expect(html).toContain('class="mercury-panel-pane"');
      expect(html).toContain('style="visibility: hidden;');
      return expect(html).toContain('hello world!');
    });

    return it("sets the element html to be the data passed to it -- translated", function() {
      window.Mercury.config.localization.enabled = true;
      this.panel.loadContent('<span>hello world!</span>');
      const html = this.panel.element.html();
      expect(html).toContain('class="mercury-panel-pane"');
      expect(html).toContain('style="visibility: hidden;');
      return expect(html).toContain('bork! bork!');
    });
  });


  return describe("#makesDraggable", function() {

    beforeEach(function() {
      return this.panel = new window.Mercury.Panel('/evergreen/resources/panel.html', 'foo', {appendTo: fixture.el, title: 'foo panel'});
    });

    return it("makes the element draggable", function() {
      const spy = spyOn($.fn, 'draggable').andCallFake(() => {});
      this.panel.makeDraggable();
      return expect(spy.callCount).toEqual(1);
    });
  });
});
