/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Regions.Snippets", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/snippets.html');
    return this.regionElement = $('#snippets_region1');
  });

  afterEach(function() {
    this.region = null;
    return delete(this.region);
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Regions.Snippets.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Regions.Snippets.prototype, 'bindEvents').andCallFake(() => {});
      return this.makeSortableSpy = spyOn(window.Mercury.Regions.Snippets.prototype, 'makeSortable').andCallFake(() => {});
    });

    it("expects an element and window", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      expect(this.region.element.get(0)).toEqual($('#snippets_region1').get(0));
      return expect(this.region.window).toEqual(window);
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window, {foo: 'something'});
      return expect(this.region.options).toEqual({foo: 'something'});
    });

    it("sets it's type", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return expect(this.region.type()).toEqual('snippets');
    });

    it("calls build", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    return it("makes the snippets sortable", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return expect(this.makeSortableSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    beforeEach(() => spyOn(window.Mercury.Regions.Snippets.prototype, 'bindEvents').andCallFake(() => {}));

    return it("sets the element min-height to 20 if it's min-height is 0 (or not set)", function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return expect($('#snippets_region1').css('minHeight')).toEqual('20px');
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return window.Mercury.region = this.region;
    });

    describe("custom event: unfocus:regions", function() {

      it("removes the focus class", function() {
        this.region.element.addClass('focus');
        window.Mercury.trigger('unfocus:regions');
        return expect(this.region.element.hasClass('focus')).toEqual(false);
      });

      it("destroys the sortable", function() {
        const spy = spyOn($.fn, 'sortable').andCallFake(() => {});
        window.Mercury.trigger('unfocus:regions');
        return expect(spy.argsForCall[0]).toEqual(['destroy']);
      });

      it("triggers the region:blurred event", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallThrough();
        window.Mercury.trigger('unfocus:regions');
        expect(spy.callCount).toEqual(2);
        return expect(spy.argsForCall[1]).toEqual(['region:blurred', {region: this.region}]);
      });

      it("does nothing if previewing", function() {
        this.region.previewing = true;
        this.region.element.addClass('focus');
        window.Mercury.trigger('unfocus:regions');
        return expect(this.region.element.hasClass('focus')).toEqual(true);
      });

      return it("does nothing if it's not the active region", function() {
        window.Mercury.region = null;
        this.region.element.addClass('focus');
        window.Mercury.trigger('unfocus:regions');
        return expect(this.region.element.hasClass('focus')).toEqual(true);
      });
    });

    describe("custom event: focus:window", function() {

      it("removes the focus class", function() {
        this.region.element.addClass('focus');
        window.Mercury.trigger('focus:window');
        return expect(this.region.element.hasClass('focus')).toEqual(false);
      });

      it("destroys the sortable", function() {
        const spy = spyOn($.fn, 'sortable').andCallFake(() => {});
        window.Mercury.trigger('focus:window');
        return expect(spy.argsForCall[0]).toEqual(['destroy']);
      });

      it("triggers the region:blurred event", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallThrough();
        window.Mercury.trigger('focus:window');
        expect(spy.callCount).toEqual(2);
        return expect(spy.argsForCall[1]).toEqual(['region:blurred', {region: this.region}]);
      });

      it("does nothing if previewing", function() {
        this.region.previewing = true;
        this.region.element.addClass('focus');
        window.Mercury.trigger('focus:window');
        return expect(this.region.element.hasClass('focus')).toEqual(true);
      });

      return it("does nothing if it's not the active region", function() {
        window.Mercury.region = null;
        this.region.element.addClass('focus');
        window.Mercury.trigger('focus:window');
        return expect(this.region.element.hasClass('focus')).toEqual(true);
      });
    });

    describe("keydown on document (for undo / redo)", function() {

      it("calls execCommand with undo on meta+z", function() {
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'execCommand');
        jasmine.simulate.keydown(document, {shiftKey: false, metaKey: true, keyCode: 90});
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['undo']);
      });

      it("calls execCommand with redo on shift+meta+z", function() {
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'execCommand');
        jasmine.simulate.keydown(document, {shiftKey: true, metaKey: true, keyCode: 90});
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['redo']);
      });

      it("does nothing if previewing", function() {
        this.region.previewing = true;
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'execCommand');
        jasmine.simulate.keydown(document, {shiftKey: true, metaKey: true, keyCode: 90});
        return expect(spy.callCount).toEqual(0);
      });

      return it("does nothing if it's not the active region", function() {
        window.Mercury.region = null;
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'execCommand');
        jasmine.simulate.keydown(document, {shiftKey: true, metaKey: true, keyCode: 90});
        return expect(spy.callCount).toEqual(0);
      });
    });

    describe("mouseup", function() {

      it("calls focus", function() {
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'focus');
        jasmine.simulate.mouseup(this.region.element.get(0));
        return expect(spy.callCount).toEqual(1);
      });

      it("triggers the region:focused event", function() {
        const spy = spyOn(window.Mercury, 'trigger');
        jasmine.simulate.mouseup(this.region.element.get(0));
        return expect(spy.callCount).toEqual(1);
      });

      return it("does nothing if previewing", function() {
        this.region.previewing = true;
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'focus');
        jasmine.simulate.mouseup(this.region.element.get(0));
        return expect(spy.callCount).toEqual(0);
      });
    });

    describe("dragover", function() {

      // untestable
      it("prevents the default event", function() {});
      return it("does nothing if previewing", function() {});
    });

    return describe("drop", function() {

      // untestable
      it("calls focus", function() {});
      it("prevents the default event", function() {});
      it("displays the options for the snippet that was dropped", function() {});
      it("does nothing if previewing", function() {});
      return it("does nothing if there's no active snippet", function() {});
    });
  });


  describe("#focus", function() {

    beforeEach(function() {
      return this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
    });

    it("sets the active mercury region", function() {
      window.Mercury.region = null;
      this.region.focus();
      return expect(window.Mercury.region).toEqual(this.region);
    });

    it("makes the snippets sortable again", function() {
      const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'makeSortable');
      this.region.focus();
      return expect(spy.callCount).toEqual(1);
    });

    return it("adds the focus class to the element", function() {
      this.region.focus();
      return expect($('#snippets_region1').hasClass('focus')).toEqual(true);
    });
  });


  describe("#togglePreview", function() {

    beforeEach(function() {
      return this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
    });

    describe("when not previewing", function() {

      it("it destroys the sortable", function() {
        const spy = spyOn($.fn, 'sortable').andCallFake(() => {});
        this.region.togglePreview();
        expect(spy.callCount).toEqual(1);
        return expect(spy.argsForCall[0]).toEqual(['destroy']);
      });

      return it("removes the focus class", function() {
        this.regionElement.addClass('focus');
        this.region.togglePreview();
        return expect($('#snippets_region1').hasClass('focus')).toEqual(false);
      });
    });

    return describe("when previewing", function() {

      beforeEach(function() {
        return this.region.previewing = true;
      });

      return it("makes the snippets sortable again", function() {
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'makeSortable');
        this.region.togglePreview();
        return expect(spy.callCount).toEqual(1);
      });
    });
  });


  describe("#execCommand", function() {

    beforeEach(function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      window.Mercury.Regions.Snippets.actions['foo'] = function() {};
      return this.handlerSpy = spyOn(window.Mercury.Regions.Snippets.actions, 'foo');
    });

    return it("calls a handler (from the actions) if one exists", function() {
      this.region.execCommand('foo', {value: 'something'});
      expect(this.handlerSpy.callCount).toEqual(1);
      return expect(this.handlerSpy.argsForCall[0]).toEqual([{value: 'something'}]);
    });
  });


  return describe("#makeSortable", function() {

    beforeEach(function() {
      this.region = new window.Mercury.Regions.Snippets(this.regionElement, window);
      return this.sortableSpy = spyOn($.fn, 'sortable');
    });

    it("makes the snippets sortable", function() {
      this.sortableSpy.andCallFake(arg => { if (arg === 'destroy') { return this.region.element; }  });
      this.region.makeSortable();
      expect(this.sortableSpy.callCount).toEqual(2);
      expect(this.sortableSpy.argsForCall[0]).toEqual(['destroy']);
      return expect(this.sortableSpy.argsForCall[1][0]['document']).toEqual(this.region.document);
    });

    it("triggers the hide:toolbar event at the end of the dragging", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.sortableSpy.andCallFake(arg => { if (arg === 'destroy') { return this.region.element; } else { return arg.beforeStop(); } });
      this.region.makeSortable();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['hide:toolbar', {type: 'snippet', immediately: true}]);
    });

    return it("pushes to the history after dragging", function() {
      const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'pushHistory').andCallFake(() => {});
      spyOn(window, 'setTimeout').andCallFake((callback, timeout)=> callback());
      this.sortableSpy.andCallFake(arg => { if (arg === 'destroy') { return this.region.element; } else { return arg.stop(); } });
      this.region.makeSortable();
      return expect(spy.callCount).toEqual(1);
    });
  });
});



describe("window.Mercury.Regions.Snippets.actions", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/snippets.html');
    this.region = new window.Mercury.Regions.Snippets($('#snippets_region2'), window);
    return this.actions = window.Mercury.Regions.Snippets.actions;
  });

  describe(".undo", () => it("calls undo on the history buffer and sets the content", function() {
    const htmlSpy = spyOn(window.Mercury.Regions.Snippets.prototype, 'content').andCallFake(() => {});
    const historySpy = spyOn(this.region.history, 'undo').andCallFake(() => 'history -1');
    this.actions['undo'].call(this.region);
    expect(historySpy.callCount).toEqual(1);
    expect(htmlSpy.callCount).toEqual(1);
    return expect(htmlSpy.argsForCall[0]).toEqual(['history -1']);
  }));


  describe(".redo", () => it("calls redo on the history buffer and sets the content", function() {
    const htmlSpy = spyOn(window.Mercury.Regions.Snippets.prototype, 'content').andCallFake(() => {});
    const historySpy = spyOn(this.region.history, 'redo').andCallFake(() => 'history +1');
    this.actions['redo'].call(this.region);
    expect(historySpy.callCount).toEqual(1);
    expect(htmlSpy.callCount).toEqual(1);
    return expect(htmlSpy.argsForCall[0]).toEqual(['history +1']);
  }));


  describe(".insertSnippet", function() {

    beforeEach(function() {
      window.Mercury.Snippet.all = [];
      window.Mercury.Snippet.load({
        'snippet_1': {name: 'example', options: {'foo': 'bar'}},
        'snippet_2': {name: 'example', options: {'foo': 'bar'}},
      });
      return spyOn(window.Mercury.Snippet.prototype, 'loadPreview').andCallFake(() => {});
    });

    describe("updating a snippet", function() {

      it("finds the snippet by it's identity and replaces it with the new snippet", function() {
        this.actions['insertSnippet'].call(this.region, {value: window.Mercury.Snippet.find('snippet_1')});
        expect($('#snippets_region2').html()).toContain('class="example-snippet"');
        expect($('#snippets_region2').html()).toContain('contenteditable="false"');
        expect($('#snippets_region2').html()).toContain('data-version="1"');
        expect($('#snippets_region2').html()).toContain('data-snippet="snippet_1"');
        return expect($('#snippets_region2').html()).toContain('[snippet_1]');
      });

      return it("pushes to the history after it's been rendered", function() {
        spyOn(window.Mercury.Snippet.prototype, 'getHTML').andCallFake((x, callback) => { if (callback) { return callback(); } });
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'pushHistory').andCallFake(() => {});
        this.actions['insertSnippet'].call(this.region, {value: window.Mercury.Snippet.find('snippet_1')});
        return expect(spy.callCount).toEqual(1);
      });
    });

    return describe("inserting a snippet", function() {

      it("appends the new snippet html to the element", function() {
        this.actions['insertSnippet'].call(this.region, {value: window.Mercury.Snippet.find('snippet_2')});
        return expect($('#snippets_region2 [data-snippet]').length).toEqual(2);
      });

      return it("pushes to the history after it's been rendered", function() {
        spyOn(window.Mercury.Snippet.prototype, 'getHTML').andCallFake((x, callback) => { if (callback) { return callback(); } });
        const spy = spyOn(window.Mercury.Regions.Snippets.prototype, 'pushHistory').andCallFake(() => {});
        this.actions['insertSnippet'].call(this.region, {value: window.Mercury.Snippet.find('snippet_2')});
        return expect(spy.callCount).toEqual(1);
      });
    });
  });


  describe(".editSnippet", function() {

    beforeEach(function() {
      return this.region.snippet = $('#snippets_region2 [data-snippet]');
    });

    it("finds and displays the options for the given snippet", function() {
      const spy = spyOn(window.Mercury.Snippet.prototype, 'displayOptions');
      this.actions['editSnippet'].call(this.region);
      return expect(spy.callCount).toEqual(1);
    });

    return it("does nothing if there's no active snippet (eg. hovered over)", function() {
      this.region.snippet = null;
      const spy = spyOn(window.Mercury.Snippet.prototype, 'displayOptions');
      this.actions['editSnippet'].call(this.region);
      return expect(spy.callCount).toEqual(0);
    });
  });


  return describe(".removeSnippet", function() {

    beforeEach(function() {
      return this.region.snippet = $('#snippets_region2 .mercury-snippet');
    });

    it("removes the snippet if there's an active one", function() {
      this.actions['removeSnippet'].call(this.region);
      return expect($('#snippets_region2 .mercury-snippet').length).toEqual(0);
    });

    return it("triggers the hide:toolbar event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.actions['removeSnippet'].call(this.region);
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['hide:toolbar', {type: 'snippet', immediately: true}]);
    });
  });
});
