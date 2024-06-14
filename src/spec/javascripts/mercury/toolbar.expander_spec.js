/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Toolbar.Expander", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.expander.html');
    return this.container = $('#expander_container');
  });

  afterEach(function() {
    this.expander = null;
    delete(this.expander);
    return $(window).unbind('mercury:resize');
  });

  describe("constructor", function() {

    beforeEach(function() {
      return this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
    });

    return it("expects a name, and options", function() {
      const html = $('<div>').html(this.expander).html();
      expect(html).toContain('class="mercury-palette mercury-expander mercury-foo-expander"');
      expect(html).toMatch(/style="display:\s?none/);
      return expect($('.mercury-toolbar-expander', fixture.el).length).toEqual(1);
    });
  });


  describe("#build", function() {

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.Toolbar.Expander.prototype, 'windowResize').andCallFake(() => {});
      return this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
    });

    it("sets the whitespace of the container to normal", function() {
      return expect(this.container.css('whiteSpace')).toEqual('normal');
    });

    it("builds an element", function() {
      const html = $('<div>').html(this.expander).html();
      expect(html).toContain('class="mercury-palette mercury-expander mercury-foo-expander"');
      return expect(html).toMatch(/style="display:\s?none/);
    });

    it("builds a trigger button", () => expect($('.mercury-toolbar-expander', fixture.el).length).toEqual(1));

    return it("calls windowResize", function() {
      return expect(this.resizeSpy.callCount).toEqual(1);
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      $('.mercury-button').data('expander', '<div data-button="test">expander</div>');
      return this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
    });

    describe("custom event: hide:dialogs", function() {

      it("hides", function() {
        this.expander.css({display: 'block'});
        window.Mercury.trigger('hide:dialogs');
        return expect(this.expander.css('display')).toEqual('none');
      });

      return it("doesn't hide if it's the same dialog", function() {});
    });
        // there's no way to test this since we don't expose the instance -- just the element
        //@expander.css({display: 'block'})
        //window.Mercury.trigger('hide:dialogs', !instance!)
        //expect(@expander.css('display')).toEqual('block')

    describe("custom event: resize", () => it("calls windowResize", function() {
      const spy = spyOn(window.Mercury.Toolbar.Expander.prototype, 'windowResize').andCallFake(() => {});
      window.Mercury.trigger('resize');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("click (on trigger)", () => it("pulls buttons into the palette", function() {
      jasmine.simulate.click($('.mercury-toolbar-expander').get(0));
      return expect(this.expander.html()).toEqual('<div data-button="test">expander</div>');
    }));

    return describe("click", () => it("calls click on the real button", function() {
      const button = $('#button2');
      const spy = spyOn(button, 'click').andCallFake(() => {});
      this.container.find = () => button;
      this.expander.appendTo(fixture.el);

      jasmine.simulate.click($('.mercury-toolbar-expander').get(0));
      jasmine.simulate.click($('[data-button=test]').get(0));
      return expect(spy.callCount).toEqual(1);
    }));
  });


  describe("#windowResize", function() {

    it("hides", function() {
      this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
      this.expander.css({display: 'block'});

      window.Mercury.trigger('resize');
      return expect(this.expander.css('display')).toEqual('none');
    });

    it("shows the trigger if the container is wider than the window", function() {
      this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
      window.Mercury.trigger('resize');
      return expect($('.mercury-toolbar-expander').css('display')).toEqual('none');
    });

    return it("hides the trigger if the container is narrower than the window", function() {
      this.container.css({width: '1px'});
      this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
      window.Mercury.trigger('resize');
      return expect($('.mercury-toolbar-expander').css('display')).toEqual('none');
    });
  });


  return describe("#position", () => it("positions the element", function() {
    this.expander = new window.Mercury.Toolbar.Expander('foo', {appendTo: fixture.el, for: this.container});
    this.expander.appendTo('#positioned_container');
    jasmine.simulate.click($('.mercury-toolbar-expander').get(0));

    return expect(this.expander.offset()).toEqual({top: 42, left: 42});
  }));
});
