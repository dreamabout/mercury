/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.dialogHandlers.snippetPanel", function() {

  beforeEach(function() {
    fixture.load('mercury/dialogs/snippetpanel.html');
    this.dialog = {element: $(fixture.el), button: $('#button')};
    return window.Mercury.dialogHandlers.snippetPanel.call(this.dialog);
  });

  describe("filter", () => it("filters on keypress", function() {
    $('#filter').val('foo');
    jasmine.simulate.keyup($('#filter').get(0));
    expect($('#first').css('display')).toNotEqual('none');
    expect($('#second').css('display')).toEqual('none');

    $('#filter').val('b');
    jasmine.simulate.keyup($('#filter').get(0));
    expect($('#first').css('display')).toNotEqual('none');
    expect($('#second').css('display')).toNotEqual('none');

    $('#filter').val('baz');
    jasmine.simulate.keyup($('#filter').get(0));
    expect($('#first').css('display')).toEqual('none');
    return expect($('#second').css('display')).toNotEqual('none');
  }));


  return describe("dragging an image with a data-snippet attribute", () => it("sets the active snippet", function() {}));
});
