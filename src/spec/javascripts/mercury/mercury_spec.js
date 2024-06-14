/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury", function() {

  ({
    afterEach() {
      window.Mercury.config.localization.enabled = false;
      return window.console || (window.console = {});
    }
  });

  describe("supported:", function() {

    // this is here for documentation -- unable to test, because this is evaluated on script load
    it("checks document.getElementById", function() {});
    it("checks document.designMode", function() {});
    return it("disallows konqueror and msie", function() {});
  });


  describe(".on", () => it("binds an event prefixed with 'mercury:' to the top window", function() {
    let callCount = 0;
    window.Mercury.on('test', () => callCount += 1);
    $(top).trigger("mercury:test");
    return expect(callCount).toEqual(1);
  }));


  describe(".trigger", () => it("triggers an event prefixed with 'mercury:' on the top window", function() {
    const argsForCall = [];
    let callCount = 0;
    window.Mercury.on('test', function() { argsForCall[callCount] = arguments; return callCount += 1; });
    window.Mercury.trigger("test", {foo: 'bar'});
    expect(callCount).toEqual(1);
    return expect(argsForCall[0][1]).toEqual({foo: 'bar'});
  }));


  describe(".notify", function() {

    beforeEach(function() {
      this.alertSpy = spyOn(window, 'alert').andCallFake(() => {});
      this.i18nSpy = spyOn(window.Mercury, 'I18n').andCallFake(() => {});
      return window.Mercury.notify('hello world!');
    });

    it("translates the text first by calling window.Mercury.I18n", function() {
      expect(this.i18nSpy.callCount).toEqual(1);
      return expect(this.i18nSpy.argsForCall[0]).toEqual(['hello world!']);
    });

    return it("alerts the message", function() {
      expect(this.alertSpy.callCount).toEqual(1);
      return expect(this.i18nSpy.argsForCall[0]).toEqual(['hello world!']);
    });
  });


  describe(".warn", function() {

    beforeEach(function() {
      if (!window.console.warn) { window.console.warn = () => ''; }
      if (!window.console.trace) { window.console.trace = () => ''; }
      this.warnSpy = spyOn(window.console, 'warn').andCallFake(() => {});
      return this.notifySpy = spyOn(window.Mercury, 'notify').andCallFake(() => {});
    });

    it("calls console.warn", function() {
      window.Mercury.warn('message', 2);
      return expect(this.warnSpy.callCount).toEqual(1);
    });

    return it("calls window.Mercury.notify if there's no console", function() {});
  });
//      original = window.console.debug
//      window.console.debug = null
//      window.Mercury.warn('message', 2)
//      expect(@notifySpy.callCount).toEqual(1)
//      window.console.debug = original



  describe(".log", function() {

    beforeEach(function() {
      if (!window.console.debug) { window.console.debug = function() {}; }
      this.debugSpy = spyOn(window.console, 'debug').andCallFake(() => {});
      return window.Mercury.debug = true;
    });

    it("calls console.debug", function() {
      window.Mercury.log(1, 2);
      return expect(this.debugSpy.callCount).toEqual(1);
    });

    it("does nothing if debug mode isn't on", function() {
      window.Mercury.debug = false;
      window.Mercury.log(1, 2);
      return expect(this.debugSpy.callCount).toEqual(0);
    });

    return it("does nothing if there's no console");
  });
//      original = window.console.debug
//      window.console = null
//      window.Mercury.log(1, 2)
//      expect(@debugSpy.callCount).toEqual(0)


  describe(".locale", function() {

    beforeEach(function() {
      return this.translationSource = (window.Mercury.I18n['en'] = {
        'original-top': 'translated-top',
        _US_: {'original-sub': 'translated-sub'}
      });});

    return it("memoizes array for what the browsers language is set to (breaks with a different language set)", function() {});
  });
//      window.Mercury.config.localization.enabled = true
//      expect(window.Mercury.determinedLocale).toEqual(undefined)
//      expect(window.Mercury.locale()).toEqual({top: @translationSource, sub: @translationSource['_US_']})
//      expect(window.Mercury.determinedLocale).toEqual({top: @translationSource, sub: @translationSource['_US_']})


  return describe(".I18n", function() {

    beforeEach(function() {
      window.Mercury.I18n['foo'] = {
        'originaL': 'translated -- top level',
        'uniquE': 'translated unique',
        'complex %s with %d, and %f': 'translated %s with %d, and %f',
        BAR: {
          'originaL': 'translated -- sub level',
          'unique': 'undesired unique'
        }
      };
      return window.Mercury.determinedLocale = {top: window.Mercury.I18n['foo'], sub: window.Mercury.I18n['foo']['BAR']};});


    it("translates from a top level locale", function() {
      window.Mercury.determinedLocale.sub = {};
      return expect(window.Mercury.I18n('originaL')).toEqual('translated -- top level');
    });

    it("translates from a sub level locale", () => expect(window.Mercury.I18n('originaL')).toEqual('translated -- sub level'));

    it("falls back from a sub level locale", () => expect(window.Mercury.I18n('uniquE')).toEqual('translated unique'));

    it("falls back to no translation", function() {
      window.Mercury.determinedLocale = {top: {}, sub: {}};
      return expect(window.Mercury.I18n('original')).toEqual('original');
    });

    return it("uses printf to get any number of variables into the translation", () => expect(window.Mercury.I18n('complex %s with %d, and %f', 'string', 1, 2.4)).toEqual('translated string with 1, and 2.4'));
  });
});
