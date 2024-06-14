/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Toolbar.Button", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.button.html');
    window.Mercury.displayRect = {top: 0, left: 0, width: 500, height: 200};
    window.Mercury.Toolbar.Button.contexts.foo = () => true;
    this.region = {
      type() { return 'full'; },
      element: $('<div>'),
      currentElement() { return $('<div>'); }
    };
    return window.Mercury.preloadedViews['/nothing'] = 'nothing';
  });

  afterEach(function() {
    this.button = null;
    delete(this.button);
    $(document).unbind('mercury:region:update');
    return $(document).unbind('mercury:button');
  });

  describe("constructor", function() {

    it("expects name and title values", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');
      const html = $('<div>').html(this.button).html();
      expect(html).toContain('title="title"');
      expect(html).toContain('class="mercury-button mercury-foo-button"');
      return expect(html).toContain('<em>title</em>');
    });

    it("accepts summary, types and options", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {palette: '/nothing'}, {appendDialogsTo: fixture.el});
      const html = $('<div>').html(this.button).html();
      expect(html).toContain('title="summary"');
      expect(html).toContain('class="mercury-button mercury-foo-button mercury-button-palette"');
      return expect(html).toContain('<em>title</em>');
    });

    it("calls build", function() {
      const spy = spyOn(window.Mercury.Toolbar.Button.prototype, 'build').andCallFake(() => {});
      spyOn(window.Mercury.Toolbar.Button.prototype, 'bindEvents').andCallFake(() => {});
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');
      return expect(spy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      spyOn(window.Mercury.Toolbar.Button.prototype, 'build').andCallFake(() => {});
      const spy = spyOn(window.Mercury.Toolbar.Button.prototype, 'bindEvents').andCallFake(() => {});
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("#build for various button types", function() {

    it("attaches an element meant for the expander in button data", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');
      return expect(this.button.data('expander')).toEqual('<div class="mercury-expander-button" data-button="foo"><em></em><span>title</span></div>');
    });

    it("builds toggle buttons, that when clicked toggle their state", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {toggle: true});

      jasmine.simulate.click(this.button.get(0));
      expect(this.button.hasClass('pressed')).toEqual(true);

      jasmine.simulate.click(this.button.get(0));
      return expect(this.button.hasClass('pressed')).toEqual(false);
    });

    it("builds mode buttons, that when clicked fire a mode event", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {mode: true});
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});

      jasmine.simulate.click(this.button.get(0));
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['mode', {mode: 'foo'}]);
    });

    it("builds buttons that understand context", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true}, {appendDialogsTo: fixture.el});

      expect(this.button.hasClass('active')).toEqual(false);
      window.Mercury.trigger('region:update', {region: this.region});
      return expect(this.button.hasClass('active')).toEqual(true);
    });

    it("builds panel buttons (and assigns toggle)", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {panel: '/blank.html'}, {appendDialogsTo: fixture.el});
      expect($('.mercury-panel', fixture.el).length).toEqual(1);

      jasmine.simulate.click(this.button.get(0));
      expect(this.button.hasClass('pressed')).toEqual(true);

      jasmine.simulate.click(this.button.get(0));
      return expect(this.button.hasClass('pressed')).toEqual(false);
    });

    it("builds a panel button with a custom panel object", function() {
      const namespace = {};
      namespace.customPanel = function() {};
      namespace.customPanel.prototype.toggle = () => 'toggled';
      const handler = name => new namespace.customPanel();

      const constructorSpy = spyOn(namespace, 'customPanel').andCallThrough();
      const panelSpy = spyOn(window.Mercury, 'Panel');

      this.button = new window.Mercury.Toolbar.Button('customFoo', 'title', 'summary', {panel: handler}, {appendDialogsTo: fixture.el});
      expect(constructorSpy).toHaveBeenCalled();
      return expect(panelSpy).wasNotCalled();
    });


    it("builds palette buttons", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {palette: '/blank.html'}, {appendDialogsTo: fixture.el});
      return expect($('.mercury-palette', fixture.el).length).toEqual(1);
    });

    it("builds select buttons", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {select: '/blank.html'}, {appendDialogsTo: fixture.el});
      return expect($('.mercury-select', fixture.el).length).toEqual(1);
    });

    it("builds modal buttons", function() {
      return this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {modal: '/blank.html'}, {appendDialogsTo: fixture.el});
    });
      // nothing unique about this in building -- the modal is built/fired on click

    it("builds lightview buttons", function() {
      return this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {lightview: '/blank.html'}, {appendDialogsTo: fixture.el});
    });
      // nothing unique about this in building -- the lightview is built/fired on click

    return it("throws an error when an unknown type is encountered", function() {
      return expect(() => {
        return this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {foo: '/blank.html'});
      }).toThrow('Unknown button type "foo" used for the "foo" button.');
    });
  });


  return describe("observed events", function() {

    describe("custom event: button", () => it("calls click on the button itself")); //, ->
//        todo: ! bleed over -- elements remain
//        @button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true})
//        spy = spyOn(@button, 'click').andCallFake(=>)
//
//        window.Mercury.trigger('button', {action: 'foo'})
//        expect(spy.callCount).toEqual(1)

    describe("custom event: mode", () => it("toggles a button when that mode is triggered and the button is toggleable", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {mode: 'preview', toggle: true});
      const spy = spyOn(window.Mercury.Toolbar.Button.prototype, 'togglePressed').andCallFake(() => {});

      window.Mercury.trigger('mode', {mode: 'preview'});
      return expect(spy.callCount).toEqual(1);
    }));

    describe("custom event: region:update", () => it("calls contexts if one is available and set", function() {
      const contextSpy = spyOn(window.Mercury.Toolbar.Button.contexts, 'foo').andCallFake(() => true);
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true});

      expect(this.button.hasClass('active')).toEqual(false);

      window.Mercury.trigger('region:update', {region: this.region});
      expect(contextSpy.callCount).toEqual(1);
      return expect(this.button.hasClass('active')).toEqual(true);
    }));

    describe("custom event: region:focused", function() {

      it("disables if the region type isn't supported", function() {
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true, regions: ['foo']});
        this.button.removeClass('disabled');
        window.Mercury.trigger('region:focused', {region: this.region});
        return expect(this.button.hasClass('disabled')).toEqual(true);
      });

      return it("enables if the region type is supported", function() {
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true, regions: ['full']});
        this.button.addClass('disabled');
        window.Mercury.trigger('region:focused', {region: this.region});
        return expect(this.button.hasClass('disabled')).toEqual(false);
      });
    });

    describe("custom event: region:blurred", () => it("disables if it's a button for specific region types", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {context: true, regions: ['full']});
      this.button.addClass('disabled');
      window.Mercury.trigger('region:blurred', {region: this.region});
      return expect(this.button.hasClass('disabled')).toEqual(true);
    }));

    describe("mousedown", () => it("sets the active state", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');

      expect(this.button.hasClass('active')).toEqual(false);
      jasmine.simulate.mousedown(this.button.get(0));
      return expect(this.button.hasClass('active')).toEqual(true);
    }));

    describe("mouseup", () => it("removes the active state", function() {
      this.button = new window.Mercury.Toolbar.Button('foo', 'title');
      this.button.addClass('active');

      jasmine.simulate.mouseup(this.button.get(0));
      return expect(this.button.hasClass('active')).toEqual(false);
    }));

    describe("click for various button types", function() {

      it("does nothing if the button is disabled", function() {
        const spy = spyOn(window.Mercury.Toolbar.Button.prototype, 'togglePressed').andCallThrough();
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {toggle: true});

        jasmine.simulate.click(this.button.get(0));
        expect(spy.callCount).toEqual(1);

        this.button.addClass('disabled');
        jasmine.simulate.click(this.button.get(0));
        return expect(spy.callCount).toEqual(1);
      });

      it("triggers an action event", function() {
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary');
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.argsForCall[0]).toEqual(['action', {action: 'foo'}]);
      });

      it("triggers a focus:frame event", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {}, {regions: ['full']});

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.argsForCall[1]).toEqual(['focus:frame']);
      });

      it("toggles toggle button pressed state", function() {
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {toggle: true});

        jasmine.simulate.click(this.button.get(0));
        expect(this.button.hasClass('pressed')).toEqual(true);

        jasmine.simulate.click(this.button.get(0));
        return expect(this.button.hasClass('pressed')).toEqual(false);
      });

      it("triggers a mode event", function() {
        const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {mode: true});

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.argsForCall[0]).toEqual(['mode', {mode: 'foo'}]);
      });

      it("opens a modal window", function() {
        const spy = spyOn(window.Mercury, 'modal').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {modal: '/blank.html'});

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.argsForCall[0]).toEqual(['/blank.html', {title: 'summary', handler: 'foo'}]);
      });

      it("opens a lightview window", function() {
        const spy = spyOn(window.Mercury, 'lightview').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {lightview: '/blank.html'});

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.argsForCall[0]).toEqual(['/blank.html', {title: 'summary', handler: 'foo', closeButton: true}]);
      });

      it("shows and hides palettes", function() {
        const spy = spyOn(window.Mercury.Palette.prototype, 'toggle').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {palette: '/blank.html'});

        jasmine.simulate.click(this.button.get(0));
        expect(spy.callCount).toEqual(1);

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.callCount).toEqual(2);
      });

      it("shows and hides selects", function() {
        const spy = spyOn(window.Mercury.Select.prototype, 'toggle').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {select: '/blank.html'});

        jasmine.simulate.click(this.button.get(0));
        expect(spy.callCount).toEqual(1);

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.callCount).toEqual(2);
      });

      return it("shows and hides panels, and toggles the button pressed state", function() {
        const spy = spyOn(window.Mercury.Panel.prototype, 'toggle').andCallFake(() => {});
        this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {panel: '/blank.html'});

        jasmine.simulate.click(this.button.get(0));
        expect(spy.callCount).toEqual(1);

        jasmine.simulate.click(this.button.get(0));
        return expect(spy.callCount).toEqual(2);
      });
    });

    return it("shows and hides the custom panel", function() {
      const namespace = {};
      namespace.customPanel = function() {};
      namespace.customPanel.prototype.toggle = () => 'toggled';
      const handler = name => new namespace.customPanel();

      const toggleSpy = spyOn(namespace.customPanel.prototype, 'toggle');
      this.button = new window.Mercury.Toolbar.Button('foo', 'title', 'summary', {panel: handler}, {appendDialogsTo: fixture.el});

      jasmine.simulate.click(this.button.get(0));
      return expect(toggleSpy).toHaveBeenCalled();
    });
  });
});


describe("window.Mercury.Toolbar.Button.contexts", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.button.html');
    this.contexts = window.Mercury.Toolbar.Button.contexts;
    this.region = $('#context_container');
    return this.element = $('#context_button');
  });

  it("handles background color", function() {
    this.contexts.backColor.call(this, $('#context_backcolor'), this.region);
    expect(this.element.css('background-color')).toEqual('rgb(255, 0, 0)');

    this.contexts.backColor.call(this, $('#context_none'), this.region);
    if ($.browser.mozilla) {
      return expect(this.element.css('background-color')).toEqual('transparent');
    } else {
      return expect(this.element.css('background-color')).toEqual('rgba(0, 0, 0, 0)');
    }
  });

  it("handles foreground color", function() {
    this.contexts.foreColor.call(this, $('#context_forecolor'), this.region);
    expect(this.element.css('background-color')).toEqual('rgb(0, 255, 0)');

    this.contexts.foreColor.call(this, $('#context_none'), this.region);
    return expect(this.element.css('background-color')).toEqual('rgb(0, 0, 0)');
  });

  it("knows when something is bold", function() {
    expect(this.contexts.bold.call(this, $('#context_bold1 span'), this.region)).toEqual(true);
    expect(this.contexts.bold.call(this, $('#context_bold2 span'), this.region)).toEqual(true);
    expect(this.contexts.bold.call(this, $('#context_bold3 span'), this.region)).toEqual(true);
    expect(this.contexts.bold.call(this, $('#context_bold4 span'), this.region)).toEqual(true);
    expect(this.contexts.bold.call(this, $('#context_bold5 span'), this.region)).toEqual(false);
    expect(this.contexts.bold.call(this, $('#context_bold6 span'), this.region)).toEqual(true);
    return expect(this.contexts.bold.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is italic", function() {
    expect(this.contexts.italic.call(this, $('#context_italic1 span'), this.region)).toEqual(true);
    expect(this.contexts.italic.call(this, $('#context_italic2 span'), this.region)).toEqual(true);
    return expect(this.contexts.italic.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is overlined", function() {
    expect(this.contexts.overline.call(this, $('#context_overline'), this.region)).toEqual(true);
    return expect(this.contexts.overline.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is striked through", function() {
    expect(this.contexts.strikethrough.call(this, $('#context_strikethrough1 span'), this.region)).toEqual(true);
    expect(this.contexts.strikethrough.call(this, $('#context_strikethrough2'), this.region)).toEqual(true);
    return expect(this.contexts.strikethrough.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is underlined", function() {
    expect(this.contexts.underline.call(this, $('#context_underline1 span'), this.region)).toEqual(true);
    expect(this.contexts.underline.call(this, $('#context_underline2'), this.region)).toEqual(true);
    return expect(this.contexts.underline.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is subscript", function() {
    expect(this.contexts.subscript.call(this, $('#context_subscript span'), this.region)).toEqual(true);
    return expect(this.contexts.subscript.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is superscript", function() {
    expect(this.contexts.superscript.call(this, $('#context_superscript span'), this.region)).toEqual(true);
    return expect(this.contexts.superscript.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is justified left", function() {
    expect(this.contexts.justifyLeft.call(this, $('#context_justifyLeft span'), this.region)).toEqual(true);
    return expect(this.contexts.justifyLeft.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is justified center", function() {
    expect(this.contexts.justifyCenter.call(this, $('#context_justifyCenter span'), this.region)).toEqual(true);
    return expect(this.contexts.justifyCenter.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is justified right", function() {
    expect(this.contexts.justifyRight.call(this, $('#context_justifyRight span'), this.region)).toEqual(true);
    return expect(this.contexts.justifyRight.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is justified fully", function() {
    expect(this.contexts.justifyFull.call(this, $('#context_justifyFull span'), this.region)).toEqual(true);
    return expect(this.contexts.justifyFull.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  it("knows when something is inside an ordered list", function() {
    expect(this.contexts.insertOrderedList.call(this, $('#context_orderedlist span'), this.region)).toEqual(true);
    return expect(this.contexts.insertOrderedList.call(this, $('#context_none'), this.region)).toEqual(false);
  });

  return it("knows when something is inside an unordered list", function() {
    expect(this.contexts.insertUnorderedList.call(this, $('#context_unorderedlist span'), this.region)).toEqual(true);
    return expect(this.contexts.insertUnorderedList.call(this, $('#context_none'), this.region)).toEqual(false);
  });
});

// todo: fix in jquery
//  it "understands nested text-decoration styles", ->
//    expect(@contexts.underline.call(@, $('#context_decoration'), @region)).toEqual(true)
