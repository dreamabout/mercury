/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.dialogHandlers.foreColor", function() {

  beforeEach(function() {
    fixture.load('mercury/dialogs/forecolor.html');
    this.dialog = {element: $(fixture.el), button: $('#button')};
    return window.Mercury.dialogHandlers.foreColor.call(this.dialog);
  });

  describe("when a .picker or .last-picked element is clicked", function() {

    it("sets the last picked color to whatever was selected", function() {
      $('.last-picked').css({background: '#0000FF'});
      jasmine.simulate.click($('#white').get(0));
      expect($('.last-picked').css('backgroundColor')).toEqual('rgb(255, 255, 255)');
      jasmine.simulate.click($('#red').get(0));
      return expect($('.last-picked').css('backgroundColor')).toEqual('rgb(255, 0, 0)');
    });

    it("sets the background color of the button", function() {
      $('#button').css({background: '#0000FF'});
      jasmine.simulate.click($('#white').get(0));
      expect($('#button').css('backgroundColor')).toEqual('rgb(255, 255, 255)');
      jasmine.simulate.click($('#red').get(0));
      return expect($('#button').css('backgroundColor')).toEqual('rgb(255, 0, 0)');
    });

    return it("triggers an action", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      jasmine.simulate.click($('#white').get(0));
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['action', {action: 'foreColor', value: '#FFFFFF'}]);
    });
  });


  return describe("when any other element is clicked", () => it("does nothing", function() {
    const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    jasmine.simulate.click($('#green').get(0));
    return expect(spy.callCount).toEqual(0);
  }));
});
