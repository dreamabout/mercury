/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.dialogHandlers.formatblock", function() {

  beforeEach(function() {
    fixture.load('mercury/dialogs/formatblock.html');
    this.dialog = {element: $(fixture.el)};
    return window.Mercury.dialogHandlers.formatblock.call(this.dialog);
  });

  describe("when an element with a data-tag attribute is clicked", () => it("triggers an action", function() {
    const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    jasmine.simulate.click($('#h1').get(0));
    expect(spy.callCount).toEqual(1);
    expect(spy.argsForCall[0]).toEqual(['action', {action: 'formatblock', value: 'h1'}]);
    jasmine.simulate.click($('#div').get(0));
    return expect(spy.argsForCall[1]).toEqual(['action', {action: 'formatblock', value: 'pre'}]);
  }));


  return describe("when any other element is clicked", () => it("does nothing", function() {
    const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    jasmine.simulate.click($('#em').get(0));
    return expect(spy.callCount).toEqual(0);
  }));
});
