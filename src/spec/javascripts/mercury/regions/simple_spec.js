/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Regions.Simple", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/simple.html');
    return this.regionElement = $('#simple_region1');
  });

  return describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Regions.Simple.prototype, 'build').andCallFake(() => {});
      return this.bindEventsSpy = spyOn(window.Mercury.Regions.Simple.prototype, 'bindEvents').andCallFake(() => {});
    });

    it("expects an element and window", function() {
      this.region = new window.Mercury.Regions.Simple(this.regionElement, window);
      expect(this.region.element.get(0)).toEqual($('#simple_region1').get(0));
      return expect(this.region.window).toEqual(window);
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Regions.Simple(this.regionElement, window, {foo: 'something'});
      return expect(this.region.options).toEqual({foo: 'something'});
    });

    it("sets it's type", function() {
      this.region = new window.Mercury.Regions.Simple(this.regionElement, window);
      return expect(this.region.type()).toEqual('simple');
    });

    it("calls build", function() {
      this.region = new window.Mercury.Regions.Simple(this.regionElement, window);
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      this.region = new window.Mercury.Regions.Simple(this.regionElement, window);
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });
});
