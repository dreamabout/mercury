/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Palette", function() {

  beforeEach(function() {
    fixture.load('mercury/palette.html');
    return $.fx.off = true;
  });

  afterEach(function() {
    this.palette = null;
    return delete(this.palette);
  });

  describe("#build", function() {

    it("builds an element", function() {
      this.palette = new window.Mercury.Palette('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
      const html = $('<div>').html(this.palette.element).html();
      expect(html).toContain('class="mercury-palette mercury-foo-palette loading"');
      return expect(html).toContain('style="display:none"');
    });

    return it("appends to any element", function() {
      this.palette = new window.Mercury.Palette('/blank.html', 'foo', {appendTo: '#palette_container', for: $('#button')});
      return expect($('#palette_container .mercury-palette').length).toEqual(1);
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      return this.palette = new window.Mercury.Palette('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
    });

    it("hides", function() {
      this.palette.element.css({display: 'block'});
      window.Mercury.trigger('hide:dialogs');
      return expect(this.palette.element.css('display')).toEqual('none');
    });

    return it("doesn't hide if it's the same dialog", function() {
      this.palette.element.css({display: 'block'});
      window.Mercury.trigger('hide:dialogs', this.palette);
      return expect(this.palette.element.css('display')).toEqual('block');
    });
  });


  return describe("#position", function() {

    beforeEach(function() {
      return this.palette = new window.Mercury.Palette('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
    });

    return it("positions based on it's button", function() {
      this.palette.element.css({display: 'block'});
      this.palette.position(true);
      return expect(this.palette.element.offset()).toEqual({top: 62, left: 42});
    });
  });
});
