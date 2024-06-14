/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Select", function() {

  beforeEach(function() {
    fixture.load('mercury/select.html');
    return $.fx.off = true;
  });

  afterEach(function() {
    this.select = null;
    return delete(this.select);
  });

  describe("#build", function() {

    it("builds an element", function() {
      this.select = new window.Mercury.Select('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
      const html = $('<div>').html(this.select.element).html();
      expect(html).toContain('class="mercury-select mercury-foo-select loading"');
      return expect(html).toContain('style="display:none"');
    });

    return it("appends to any element", function() {
      this.select = new window.Mercury.Select('/blank.html', 'foo', {appendTo: '#select_container', for: $('#button')});
      return expect($('#select_container .mercury-select').length).toEqual(1);
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      return this.select = new window.Mercury.Select('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
    });

    it("hides", function() {
      this.select.element.css({display: 'block'});
      window.Mercury.trigger('hide:dialogs');
      return expect(this.select.element.css('display')).toEqual('none');
    });

    return it("doesn't hide if it's the same dialog", function() {
      this.select.element.css({display: 'block'});
      window.Mercury.trigger('hide:dialogs', this.select);
      return expect(this.select.element.css('display')).toEqual('block');
    });
  });


  return describe("#position", function() {

    beforeEach(function() {
      return this.select = new window.Mercury.Select('/blank.html', 'foo', {appendTo: fixture.el, for: $('#button')});
    });

    return it("positions based on it's button", function() {
      this.select.element.css({display: 'block'});
      this.select.position(true);
      return expect(this.select.element.offset()).toEqual({top: 20, left: 42});
    });
  });
});
