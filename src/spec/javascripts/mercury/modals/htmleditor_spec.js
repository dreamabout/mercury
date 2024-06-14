/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.htmlEditor", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/htmleditor.html');
    this.modal = {
      element: $(fixture.el),
      hide() {}
    };
    window.Mercury.region =
      {content() { return '<span>html \ncontent</span>'; }};
    return window.Mercury.modalHandlers.htmlEditor.call(this.modal);
  });

  describe("loading", () => it("sets the value of the textarea", () => expect($('textarea', fixture.el).val()).toEqual('<span>html \ncontent</span>')));


  return describe("submitting", function() {

    it("triggers a replaceHTML action", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      jasmine.simulate.click($('#submit').get(0));
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['action', {action: 'replaceHTML', value: '<span>html \ncontent</span>'}]);
    });

    return it("hides the modal", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('#submit').get(0));
      return expect(spy.callCount).toEqual(1);
    });
  });
});
