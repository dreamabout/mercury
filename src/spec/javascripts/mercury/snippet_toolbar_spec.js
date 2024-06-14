/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.SnippetToolbar", function() {

  beforeEach(function() {
    fixture.load('mercury/snippet_toolbar.html');
    return $.fx.off = true;
  });

  afterEach(function() {
    this.snippetToolbar = null;
    delete(this.snippetToolbar);
    $(window).unbind('mercury:hide:toolbar');
    return $(window).unbind('mercury:show:toolbar');
  });

  describe("constructor", function() {

    beforeEach(function() {
      spyOn(window.Mercury.SnippetToolbar.prototype, 'build').andCallFake(() => {});
      return spyOn(window.Mercury.SnippetToolbar.prototype, 'bindEvents').andCallFake(() => {});
    });

    it("expects document", function() {
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'));
      return expect(this.snippetToolbar.document).toEqual($('document'));
    });

    return it("accepts options", function() {
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'));
      return expect(this.snippetToolbar.document).toEqual($('document'));
    });
  });


  describe("#build", function() {

    it("builds an element", function() {
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el});
      const html = $('<div>').html(this.snippetToolbar.element).html();
      expect(html).toContain('class="mercury-toolbar mercury-snippet-toolbar"');
      return expect(html).toContain('style="display:none"');
    });

    return it("appends to any element", function() {
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: '#snippet_toolbar_container'});
      return expect($('#snippet_toolbar_container .mercury-toolbar').length).toEqual(1);
    });
  });


  describe("observed events", function() {

    beforeEach(function() {
      return this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el});
    });

    describe("custom event: show:toolbar", function() {

      it("does nothing if there's no snippet", function() {
        const spy = spyOn(window.Mercury.SnippetToolbar.prototype, 'show').andCallFake(() => {});
        window.Mercury.trigger('show:toolbar', {snippet: null});
        return expect(spy.callCount).toEqual(0);
      });

      return it("calls show", function() {
        const spy = spyOn(window.Mercury.SnippetToolbar.prototype, 'show').andCallFake(() => {});
        window.Mercury.trigger('show:toolbar', {snippet: $('#snippet')});
        return expect(spy.callCount).toEqual(1);
      });
    });

    describe("custom event: hide:toolbar", function() {

      it("does nothing if it's not for the snippet toolbar", function() {
        const spy = spyOn(window.Mercury.SnippetToolbar.prototype, 'hide').andCallFake(() => {});
        window.Mercury.trigger('hide:toolbar', {type: 'foo'});
        return expect(spy.callCount).toEqual(0);
      });

      return it("calls hide", function() {
        const spy = spyOn(window.Mercury.SnippetToolbar.prototype, 'hide').andCallFake(() => {});
        window.Mercury.trigger('hide:toolbar', {type: 'snippet'});
        return expect(spy.callCount).toEqual(1);
      });
    });

    describe("mousemove", () => it("clears the hide timeout", function() {
      const spy = spyOn(window, 'clearTimeout').andCallFake(() => {});
      jasmine.simulate.mousemove($('.mercury-snippet-toolbar', fixture.el).get(0));
      return expect(spy.callCount).toEqual(1);
    }));

    describe("mouseout", () => it("calls hide", function() {
      const spy = spyOn(window.Mercury.SnippetToolbar.prototype, 'hide').andCallFake(() => {});
      jasmine.simulate.mouseout($('.mercury-snippet-toolbar', fixture.el).get(0));
      return expect(spy.callCount).toEqual(1);
    }));

    return describe("releasing events", function() {

      it('makes the following events releasable', function() {
        const events = ((() => {
          const result = [];
          for (var [target, eventName, handler] of Array.from(this.snippetToolbar._boundEvents)) {             result.push(eventName);
          }
          return result;
        })());
        return expect(events).toEqual(['show:toolbar', 'hide:toolbar', 'scroll']);
      });

      return it('calls off to unbind the events on release', function() {
        let target;
        const targets = ((() => {
          let eventName, handler;
          const result = [];
          for ([target, eventName, handler] of Array.from(this.snippetToolbar._boundEvents)) {             result.push(target);
          }
          return result;
        })());
        // we bind to window.Mercury twice so pop the first one off for spying
        targets.shift();
        const spys = ((() => {
          const result1 = [];
          for (target of Array.from(targets)) {             result1.push(spyOn(target, 'off'));
          }
          return result1;
        })());
        this.snippetToolbar.release();
        return Array.from(spys).map((spy) => expect(spy).toHaveBeenCalled());
      });
    });
  });

  describe("#show", function() {

    beforeEach(function() {
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el});
      this.positionSpy = spyOn(window.Mercury.SnippetToolbar.prototype, 'position').andCallFake(() => {});
      return this.appearSpy = spyOn(window.Mercury.SnippetToolbar.prototype, 'appear').andCallFake(() => {});
    });

    it("expects a snippet", function() {
      this.snippetToolbar.show({snippet: 'foo'});
      return expect(this.snippetToolbar.snippet).toEqual({snippet: 'foo'});
    });

    it("calls position", function() {
      this.snippetToolbar.show();
      return expect(this.positionSpy.callCount).toEqual(1);
    });

    return it("calls appear", function() {
      this.snippetToolbar.show();
      return expect(this.appearSpy.callCount).toEqual(1);
    });
  });


  describe("#position", function() {

    beforeEach(function() {
      window.Mercury.displayRect = {top: 20};
      this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el, visible: true});
      return this.snippetToolbar.snippet = $('#snippet');
    });

    return it("positions itself based on the snippet", function() {
      this.snippetToolbar.element.show();
      this.snippetToolbar.position();
      // use a tolerance since there are measurement differences between browsers we want it between 14-18
      expect(this.snippetToolbar.element.offset().top).toBeLessThan(19);
      expect(this.snippetToolbar.element.offset().top).toBeGreaterThan(0);
      return expect(this.snippetToolbar.element.offset().left).toEqual(200);
    });
  });


  describe("#appear", function() {

    beforeEach(function() {
      return this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el});
    });

    it("clears the hide timeout", function() {
      const spy = spyOn(window, 'clearTimeout').andCallFake(() => {});
      this.snippetToolbar.appear();
      return expect(spy.callCount).toEqual(1);
    });

    it("sets visible", function() {
      this.snippetToolbar.appear();
      return expect(this.snippetToolbar.visible).toEqual(true);
    });

    return it("shows the element", function() {
      this.snippetToolbar.appear();
      return expect(this.snippetToolbar.element.css('display')).toEqual('block');
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      return this.snippetToolbar = new window.Mercury.SnippetToolbar($('document'), {appendTo: fixture.el});
    });

    afterEach(function() { return this.snippetToolbar.release(); });

    it("it clears the hide timeout", function() {
      const spy = spyOn(window, 'clearTimeout').andCallFake(() => {});
      this.snippetToolbar.hide();
      return expect(spy.callCount).toEqual(1);
    });

    describe("immediately", function() {

      beforeEach(function() {
        return this.snippetToolbar.element.show();
      });

      it("hides the element", function() {
        this.snippetToolbar.hide(true);
        return expect(this.snippetToolbar.element.css('display')).toEqual('none');
      });

      return it("sets visible", function() {
        this.snippetToolbar.visible = true;
        this.snippetToolbar.hide(true);
        return expect(this.snippetToolbar.visible).toEqual(false);
      });
    });

    return describe("not immediately", function() {

      beforeEach(function() {
        this.snippetToolbar.element.show();
        return this.setTimeoutSpy = spyOn(window, 'setTimeout');
      });

      it("sets a timeout", function() {
        this.setTimeoutSpy.andCallFake(() => {});
        this.snippetToolbar.hide();
        return expect(this.setTimeoutSpy.callCount).toEqual(1);
      });

      it("hides the element", function() {
        this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
        this.snippetToolbar.hide();
        return expect(this.snippetToolbar.element.css('display')).toEqual('none');
      });

      return it("sets visible", function() {
        this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
        this.snippetToolbar.hide();
        return expect(this.snippetToolbar.visible).toEqual(false);
      });
    });
  });
});

