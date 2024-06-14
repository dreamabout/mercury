/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.PageEditor", function() {

  beforeEach(function() {
    fixture.load('mercury/page_editor.html');
    return window.Mercury.config.regions.attribute = 'custom-region-attribute';
  });

  afterEach(function() {
    this.pageEditor = null;
    delete(this.pageEditor);
    window.mercuryInstance = null;
    $(window).unbind('mercury:initialize:frame');
    $(window).unbind('mercury:focus:frame');
    $(window).unbind('mercury:focus:window');
    $(window).unbind('mercury:toggle:interface');
    $(window).unbind('mercury:reinitialize');
    $(window).unbind('mercury:mode');
    $(window).unbind('mercury:action');
    $(window).unbind('resize');
    return $(document).unbind('mousedown');
  });

  describe("constructor", function() {

    beforeEach(function() {
      return this.initializeInterfaceSpy = spyOn(window.Mercury.PageEditor.prototype, 'initializeInterface').andCallFake(() => {});
    });

    it("throws an error if it's already instantiated", function() {
      window.mercuryInstance = true;
      expect(() => {
        return new window.Mercury.PageEditor();
      }).toThrow('window.Mercury.PageEditor can only be instantiated once.');
      return window.mercuryInstance = false;
    });

    it("sets the mercuryInstance to window", function() {
      this.pageEditor = new window.Mercury.PageEditor();
      return expect(window.mercuryInstance).toEqual(this.pageEditor);
    });

    it("accepts a saveUrl, and options", function() {
      this.pageEditor = new window.Mercury.PageEditor('/foo/1', {foo: 'bar', saveDataType: 'text'});
      expect(this.pageEditor.saveUrl).toEqual('/foo/1');
      return expect(this.pageEditor.options).toEqual({foo: 'bar', saveDataType: 'text', visible: true});
    });

    it("sets the visible option to true unless it's set", function() {
      this.pageEditor = new window.Mercury.PageEditor('/foo/1', {foo: 'bar', visible: false});
      expect(this.pageEditor.options.visible).toEqual(false);
      window.mercuryInstance = null;
      this.pageEditor = new window.Mercury.PageEditor('/foo/1', {foo: 'bar', visible: true});
      return expect(this.pageEditor.options.visible).toEqual(true);
    });

    it("sets visible based on the options", function() {
      this.pageEditor = new window.Mercury.PageEditor('/foo/1', {foo: 'bar', visible: false});
      expect(this.pageEditor.visible).toEqual(false);
      window.mercuryInstance = null;
      this.pageEditor = new window.Mercury.PageEditor('/foo/1', {foo: 'bar', visible: true});
      return expect(this.pageEditor.visible).toEqual(true);
    });

    it("calls initializeInterface", function() {
      this.pageEditor = new window.Mercury.PageEditor();
      return expect(this.initializeInterfaceSpy.callCount).toEqual(1);
    });

    return it("gets the csrf token if there's one available", function() {
      new window.Mercury.PageEditor();
      return expect(window.Mercury.csrfToken).toBeDefined();
    });
  });


  describe("#initializeInterface", function() {

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      spyOn(window.Mercury, "Toolbar").andReturn({toolbar: true});
      spyOn(window.Mercury, "Statusbar").andReturn({statusbar: true});
      return this.iframeSrcSpy = spyOn(window.Mercury.PageEditor.prototype, 'iframeSrc').andCallFake(() => '/foo');
    });

    it("builds a focusable element (so we can get focus off the iframe)", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return expect($('input.mercury-focusable[type=text]').length).toEqual(1);
    });

    it("builds an iframe, setting id, class and name", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      const iframe = $('iframe.mercury-iframe');
      expect(iframe.length).toEqual(1);
      expect(iframe.attr('name')).toEqual('mercury_iframe');
      return expect(iframe.attr('id')).toEqual('mercury_iframe');
    });

    it("appends the elements to any node", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: $('#page_editor_container')});
      expect($('#page_editor_container input[type=text]').length).toEqual(1);
      return expect($('#page_editor_container iframe.mercury-iframe').length).toEqual(1);
    });

    it("instantiates the toolbar", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return expect(this.pageEditor.toolbar).toEqual({toolbar: true});
    });

    it("instantiates the statusbar", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return expect(this.pageEditor.statusbar).toEqual({statusbar: true});
    });

    it("calls resize", function() {
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return expect(this.resizeSpy.callCount).toEqual(1);
    });

    return it("binds to iframe load event", function() {
      const initializeFrameSpy = spyOn(window.Mercury.PageEditor.prototype, 'initializeFrame');
      const bindEventsSpy = spyOn(window.Mercury.PageEditor.prototype, 'bindEvents');

      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      this.pageEditor.iframe.trigger('load');

      expect(initializeFrameSpy.callCount).toEqual(1);
      return expect(bindEventsSpy.callCount).toEqual(1);
    });
  });


  xdescribe("#initializeFrame", function() {

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.PageEditor.prototype, 'bindEvents').andCallFake(() => {});
      this.initializeRegionsSpy = spyOn(window.Mercury.PageEditor.prototype, 'initializeRegions').andCallFake(() => {});
      this.finalizeInterfaceSpy = spyOn(window.Mercury.PageEditor.prototype, 'finalizeInterface');
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it("does nothing if the iframe is already loaded", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.iframe.data('loaded', true);
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.document).toBeUndefined();
    });

    it("tells the iframe that it's loaded", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.iframe.data('loaded')).toEqual(true);
    });

    it("gets the document from the iframe", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.document).toBeDefined();
    });

    it("injects needed mercury styles", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      const spy = spyOn($.fn, 'appendTo').andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(spy.callCount).toEqual(1);
    });

    it("injects mercury namespace into the iframe", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.iframe.get(0).contentWindow.window.Mercury).toEqual(window.window.Mercury);
    });

    it("provides the iframe with History (history.js)", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      window.History = {Adapter: 'foo'};
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.iframe.get(0).contentWindow.History).toEqual(window.History);
    });

    it("calls resize", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.resizeSpy.callCount).toEqual(2);
    });

    it("calls initializeRegions", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.initializeRegionsSpy.callCount).toEqual(1);
    });

    it("calls finalizeInterface", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.finalizeInterfaceSpy.callCount).toEqual(1);
    });

    it("fires the ready event (window.Mercury.trigger)", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['ready']);
    });

    it("fires the ready event (jQuery.trigger)", function() {
      const mock = {trigger() {}};
      this.pageEditor.iframe.get(0).contentWindow.jQuery = () => mock;
      const spy = spyOn(mock, 'trigger').andCallFake(() => {});
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['mercury:ready']);
    });

    it("fires the ready event (Event.fire)", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      const iframeWindow = this.pageEditor.iframe.get(0).contentWindow;
      iframeWindow.Event = {fire() {}};
      const spy = spyOn(iframeWindow.Event, 'fire').andCallFake(() => {});
      this.pageEditor.initializeFrame();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0][1]).toEqual('mercury:ready');
    });

    it("calls onwindow.MercuryReady in the iframe", function() {
      this.finalizeInterfaceSpy.andCallFake(() => {});
      const iframeWindow = this.pageEditor.iframe.get(0).contentWindow;
      iframeWindow.onwindow.MercuryReady = function() {};
      const spy = spyOn(iframeWindow, 'onwindow.MercuryReady').andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(spy.callCount).toEqual(1);
    });

    it("shows the iframe", function() {
      this.pageEditor.iframe.css({visibility: 'visible'});
      this.finalizeInterfaceSpy.andCallFake(() => {});
      this.pageEditor.initializeFrame();
      return expect(this.pageEditor.iframe.css('visibility')).toEqual('visible');
    });

    return it("captures errors and alerts them", function() {
      this.finalizeInterfaceSpy.andCallFake(() => { throw('unknown error' ); });
      const spy = spyOn(window, 'alert').andCallFake(() => {});
      this.pageEditor.initializeFrame();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['window.Mercury.PageEditor failed to load: unknown error\n\nPlease try refreshing.']);
    });
  });


  xdescribe("#initializeRegions", function() {

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return this.pageEditor.document = $(document);
    });

    it("it calls buildRegion for all the regions found in a document", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'buildRegion').andCallFake(() => {});
      this.pageEditor.initializeRegions();
      return expect(spy.callCount).toEqual(4);
    });

    it("focuses the first region", function() {
      let regionIndex = 0;
      let regionFocusCall = null;
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'buildRegion').andCallFake(function() {
        return this.regions.push({focus() {
          regionIndex += 1;
          return regionFocusCall = regionIndex;
        }
        });
      });
      this.pageEditor.initializeRegions();
      expect(spy.callCount).toEqual(4);
      return expect(regionFocusCall).toEqual(1);
    });

    return it("doesn't focus the first region if it's not supposed to be visible", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'buildRegion').andCallFake(() => {});
      let firstFocusCalled = false;
      this.pageEditor.regions = [{focus: () => { return firstFocusCalled = true; }}, {}, {}];
      this.pageEditor.options.visible = false;
      this.pageEditor.initializeRegions();
      return expect(firstFocusCalled).toEqual(false);
    });
  });


  xdescribe("#buildRegion", function() {
//    it "throws an error if it's not supported", ->
//      window.Mercury.supported = false
//      expect(=>
//                new window.Mercury.PageEditor()
//      ).toThrow('window.Mercury.PageEditor is unsupported in this client. Supported browsers are chrome 10+, firefix 4+, and safari 5+.')
//      window.Mercury.supported = true
//

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      window.Mercury.Regions.Full = () => ({
        region: true
      });
      window.Mercury.Regions.Full.supported = true;
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it("instantiates the region and pushes it into the regions array", function() {
      this.pageEditor.buildRegion($('#region2'));
      expect(this.pageEditor.regions.length).toEqual(1);
      return expect(this.pageEditor.regions[0]).toEqual({region: true});
    });

    it("throws an exception when there's no data-type attribute", function() {
      expect(() => this.pageEditor.buildRegion($('#region4'))).toThrow('Region type is malformed, no data-type provided, or "Unknown" is unknown for the "region4" region.');
      return expect(() => this.pageEditor.buildRegion($('#region4'))).toThrow('Region type is malformed, no data-type provided, or "Unknown" is unknown for the "region4" region.');
    });

    it("throws an exception when the data-type isn't known", function() {
      expect(() => this.pageEditor.buildRegion($('#region4'))).toThrow('Region type is malformed, no data-type provided, or "Unknown" is unknown for the "region4" region.');
      $('#region4').attr('custom-region-attribute', 'foo');
      return expect(() => this.pageEditor.buildRegion($('#region4'))).toThrow('Region type is malformed, no data-type provided, or "Foo" is unknown for the "region4" region.');
    });

    it("doesn't re-instantiate the region if the element's already initialized", function() {
      $('#region2').data('region', {foo: 'bar'});
      this.pageEditor.buildRegion($('#region2'));
      expect(this.pageEditor.regions.length).toEqual(1);
      return expect(this.pageEditor.regions[0]).toEqual({foo: 'bar'});
    });

    it("calls togglePreview on the region if in preview mode", function() {
      let callCount = 0;
      window.Mercury.Regions.Full = () => ({
        region: true,
        togglePreview() { return callCount += 1; }
      });
      window.Mercury.Regions.Full.supported = true;
      this.pageEditor.previewing = true;
      this.pageEditor.buildRegion($('#region2'));
      return expect(callCount).toEqual(1);
    });

    return it("doesn't call togglePreview if not in preview mode", function() {
      let callCount = 0;
      window.Mercury.Regions.Full = () => ({
        region: true,
        togglePreview() { return callCount += 1; }
      });
      window.Mercury.Regions.Full.supported = true;
      this.pageEditor.buildRegion($('#region2'));
      return expect(callCount).toEqual(0);
    });
  });


  xdescribe("#finalizeInterface", function() {

    beforeEach(function() {
      this.resizeSpy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      window.Mercury.SnippetToolbar = () => ({
        snippetToolbar: true
      });
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return this.highjackLinksAndFormsSpy = spyOn(window.Mercury.PageEditor.prototype, 'hijackLinksAndForms').andCallFake(() => {});
    });

    it("injects an sanitizing element used for sanitizing content", function() {
      this.pageEditor.finalizeInterface();
      return expect($('#mercury_sanitizer[contenteditable]').length).toEqual(1);
    });

    it("builds a snippetToolbar", function() {
      this.pageEditor.finalizeInterface();
      return expect(this.pageEditor.snippetToolbar).toEqual({snippetToolbar: true});
    });

    it("calls hijackLinksAndForms", function() {
      this.pageEditor.finalizeInterface();
      return expect(this.highjackLinksAndFormsSpy.callCount).toEqual(1);
    });

    return it("fires a mode event to put things into preview mode if it's not visible yet", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.pageEditor.visible = false;
      this.pageEditor.finalizeInterface();
      return expect(spy.callCount).toEqual(1);
    });
  });


  xdescribe("observed events", function() {

    beforeEach(function() {
      this.initializeInterfaceSpy = spyOn(window.Mercury.PageEditor.prototype, 'initializeInterface').andCallFake(() => {});
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      this.pageEditor.document = $(document);
      this.pageEditor.bindEvents();
      return this.pageEditor.bindDocumentEvents();
    });

    describe("custom event: initialize:frame", () => it("calls initializeFrame", function() {
      this.initializeFrameSpy = spyOn(window.Mercury.PageEditor.prototype, 'initializeFrame').andCallFake(() => {});
      this.setTimeoutSpy = spyOn(window, 'setTimeout').andCallFake((callback, timeout) => callback());
      window.Mercury.trigger('initialize:frame');
      expect(this.initializeFrameSpy.callCount).toEqual(1);
      return expect(this.setTimeoutSpy.callCount).toEqual(1);
    }));

    describe("custom event: focus:frame", () => it("calls focus on the iframe", function() {
      let callCount = 0;
      this.pageEditor.iframe = {focus() { return callCount += 1; }};
      window.Mercury.trigger('focus:frame');
      return expect(callCount).toEqual(1);
    }));

    describe("custom event: focus:window", () => it("calls focus on a focusable element", function() {
      let callCount = 0;
      this.pageEditor.focusableElement = {focus() { return callCount += 1; }};
      this.setTimeoutSpy = spyOn(window, 'setTimeout').andCallFake((callback, timeout) => callback());
      window.Mercury.trigger('focus:window');
      return expect(callCount).toEqual(1);
    }));

    describe("custom event: toggle:interface", () => it("calls toggleInterface", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'toggleInterface').andCallFake(() => {});
      window.Mercury.trigger('toggle:interface');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("custom event: mode", () => it("toggles preview mode if needed", function() {
      window.Mercury.trigger('mode', {mode: 'preview'});
      expect(this.pageEditor.previewing).toEqual(true);
      window.Mercury.trigger('mode', {mode: 'preview'});
      expect(this.pageEditor.previewing).toEqual(false);
      window.Mercury.trigger('mode', {mode: 'foo'});
      return expect(this.pageEditor.previewing).toEqual(false);
    }));

    describe("custom event: reinitialize", () => it("calls initializeRegions", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'initializeRegions').andCallFake(() => {});
      window.Mercury.trigger('reinitialize');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("custom event: action", () => it("calls save if the action was save", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'save').andCallFake(() => {});
      window.Mercury.trigger('action', {action: 'foo'});
      expect(spy.callCount).toEqual(0);

      window.Mercury.trigger('action', {action: 'save'});
      return expect(spy.callCount).toEqual(1);
    }));

    describe("mousedown on document", function() {

      beforeEach(function() {
        return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      });

      it("triggers hide:dialogs", function() {
        window.Mercury.region = {element: $('#region3')};
        jasmine.simulate.mousedown($('#anchor1r').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        return expect(this.triggerSpy.argsForCall[0]).toEqual(['hide:dialogs']);
      });

      return it("triggers unfocus:regions unless the event happened in a region", function() {
        window.Mercury.region = {element: {get() { return null; }}};
        jasmine.simulate.mousedown(document);
        expect(this.triggerSpy.callCount).toEqual(2);
        return expect(this.triggerSpy.argsForCall[1]).toEqual(['unfocus:regions']);
      });
    });

    describe("window resize", () => // untestable
    it("calls resize", function() {}));
        //spy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(=>)
        //resizeTo($(window).width() - 1, $(window).height() - 1)
        //expect(spy.callCount).toEqual(1)

    return describe("onbeforeunload", () => // untestable
    it("calls window.Mercury.beforeUnload", function() {}));
  });
        //spy = spyOn(window.Mercury, 'beforeUnload').andCallFake(=>)
        //window.onbeforeunload()
        //expect(spy.callCount).toEqual(1)


  xdescribe("#toggleInterface", function() {

    beforeEach(function() {
      const spec = this;
      spec.toolbarShowCallCount = 0;
      spec.toolbarHideCallCount = 0;
      spec.statusbarShowCallCount = 0;
      spec.statusbarHideCallCount = 0;
      window.Mercury.Toolbar = () => ({
        toolbar: true,
        height() { return 100; },
        top() { return 0; },
        show: (() => spec.toolbarShowCallCount += 1),
        hide: (() => spec.toolbarHideCallCount += 1)
      });
      window.Mercury.Statusbar = () => ({
        statusbar: true,
        top() { return 500; },
        show: (() => spec.statusbarShowCallCount += 1),
        hide: (() => spec.statusbarHideCallCount += 1)
      });
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it("calls resize", function() {
      const spy = spyOn(window.Mercury.PageEditor.prototype, 'resize').andCallFake(() => {});
      this.pageEditor.toggleInterface();
      return expect(spy.callCount).toEqual(1);
    });

    it("triggers the mode event to toggle preview mode", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.pageEditor.toggleInterface();
      expect(spy.callCount).toEqual(2);
      expect(spy.argsForCall[0]).toEqual(['mode', {mode: 'preview'}]);
      return expect(spy.argsForCall[1]).toEqual(['resize']);
    });

    describe("when visible", function() {

      beforeEach(function() {
        return this.pageEditor.visible = true;
      });

      it("triggers an preview mode event if not currently previewing", function() {
        this.pageEditor.previewing = false;
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        this.pageEditor.toggleInterface();
        expect(spy.callCount).toEqual(2);
        return expect(spy.argsForCall[0]).toEqual(['mode', {mode: 'preview'}]);
      });

      it("sets visible to false", function() {
        this.pageEditor.toggleInterface();
        return expect(this.pageEditor.visible).toEqual(false);
      });

      it("calls hide on the toolbar", function() {
        this.pageEditor.toggleInterface();
        return expect(this.toolbarHideCallCount).toEqual(1);
      });

      return it("calls hide on the statusbar", function() {
        this.pageEditor.toggleInterface();
        return expect(this.statusbarHideCallCount).toEqual(1);
      });
    });

    return describe("when not visible", function() {

      beforeEach(function() {
        return this.pageEditor.visible = false;
      });

      it("sets visible to true", function() {
        this.pageEditor.toggleInterface();
        return expect(this.pageEditor.visible).toEqual(true);
      });

      it("calls show on the toolbar", function() {
        this.pageEditor.toggleInterface();
        return expect(this.toolbarShowCallCount).toEqual(1);
      });

      return it("calls show on the statusbar", function() {
        this.pageEditor.toggleInterface();
        return expect(this.statusbarShowCallCount).toEqual(1);
      });
    });
  });


  xdescribe("#resize", function() {

    beforeEach(function() {
      window.Mercury.Toolbar = () => ({
        toolbar: true,
        height() { return 100; },
        top() { return 50; }
      });
      window.Mercury.Statusbar = () => ({
        statusbar: true,
        top() { return 500; }
      });
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it("sets the display rectangle to displayRect", function() {
      this.pageEditor.resize();
      expect(window.Mercury.displayRect.top).toEqual(100+50);
      return expect(window.Mercury.displayRect.height).toEqual(500 - (100+50));
    });

    it("resizes the iframe", function() {
      this.pageEditor.resize();
      return expect($('.mercury-iframe').css('height')).toEqual(`${500 - (100+50)}px`);
    });

    return it("triggers a resize event", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      this.pageEditor.resize();
      return expect(spy.callCount).toEqual(1);
    });
  });


  xdescribe("#iframeSrc", function() {

    beforeEach(function() {
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      spyOn(Date.prototype, 'getTime').andReturn(1234);
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it("takes the location and removes the /editor", function() {
      return expect(this.pageEditor.iframeSrc('http://foo.com/editor/path')).toEqual('http://foo.com/path');
    });

    it("uses the configured url regex to remove the editor", function() {
      const original = window.Mercury.config.editorUrlRegEx;
      window.Mercury.config.editorUrlRegEx = /([http|https]:\/\/[^\/]*)\/(.*)\/edit\/?/i;
      expect(this.pageEditor.iframeSrc('http://foo.com/path/edit')).toEqual('http://foo.com/path');
      return window.Mercury.config.editorUrlRegEx = original;
    });

    return it("adds query params", function() {
      expect(this.pageEditor.iframeSrc('http://foo.com/editor/path', true)).toEqual('http://foo.com/path?mercury_frame=true&_=1234');
      return expect(this.pageEditor.iframeSrc('http://foo.com/editor/path?something=true', true)).toEqual('http://foo.com/path?something=true&mercury_frame=true&_=1234');
    });
  });


  xdescribe("#loadIframeSrc", function() {

    beforeEach(function() {
      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      return this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
    });

    it('unbinds events to @document', function() {
      this.pageEditor.document = {off() {}};
      const documentSpy = spyOn(this.pageEditor.document, 'off');
      this.pageEditor.loadIframeSrc();
      return expect(documentSpy).toHaveBeenCalled();
    });

    it('resets the iframe loaded data attribute', function() {
      this.pageEditor.iframe.data('loaded', true);
      this.pageEditor.loadIframeSrc();
      return expect(this.pageEditor.iframe.data('loaded')).toEqual(false);
    });

    return it('sets the iframe source', function() {
      const iframe = {contentWindow: {document: {location: {}}}};
      spyOn(Date.prototype, 'getTime').andReturn(1234);
      this.pageEditor.iframe = {data() {}, get() { return iframe; }};
      this.pageEditor.loadIframeSrc('boo');
      return expect(iframe.contentWindow.document.location.href).toEqual('boo?mercury_frame=true&_=1234');
    });
  });



  xdescribe("#hijackLinksAndForms", function() {

    beforeEach(function() {
      window.Mercury.config.nonHijackableClasses = ['lightview'];

      window.Mercury.PageEditor.prototype.initializeFrame = function() {};
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return this.pageEditor.document = $(document);
    });

    afterEach(() => window.Mercury.config.nonHijackableClasses = []);

    it("finds links and forms and sets their target to top if it's not already set", function() {
      this.pageEditor.hijackLinksAndForms();
      expect($('#anchor1').attr('target')).toEqual('_top');
      expect($('#anchor2').attr('target')).toEqual('_blank');
      expect($('#anchor3').attr('target')).toEqual('_parent');
      expect($('#anchor4').attr('target')).toEqual('_parent');
      expect($('#form1').attr('target')).toEqual('_top');
      expect($('#form2').attr('target')).toEqual('_blank');
      expect($('#form3').attr('target')).toEqual('_parent');
      return expect($('#form4').attr('target')).toEqual('_parent');
    });

    it("ignores links in regions", function() {
      this.pageEditor.hijackLinksAndForms();
      expect($('#anchor1r').attr('target')).toEqual('_top');
      expect($('#anchor2r').attr('target')).toEqual('_blank');
      expect($('#anchor3r').attr('target')).toEqual('_self');
      expect($('#anchor4r').attr('target')).toBeUndefined();
      expect($('#form1r').attr('target')).toEqual('_top');
      expect($('#form2r').attr('target')).toEqual('_blank');
      expect($('#form3r').attr('target')).toEqual('_self');
      return expect($('#form4r').attr('target')).toBeUndefined();
    });

    it("ignores links and forms that are in the config to be ignored (by class)", function() {
      this.pageEditor.hijackLinksAndForms();
      expect($('#anchor5').attr('target')).toEqual('_self');
      return expect($('#form5').attr('target')).toEqual('_self');
    });

    return it("doesn't change targets of links and forms that are set to anything besides _self", function() {
      this.pageEditor.hijackLinksAndForms();
      expect($('#anchor6').attr('target')).toEqual('foo');
      return expect($('#form6').attr('target')).toEqual('foo');
    });
  });


  xdescribe("#beforeUnload", function() {

    beforeEach(function() {
      window.Mercury.PageEditor.prototype.initializeInterface = function() {};
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      window.Mercury.silent = false;
      return window.Mercury.changes = true;
    });

    it("returns a message if changes were made", function() {
      expect(this.pageEditor.beforeUnload()).toEqual('You have unsaved changes.  Are you sure you want to leave without saving them first?');

      window.Mercury.changes = false;
      return expect(this.pageEditor.beforeUnload()).toEqual(null);
    });

    return it("does nothing if in silent mode", function() {
      window.Mercury.silent = true;
      return expect(this.pageEditor.beforeUnload()).toEqual(null);
    });
  });


  xdescribe("#getRegionByName", function() {

    beforeEach(function() {
      window.Mercury.PageEditor.prototype.initializeInterface = function() {};
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      this.iframeSrcSpy = spyOn(window.Mercury.PageEditor.prototype, 'iframeSrc').andCallFake(() => '/foo/baz');
      return this.ajaxSpy = spyOn($, 'ajax');
    });

    it("returns the region if a match is found", function() {
      this.pageEditor.regions = [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}];
      expect(this.pageEditor.getRegionByName('foo')).toEqual(this.pageEditor.regions[0]);
      return expect(this.pageEditor.getRegionByName('baz')).toEqual(this.pageEditor.regions[2]);
    });

    return it("returns null if no match was found", function() {
      this.pageEditor.regions = [{name: 'bar'}];
      return expect(this.pageEditor.getRegionByName('foo')).toEqual(null);
    });
  });


  xdescribe("#save", function() {

    describe("POST", function() {
      beforeEach(function() {
        window.Mercury.PageEditor.prototype.initializeInterface = function() {};
        this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el, saveDataType: 'text', saveMethod: 'POST'});
        this.iframeSrcSpy = spyOn(window.Mercury.PageEditor.prototype, 'iframeSrc').andCallFake(() => '/foo/baz');
        return this.ajaxSpy = spyOn($, 'ajax');
      });

      it("doesn't set the _method in the request data", function() {
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[0][1]['data']['_method']).toEqual(undefined);
      });

      it("makes an ajax request", function() {
        this.ajaxSpy.andCallFake(() => {});
        this.pageEditor.save();
        return expect(this.ajaxSpy.callCount).toEqual(1);
      });

      it("uses the save url passed in via options, the configured save url, or the iframe src", function() {
        this.ajaxSpy.andCallFake(() => {});
        this.pageEditor.saveUrl = '/foo/bar';
        this.pageEditor.save();
        expect(this.ajaxSpy.argsForCall[0][0]).toEqual('/foo/bar');

        this.pageEditor.saveUrl = null;
        window.Mercury.saveUrl = '/foo/bit';
        this.pageEditor.save();
        expect(this.ajaxSpy.argsForCall[1][0]).toEqual('/foo/bit');

        this.pageEditor.saveUrl = null;
        window.Mercury.saveUrl = null;
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[2][0]).toEqual('/foo/baz');
      });

      it("serializes the data in json", function() {
        this.ajaxSpy.andCallFake(() => {});
        window.Mercury.config.saveStyle = 'json';
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[0][1]['data']).toEqual('{"content":{"region1":"region1"}}');
      });

      it("can serialize as form values", function() {
        this.ajaxSpy.andCallFake(() => {});
        this.pageEditor.options.saveStyle = 'form';
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[0][1]['data']).toEqual({content: {region1: 'region1'}});
      });

      it("sets headers by calling window.Mercury.ajaxHeaders", function() {
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        spyOn(window.Mercury, 'ajaxHeaders').andCallFake(() => ({'X-CSRFToken': 'f00'}));
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[0][1]['headers']).toEqual({'X-CSRFToken': 'f00'});
      });

      it("sets the data type from options", function() {
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        this.pageEditor.save();
        return expect(this.ajaxSpy.argsForCall[0][1]['dataType']).toEqual('text');
      });

      describe("on successful ajax request", function() {

        beforeEach(function() {
          return this.ajaxSpy.andCallFake((url, options) => options.success('data') );
        });

        it("sets changes back to false", function() {
          window.Mercury.changes = true;
          this.pageEditor.save();
          return expect(window.Mercury.changes).toEqual(false);
        });

        it("calls a callback if one was provided", function() {
          var callback = () => callback.callCount += 1;
          callback.callCount = 0;
          this.pageEditor.save(callback);
          return expect(callback.callCount).toEqual(1);
        });

        return it("fires an event", function() {
          const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
          this.pageEditor.save();
          expect(spy.callCount).toEqual(1);
          return expect(spy.argsForCall[0]).toEqual(['saved', 'data']);
        });
      });

      return describe("on failed ajax request", function() {

        beforeEach(function() {
          return this.ajaxSpy.andCallFake((url, options) => options.error({'response': 'object'}) );
        });

        return it("alerts and triggers save_failed with the url", function() {
          const alert_spy = spyOn(window, 'alert').andCallFake(() => {});
          const trigger_spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});

          this.pageEditor.saveUrl = '/foo/bar';
          this.pageEditor.save();

          expect(alert_spy.callCount).toEqual(1);
          expect(alert_spy.argsForCall[0]).toEqual(['window.Mercury was unable to save to the url: /foo/bar']);

          expect(trigger_spy.callCount).toEqual(1);
          expect(trigger_spy.argsForCall[0][0]).toEqual('save_failed');
          return expect(trigger_spy.argsForCall[0][1]).toBeDefined();
        });
      });
    });

    return describe("PUT", function() {

      beforeEach(function() {
        window.Mercury.PageEditor.prototype.initializeInterface = function() {};
        this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el, saveMethod: 'FOO'});
        this.iframeSrcSpy = spyOn(window.Mercury.PageEditor.prototype, 'iframeSrc').andCallFake(() => '/foo/baz');
        return this.ajaxSpy = spyOn($, 'ajax');
      });

      return it("sets the _method in the request", function() {
        let test;
        this.ajaxSpy.andCallFake(() => {});
        spyOn(window.Mercury.PageEditor.prototype, 'serialize').andCallFake(() => ({region1: 'region1'}));
        this.pageEditor.save();
        return expect(test=this.ajaxSpy.argsForCall[0][1]['data']).toContain('"_method":"PUT"');
      });
    });
  });


  return xdescribe("#serialize", function() {

    beforeEach(function() {
      window.Mercury.PageEditor.prototype.initializeInterface = function() {};
      this.pageEditor = new window.Mercury.PageEditor('', {appendTo: fixture.el});
      return this.pageEditor.regions = [
        {name: 'region1', serialize() { return 'region1'; }},
        {name: 'region2', serialize() { return 'region2'; }}
      ];});

    return it("returns an object with the region name, and it's serialized value", function() {
      const ret = this.pageEditor.serialize();
      return expect(ret).toEqual({region1: 'region1', region2: 'region2'});
    });
  });
});
