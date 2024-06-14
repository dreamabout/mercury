/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.dialogHandlers.style", function() {

  beforeEach(function() {
    fixture.load('mercury/dialogs/style.html');
    this.dialog = {element: $(fixture.el)};
    return window.Mercury.dialogHandlers.style.call(this.dialog);
  });

  describe("when an element with a data-class attribute is clicked", () => it("triggers an action", function() {
    const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    jasmine.simulate.click($('#red').get(0));
    expect(spy.callCount).toEqual(1);
    expect(spy.argsForCall[0]).toEqual(['action', {action: 'style', value: 'red'}]);
    jasmine.simulate.click($('#bold').get(0));
    return expect(spy.argsForCall[1]).toEqual(['action', {action: 'style', value: 'bold'}]);
  }));


  return describe("when any other element is clicked", () => it("does nothing", function() {
    const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    jasmine.simulate.click($('#blue').get(0));
    return expect(spy.callCount).toEqual(0);
  }));
});
