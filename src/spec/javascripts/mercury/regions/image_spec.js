/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Regions.Image", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/image.html');
    return this.regionElement = $('#image_region1');
  });

  return describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Regions.Image.prototype, 'build').andCallFake(() => {});
      return this.bindEventsSpy = spyOn(window.Mercury.Regions.Image.prototype, 'bindEvents').andCallFake(() => {});
    });

    it("expects an element and window", function() {
      this.region = new window.Mercury.Regions.Image(this.regionElement, window);
      expect(this.region.element.get(0)).toEqual($('#image_region1').get(0));
      return expect(this.region.window).toEqual(window);
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Regions.Image(this.regionElement, window, {foo: 'something'});
      return expect(this.region.options).toEqual({foo: 'something'});
    });

    it("sets it's type", function() {
      this.region = new window.Mercury.Regions.Image(this.regionElement, window);
      return expect(this.region.type()).toEqual('image');
    });

    it("calls build", function() {
      this.region = new window.Mercury.Regions.Image(this.regionElement, window);
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      this.region = new window.Mercury.Regions.Image(this.regionElement, window);
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });
});

