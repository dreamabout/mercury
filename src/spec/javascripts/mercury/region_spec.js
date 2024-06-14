/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Region", function() {

  beforeEach(function() {
    fixture.load('mercury/region.html');
    window.Mercury.config.regions.attribute = 'custom-region-attribute';
    return window.Mercury.config.regions.dataAttributes = [];});

  afterEach(function() {
    this.region = null;
    delete(this.region);
    $(window).unbind('mercury:mode');
    $(window).unbind('mercury:focus:frame');
    return $(window).unbind('mercury:action');
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Region.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Region.prototype, 'bindEvents').andCallFake(() => {});
      return this.pushHistorySpy = spyOn(window.Mercury.Region.prototype, 'pushHistory').andCallFake(() => {});
    });

    it("expects an element and window (for context)", function() {
      this.region = new window.Mercury.Region($('#region'), window);
      return expect(this.region.element.get(0)).toEqual($('#region').get(0));
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.region.options).toEqual({foo: 'bar'});
    });

    it("sets variables we need", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      expect(this.region.name).toEqual('region');
      return expect(this.region.history).toBeDefined();
    });

    it("sets name based on configuration", function() {
      window.Mercury.config.regions.identifier = 'data-scope';
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.region.name).toEqual('scope');
    });

    it("calls build", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    it("pushes the initial state to the history buffer", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.pushHistorySpy.callCount).toEqual(1);
    });

    return it("sets the instance of the region into data for the element", function() {
      this.region = new window.Mercury.Region($('#region'), window, {foo: 'bar'});
      return expect(this.region.element.data('region')).toEqual(this.region);
    });
  });


  describe("#build", () => it("does nothing and is there as an interface"));


  describe("#focus", () => it("does nothing and is there as an interface"));


  describe("observed events", function() {

    beforeEach(function() {
      return this.region = new window.Mercury.Region($('#region_with_snippet'), window);
    });

    describe("custom event: mode", () => it("calls togglePreview if the mode is preview", function() {
      const spy = spyOn(window.Mercury.Region.prototype, 'togglePreview').andCallFake(() => {});
      window.Mercury.trigger('mode', {mode: 'foo'});
      expect(spy.callCount).toEqual(0);
      window.Mercury.trigger('mode', {mode: 'preview'});
      return expect(spy.callCount).toEqual(1);
    }));

    describe("custom event: focus:frame", function() {

      beforeEach(function() {
        return this.focusSpy = spyOn(window.Mercury.Region.prototype, 'focus').andCallFake(() => {});
      });

      it("does nothing if in preview mode", function() {
        this.region.previewing = true;
        window.Mercury.trigger('focus:frame', {region: this.region});
        return expect(this.focusSpy.callCount).toEqual(0);
      });

      it("does nothing if it's not active region", function() {
        window.Mercury.region = {};
        window.Mercury.trigger('focus:frame', {region: this.region});
        return expect(this.focusSpy.callCount).toEqual(0);
      });

      return it("calls focus", function() {
        window.Mercury.region = this.region;
        window.Mercury.trigger('focus:frame', {region: this.region});
        return expect(this.focusSpy.callCount).toEqual(1);
      });
    });

    describe("custom event: action", function() {

      beforeEach(function() {
        return this.execCommandSpy = spyOn(window.Mercury.Region.prototype, 'execCommand').andCallFake(() => {});
      });

      it("does nothing if in preview mode", function() {
        this.region.previewing = true;
        window.Mercury.trigger('action', {action: 'foo', value: 'bar'});
        return expect(this.execCommandSpy.callCount).toEqual(0);
      });

      it("does nothing if it's not active region", function() {
        window.Mercury.region = {};
        window.Mercury.trigger('action', {action: 'foo', value: 'bar'});
        return expect(this.execCommandSpy.callCount).toEqual(0);
      });

      return it("calls execCommand with the action and options", function() {
        window.Mercury.region = this.region;
        window.Mercury.trigger('action', {action: 'foo', value: 'bar'});
        expect(this.execCommandSpy.callCount).toEqual(1);
        return expect(this.execCommandSpy.argsForCall[0]).toEqual(['foo', {action: 'foo', value: 'bar'}]);
      });
    });

    describe("mouseover", function() {

      beforeEach(function() {
        return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      });

      it("does nothing if in preview mode", function() {
        this.region.previewing = true;
        jasmine.simulate.mousemove($('#region_with_snippet .example-snippet').get(0));
        return expect(this.triggerSpy.callCount).toEqual(0);
      });

      it("does nothing if it's not the active region", function() {
        window.Mercury.region = {};
        jasmine.simulate.mousemove($('#region_with_snippet .example-snippet').get(0));
        return expect(this.triggerSpy.callCount).toEqual(0);
      });

      return it("shows the snippet toolbar if a snippet was moused over", function() {
        window.Mercury.region = this.region;
        jasmine.simulate.mousemove($('#region_with_snippet .example-snippet').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        return expect(this.triggerSpy.argsForCall[0][0]).toEqual('show:toolbar');
      });
    });

    return describe("mouseout", function() {

      beforeEach(function() {
        return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      });

      it("does nothing if previewing", function() {
        this.region.previewing = true;
        jasmine.simulate.mouseout(this.region.element.get(0));
        return expect(this.triggerSpy.callCount).toEqual(0);
      });

      return it("hides the snippet toolbar", function() {
        jasmine.simulate.mouseout(this.region.element.get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        return expect(this.triggerSpy.argsForCall[0]).toEqual(['hide:toolbar', {type: 'snippet', immediately: false}]);
      });
    });
  });


  describe("#content", function() {

    beforeEach(function() {
      return this.region = new window.Mercury.Region($('#region_with_snippet'), window);
    });

    describe("getting html", function() {

      it("returns the html of the element", function() {
        const content = this.region.content();
        return expect(content).toEqual('contents<div class="example-snippet" data-snippet="snippet_1" data-version="1">snippet</div>');
      });

      it("replaces snippet content with an indentifier if asked", function() {
        const content = this.region.content(null, true);
        return expect(content).toEqual('contents<div class="example-snippet" data-snippet="snippet_1">[snippet_1]</div>');
      });

      return it("does not execute JavaScript contained within the region (bug fix)", function() {
        (new window.Mercury.Region($('#region_with_javascript_snippet'), window)).content();
        return expect($('#modifiable-element').children().length).toEqual(0);
      });
    });

    return describe("setting html", () => it("sets the value of the html", function() {
      this.region.content('new html');
      return expect($('#region_with_snippet').html()).toEqual('new html');
    }));
  });


  describe("#togglePreview", function() {

    beforeEach(function() {
      this.region = new window.Mercury.Region($('#region'), window);
      window.Mercury.region = this.region;
      this.focusSpy = spyOn(window.Mercury.Region.prototype, 'focus').andCallFake(() => {});
      return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    });

    describe("when not previewing", function() {

      beforeEach(function() {
        return this.region.togglePreview();
      });

      it("sets previewing to true", function() {
        return expect(this.region.previewing).toEqual(true);
      });

      it("removes the data attribute", function() {
        return expect(this.region.element.attr('custom-region-attribute')).toEqual(null);
      });

      return it("triggers a blur event", function() {
        expect(this.triggerSpy.callCount).toEqual(1);
        return expect(this.triggerSpy.argsForCall[0]).toEqual(['region:blurred', {region: this.region}]);
      });
    });

    return describe("when previewing", function() {

      beforeEach(function() {
        this.region.previewing = true;
        return this.region.togglePreview();
      });

      it("sets previewing to false", function() {
        return expect(this.region.previewing).toEqual(false);
      });

      it("adds the correct data attribute back", function() {
        return expect(this.region.element.attr('custom-region-attribute')).toEqual('unknown');
      });

      return it("calls focus if it's the active region", function() {
        return expect(this.focusSpy.callCount).toEqual(1);
      });
    });
  });


  describe("#execCommand", function() {

    beforeEach(function() {
      window.Mercury.changes = false;
      return this.region = new window.Mercury.Region($('#region'), window);
    });

    it("calls focus", function() {
      const spy = spyOn(window.Mercury.Region.prototype, 'focus').andCallFake(() => {});
      this.region.execCommand('foo');
      return expect(spy.callCount).toEqual(1);
    });

    it("pushes to the history (unless the action is redo)", function() {
      const spy = spyOn(window.Mercury.Region.prototype, 'pushHistory').andCallFake(() => {});
      this.region.execCommand('redo');
      expect(spy.callCount).toEqual(0);
      this.region.execCommand('foo');
      return expect(spy.callCount).toEqual(1);
    });

    return it("tells window.Mercury that changes have been made", function() {
      this.region.execCommand('foo');
      return expect(window.Mercury.changes).toEqual(true);
    });
  });


  describe("#pushHistory", function() {

    beforeEach(function() {
      window.Mercury.changes = false;
      return this.region = new window.Mercury.Region($('#region'), window);
    });

    return it("pushes the current content (html) of the region to the history buffer", function() {
      const spy = spyOn(this.region.history, 'push').andCallFake(() => {});
      this.region.pushHistory('foo');
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("#snippets", () => it("does nothing and is there as an interface", function() {}));


  describe("#dataAttributes", function() {

    beforeEach(function() {
      window.Mercury.config.regions.dataAttributes = ['scope', 'version'];
      return this.region = new window.Mercury.Region($('#region'), window);
    });

    it("returns an object of data attributes based on configuration", function() {
      this.region.element.attr('data-version', 2);
      return expect(this.region.dataAttributes()).toEqual({scope: 'scope', version: '2'});
    });

    return it("looks to @container if it's set", function() {
      this.region.container = $('<div>').attr('data-version', 3);
      return expect(this.region.dataAttributes()).toEqual({scope: undefined, version: '3'});
    });
  });


  return describe("#serialize", function() {

    beforeEach(function() {
      return this.region = new window.Mercury.Region($('#region'), window);
    });

    describe("without data attributes configured", () => it("returns an object with it's type, value, and snippets", function() {
      const serialized = this.region.serialize();
      expect(serialized.type).toEqual('unknown');
      expect(serialized.value).toEqual('contents');
      expect(serialized.snippets).toEqual({});
      return expect(serialized.data).toEqual({});
    }));

    return describe("with data attributes configured", function() {

      beforeEach(() => window.Mercury.config.regions.dataAttributes = ['scope', 'version']);

      return it("returns an object with it's type, value, data and snippets", function() {
        const serialized = this.region.serialize();
        expect(serialized.type).toEqual('unknown');
        expect(serialized.value).toEqual('contents');
        expect(serialized.snippets).toEqual({});
        return expect(serialized.data).toEqual({scope: 'scope', version: '1'});
      });
    });
  });
});
