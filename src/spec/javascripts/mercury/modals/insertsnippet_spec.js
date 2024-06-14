/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.insertSnippet", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/insertsnippet.html');
    window.Mercury.Snippet.all = [];
    window.Mercury.Snippet.load({
      'snippet_0': {name: 'foo', options: {'first_name': "Jeremy", 'last_name': "Jackson"}},
    });
    this.modal = {
      element: $(fixture.el),
      hide() {},
      options: {snippetName: 'test'}
    };
    return window.Mercury.modalHandlers.insertSnippet.call(this.modal);
  });

  return describe("submitting", function() {

    it("hides the modal", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('#submit').get(0));
      return expect(spy.callCount).toEqual(1);
    });

    describe("if there's an active snippet", function() {

      beforeEach(() => window.Mercury.snippet = window.Mercury.Snippet.all[0]);

      it("updates the snippet", function() {
        const spy = spyOn(window.Mercury.Snippet.prototype, 'setOptions').andCallThrough();
        jasmine.simulate.click($('#submit').get(0));
        expect(spy.callCount).toEqual(1);
        return expect(window.Mercury.Snippet.all[0]['options']).toEqual({first_name: 'Wilma', last_name: 'Flintstone'});
      });

      return it("triggers an action", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        jasmine.simulate.click($('#submit').get(0));
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['action', {action: 'insertSnippet', value: window.Mercury.Snippet.all[0]}]);
      });
    });

    return describe("if there's no active snippet", function() {

      it("creates a snippet", function() {
        const spy = spyOn(window.Mercury.Snippet, 'create').andCallThrough();
        jasmine.simulate.click($('#submit').get(0));
        expect(spy.callCount).toEqual(1);
        return expect(window.Mercury.Snippet.all[1]['options']).toEqual({first_name: 'Wilma', last_name: 'Flintstone'});
      });

      return it("triggers an action", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        jasmine.simulate.click($('#submit').get(0));
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['action', {action: 'insertSnippet', value: window.Mercury.Snippet.all[1]}]);
      });
    });
  });
});
