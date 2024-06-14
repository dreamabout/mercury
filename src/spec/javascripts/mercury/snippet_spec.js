/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Snippet", function() {

  beforeEach(() => fixture.load('mercury/snippet.html'));

  afterEach(() => window.Mercury.Snippet.all = []);

  describe("constructor", function() {

    beforeEach(function() {
      this.setOptionsSpy = spyOn(window.Mercury.Snippet.prototype, 'setOptions').andCallFake(() => {});
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    it("expects name and identity", function() {
      expect(this.snippet.name).toEqual('foo');
      return expect(this.snippet.identity).toEqual('identity');
    });

    it("sets the version", function() {
      expect(this.snippet.version).toEqual(0);
      return expect(this.snippet.identity).toEqual('identity');
    });

    it("creates a history buffer", function() {
      return expect(this.snippet.history).toBeDefined();
    });

    return it("calls setOptions", function() {
      return expect(this.setOptionsSpy.callCount).toEqual(1);
    });
  });


  describe("#getHTML", function() {

    beforeEach(function() {
      this.loadPreviewSpy = spyOn(window.Mercury.Snippet.prototype, 'loadPreview').andCallFake(() => {});
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    it("builds an element (in whatever context is provided", function() {
      const ret = this.snippet.getHTML($(document));
      const html = $('<div>').html(ret).html();
      expect(html).toContain('class="foo-snippet"');
      expect(html).toContain('contenteditable="false"');
      expect(html).toContain('data-snippet="identity"');
      return expect(html).toContain('data-version="1"');
    });

    it("sets the default content to the identity", function() {
      const ret = this.snippet.getHTML($(document));
      return expect(ret.html()).toEqual('[identity]');
    });

    it("calls loadPreview", function() {
      this.snippet.getHTML($(document));
      return expect(this.loadPreviewSpy.callCount).toEqual(1);
    });

    it("passes callback method to loadPreview", function() {
      const callback = () => {};
      this.snippet.getHTML($(document), callback);
      return expect(this.loadPreviewSpy.argsForCall[0][1]).toEqual(callback);
    });

    it("wraps the snippet in the specified wrapperTag", function() {
      this.snippet.wrapperTag = 'li';
      const ret = this.snippet.getHTML($(document));
      const container = $('<div>');
      container.html(ret);
      return expect($(container.children()[0]).is('li')).toEqual(true);
    });

    return it("adds the specified wrapperClass to the wrapperTag", function() {
      this.snippet.wrapperClass = 'something';
      const ret = this.snippet.getHTML($(document));
      const container = $('<div>');
      container.html(ret);
      return expect($(container.children()[0]).hasClass('something')).toEqual(true);
    });
  });

  describe("#getText", function() {

    beforeEach(function() {
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    return it("returns an identity string", function() {
      return expect(this.snippet.getText()).toEqual('[--identity--]');
    });
  });


  describe("#loadPreview", function() {

    beforeEach(function() {
      this.ajaxSpy = spyOn($, 'ajax');
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    it("makes an ajax request", function() {
      this.ajaxSpy.andCallFake(() => {});
      spyOn(window.Mercury, 'ajaxHeaders').andCallFake(() => ({'X-CSRFToken': 'f00'}));
      this.snippet.loadPreview();
      expect(this.ajaxSpy.callCount).toEqual(1);
      expect(this.ajaxSpy.argsForCall[0][0]).toEqual("/mercury/snippets/foo/preview.html");
      expect(this.ajaxSpy.argsForCall[0][1]['data']).toEqual({foo: 'bar'});
      expect(this.ajaxSpy.argsForCall[0][1]['type']).toEqual('POST');
      return expect(this.ajaxSpy.argsForCall[0][1]['headers']).toEqual({'X-CSRFToken': 'f00'});
    });

    describe("ajax success", function() {

      beforeEach(function() {
        return this.ajaxSpy.andCallFake((url, options) => options.success('data'));
      });

      it("sets the data", function() {
        this.snippet.loadPreview($('#snippet'));
        return expect(this.snippet.data).toEqual('data');
      });

      it("puts the data into the element", function() {
        this.snippet.loadPreview($('#snippet'));
        return expect($('#snippet').html()).toEqual('data');
      });

      return it("calls the callback if one was provided", function() {
        let callCount = 0;
        const callback = () => callCount += 1;
        this.snippet.loadPreview($('#snippet'), callback);
        return expect(callCount).toEqual(1);
      });
    });

    return describe("ajax failure", function() {

      beforeEach(function() {
        return this.ajaxSpy.andCallFake((url, options) => options.error());
      });

      return it("alerts the error", function() {
        const spy = spyOn(window, 'alert').andCallFake(() => {});
        this.snippet.loadPreview($('#snippet'));
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['Error loading the preview for the "foo" snippet.']);
      });
    });
  });


  describe("#displayOptions", function() {

    beforeEach(function() {
      this.modalSpy = spyOn(window.Mercury, 'modal').andCallFake(() => {});
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    it("sets the global snippet to itself", function() {
      this.snippet.displayOptions();
      return expect(window.Mercury.snippet).toEqual(this.snippet);
    });

    return it("opens a modal", function() {
      this.snippet.displayOptions();
      return expect(this.modalSpy.callCount).toEqual(1);
    });
  });


  describe("#setOptions", function() {

    beforeEach(function() {
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    it("removes rails form default options that aren't for storing", function() {
      this.snippet.setOptions({foo: 'baz', utf8: 'check', authenticity_token: 'auth_token'});
      return expect(this.snippet.options).toEqual({foo: 'baz'});
    });

    it("increases the version", function() {
      this.snippet.setOptions({foo: 'baz'});
      return expect(this.snippet.version).toEqual(2);
    });

    it("pushes the options to the history buffer", function() {
      this.snippet.setOptions({foo: 'baz'});
      return expect(this.snippet.history.stack.length).toEqual(2);
    });

    return it("can set the wrapperTag attribute from options", function() {
      expect(this.snippet.wrapperTag).toEqual('div');
      this.snippet.setOptions({wrapperTag: 'li'});
      return expect(this.snippet.wrapperTag).toEqual('li');
    });
  });


  describe("#setVersion", function() {

    beforeEach(function() {
      this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
      return this.snippet.history.stack = [1, 2, {foo: 'baz'}, 4, 5, 6, 7, 8, 9, 10];});

    it("sets the version", function() {
      this.snippet.setVersion(5);
      return expect(this.snippet.version).toEqual(5);
    });

    it("accepts a version (can be a string)", function() {
      this.snippet.setVersion('2');
      return expect(this.snippet.version).toEqual(2);
    });

    it("pulls the version out of the history buffer", function() {
      this.snippet.setVersion(3);
      return expect(this.snippet.options).toEqual({foo: 'baz'});
    });

    it("returns true if successful", function() {
      const ret = this.snippet.setVersion('2');
      return expect(ret).toEqual(true);
    });

    return it("returns false if not successful", function() {
      const ret = this.snippet.setVersion('abc');
      return expect(ret).toEqual(false);
    });
  });


  return describe("#serialize", function() {

    beforeEach(function() {
      return this.snippet = new window.Mercury.Snippet('foo', 'identity', {foo: 'bar'});
    });

    return it("returns an object with name and options", function() {
      const ret = this.snippet.serialize();
      return expect(ret).toEqual({name: 'foo', foo: 'bar'});
    });
  });
});



describe("window.Mercury.Snippet class methods", function() {

  afterEach(() => window.Mercury.Snippet.all = []);

  describe(".displayOptionsFor", function() {

    beforeEach(function() {
      this.modalSpy = spyOn(window.Mercury, 'modal').andCallFake(() => {});
      return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    });

    describe("with options", function() {

      it("opens a modal with the name in the url", function() {
        window.Mercury.Snippet.displayOptionsFor('foo');
        expect(this.modalSpy.callCount).toEqual(1);
        return expect(this.modalSpy.argsForCall[0]).toEqual(["/mercury/snippets/foo/options.html", {title: 'Snippet Options', handler: 'insertSnippet', snippetName: 'foo', loadType : 'POST'}]);
      });

      it("sets the snippet back to nothing", function() {
        window.Mercury.snippet = 'foo';
        window.Mercury.Snippet.displayOptionsFor('foo');
        return expect(window.Mercury.snippet).toEqual(null);
      });

      it("can pass options to the modal", function() {
        window.Mercury.Snippet.displayOptionsFor('foo', {option1: 'option1'});
        expect(this.modalSpy.callCount).toEqual(1);
        return expect(this.modalSpy.argsForCall[0]).toEqual(["/mercury/snippets/foo/options.html", {title: 'Snippet Options', handler: 'insertSnippet', snippetName: 'foo', loadType: 'POST', option1: 'option1'}]);
      });

      return it("doesn't trigger an event to insert the snippet", function() {
        window.Mercury.Snippet.displayOptionsFor('foo');
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });

    return describe("without options", function() {

      it("triggers an event to insert the snippet", function() {
        window.Mercury.Snippet.displayOptionsFor('foo', {}, false);
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        return expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertSnippet');
      });

      it("doesn't open a modal", function() {
        window.Mercury.Snippet.displayOptionsFor('foo', {}, false);
        return expect(this.modalSpy.callCount).toEqual(0);
      });

      return it("sets the snippet back to nothing", function() {
        window.Mercury.snippet = 'foo';
        window.Mercury.Snippet.displayOptionsFor('foo', {}, false);
        return expect(window.Mercury.snippet).toEqual(null);
      });
    });
  });


  describe(".create", function() {

    beforeEach(() => window.Mercury.Snippet.all = []);

    it("creates a new instance of window.Mercury.Snippet", function() {
      const ret = window.Mercury.Snippet.create('foo', {foo: 'bar'});
      return expect(ret.options).toEqual({foo: 'bar'});
    });

    it("generates an identity and passes it to the instance", function() {
      const ret = window.Mercury.Snippet.create('foo', {foo: 'bar'});
      return expect(ret.identity).toEqual('snippet_0');
    });

    it("pushes into the collection array", function() {
      window.Mercury.Snippet.create('foo', {foo: 'bar'});
      return expect(window.Mercury.Snippet.all.length).toEqual(1);
    });

    return describe("when a snippet exist with an identical identity", function() {
      it("generates a unique identity", function() {
        window.Mercury.Snippet.load({
          snippet_0: {name: 'foo0', options: {foo: 'bar'}},
          snippet_1: {name: 'foo1', options: {foo: 'bar'}},
          snippet_3: {name: 'bar3', options: {baz: 'pizza'}}});

        const ret = window.Mercury.Snippet.create('noobie', {noobie: 'one'});
        return expect(ret.identity).toEqual('snippet_2');
      });

      return it("generates a unique identity with an un-ordered snippet list", function() {
        window.Mercury.Snippet.load({
          snippet_0: {name: 'foo0', options: {foo: 'bar'}},
          snippet_1: {name: 'foo1', options: {foo: 'bar'}},
          snippet_2: {name: 'foo2', options: {foo: 'bar'}},
          snippet_12: {name: 'bar12', options: {baz: 'pizza'}},
          snippet_6: {name: 'bar6', options: {baz: 'pizza'}},
          snippet_7: {name: 'bar7', options: {baz: 'pizza'}},
          snippet_3: {name: 'foo3', options: {foo: 'bar'}},
          snippet_4: {name: 'foo4', options: {foo: 'bar'}},
          snippet_5: {name: 'foo5', options: {foo: 'bar'}}});

        const ret = window.Mercury.Snippet.create('noobie', {noobie: 'one'});
        return expect(ret.identity).toEqual('snippet_8');
      });
    });
  });

  describe(".find", function() {

    beforeEach(() => window.Mercury.Snippet.create('foo', {foo: 'bar'}));

    it("finds a snippet by identity", () => expect(window.Mercury.Snippet.find('snippet_0').options).toEqual({foo: 'bar'}));

    return it("returns null if no snippet was found", () => expect(window.Mercury.Snippet.find('snippet_x')).toEqual(null));
  });


  return describe(".load", function() {

    beforeEach(function() {
      this.snippets = {
        snippet_1: {name: 'foo', something: {foo: 'bar'}},
        snippet_2: {name: 'bar', something: {baz: 'pizza'}}
      };
      return window.Mercury.Snippet.load(this.snippets);
    });

    it("creates a new instance for each item in the collection", () => expect(window.Mercury.Snippet.all.length).toEqual(2));

    return it('sets the options', () => expect(window.Mercury.Snippet.find('snippet_1').options.something.foo).toEqual('bar'));
  });
});

