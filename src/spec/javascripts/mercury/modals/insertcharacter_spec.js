/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.insertCharacter", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/insertcharacter.html');
    this.modal = {
      element: $(fixture.el),
      hide() {}
    };
    this.modalHideSpy = spyOn(this.modal, 'hide').andCallFake(() => {});
    return window.Mercury.modalHandlers.insertCharacter.call(this.modal);
  });

  describe("clicking on a character", function() {

    it("triggers an action event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      jasmine.simulate.click($('#char1').get(0));
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['action', {action: 'insertHTML', value: "&#34;"}]);
    });

    return it("hides the modal", function() {
      jasmine.simulate.click($('#char2').get(0));
      return expect(this.modalHideSpy.callCount).toEqual(1);
    });
  });


  return describe("clicking on any other element", () => it("does nothing", function() {
    jasmine.simulate.click($('#char3').get(0));
    return expect(this.modalHideSpy.callCount).toEqual(0);
  }));
});
