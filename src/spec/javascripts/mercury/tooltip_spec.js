/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.tooltip", function() {

  beforeEach(function() {
    fixture.load('mercury/tooltip.html');
    this.forElement = $('#for_element');
    return $.fx.off = true;
  });

  afterEach(function() {
    window.Mercury.tooltip.visible = false;
    return window.Mercury.tooltip.initialized = false;
  });

  describe("singleton method", function() {

    beforeEach(function() {
      return this.showSpy = spyOn(window.Mercury.tooltip, 'show').andCallFake(() => {});
    });

    it("calls show", function() {
      window.Mercury.tooltip();
      return expect(this.showSpy.callCount).toEqual(1);
    });

    return it("returns the function object", function() {
      const ret = window.Mercury.tooltip();
      return expect(ret).toEqual(window.Mercury.tooltip);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      this.initializeSpy = spyOn(window.Mercury.tooltip, 'initialize').andCallFake(() => {});
      this.updateSpy = spyOn(window.Mercury.tooltip, 'update').andCallFake(() => {});
      return this.appearSpy = spyOn(window.Mercury.tooltip, 'appear').andCallFake(() => {});
    });

    it("gets the document from the element passed in", function() {
      window.Mercury.tooltip.show(this.forElement, 'content');
      return expect(window.Mercury.tooltip.document).toEqual(document);
    });

    it("calls initialize", function() {
      window.Mercury.tooltip.show(this.forElement, 'content');
      return expect(this.initializeSpy.callCount).toEqual(1);
    });

    describe("if visible", function() {

      beforeEach(() => window.Mercury.tooltip.visible = true);

      return it("calls update", function() {
        window.Mercury.tooltip.show(this.forElement, 'content');
        return expect(this.updateSpy.callCount).toEqual(1);
      });
    });

    return describe("if not visible", function() {

      beforeEach(() => window.Mercury.tooltip.visible = false);

      return it("calls appear", function() {
        window.Mercury.tooltip.show(this.forElement, 'content');
        return expect(this.appearSpy.callCount).toEqual(1);
      });
    });
  });


  describe("#initialize", function() {

    it("calls build", function() {
      const spy = spyOn(window.Mercury.tooltip, 'build').andCallFake(() => {});
      spyOn(window.Mercury.tooltip, 'bindEvents').andCallFake(() => {});
      window.Mercury.tooltip.initialize();
      return expect(spy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      const spy = spyOn(window.Mercury.tooltip, 'bindEvents').andCallFake(() => {});
      window.Mercury.tooltip.initialize();
      return expect(spy.callCount).toEqual(1);
    });

    it("sets initialized to true", function() {
      window.Mercury.tooltip.initialize();
      return expect(window.Mercury.tooltip.initialized).toEqual(true);
    });

    return it("does nothing if already initialized", function() {
      const spy = spyOn(window.Mercury.tooltip, 'bindEvents').andCallFake(() => {});
      window.Mercury.tooltip.initialized = true;
      window.Mercury.tooltip.initialize();
      return expect(spy.callCount).toEqual(0);
    });
  });


  describe("#build", function() {

    it("builds an element", function() {
      window.Mercury.tooltip.build();
      const html = $('<div>').html(window.Mercury.tooltip.element).html();
      return expect(html).toContain('class="mercury-tooltip"');
    });

    return it("can append to any element", function() {
      window.Mercury.tooltip.options = {appendTo: '#tooltip_container'};
      window.Mercury.tooltip.build();
      return expect($('#tooltip_container').html()).toContain('class="mercury-tooltip"');
    });
  });


  describe("observed events", function() {

    describe("custom event: resize", () => it("call position if visible", function() {
      window.Mercury.tooltip.visible = true;
      const spy = spyOn(window.Mercury.tooltip, 'position').andCallFake(() => {});
      window.Mercury.trigger('resize');
      expect(spy.callCount).toEqual(1);

      window.Mercury.tooltip.visible = false;
      window.Mercury.trigger('resize');
      return expect(spy.callCount).toEqual(1);
    }));

    describe("document scrolling", () => // untestable
    it("calls position if visible", function() {}));

    return describe("element mousedown", () => // untestable
    it("stops the event", function() {}));
  });


  describe("#appear", function() {

    beforeEach(function() {
      window.Mercury.tooltip.build();
      return this.updateSpy = spyOn(window.Mercury.tooltip, 'update').andCallFake(() => {});
    });

    it("calls update", function() {
      window.Mercury.tooltip.appear();
      return expect(this.updateSpy.callCount).toEqual(1);
    });

    it("shows the element", function() {
      window.Mercury.tooltip.appear();
      expect(window.Mercury.tooltip.element.css('display')).toEqual('block');
      return expect(window.Mercury.tooltip.element.css('opacity')).toEqual('1');
    });

    return it("sets visible to true", function() {
      window.Mercury.tooltip.visible = false;
      window.Mercury.tooltip.appear();
      return expect(window.Mercury.tooltip.visible).toEqual(true);
    });
  });


  describe("#update", function() {

    beforeEach(function() {
      window.Mercury.tooltip.build();
      return this.positionSpy = spyOn(window.Mercury.tooltip, 'position').andCallFake(() => {});
    });

    it("sets the html", function() {
      window.Mercury.tooltip.content = 'foo';
      window.Mercury.tooltip.update();
      return expect(window.Mercury.tooltip.element.html()).toEqual('foo');
    });

    return it("calls position", function() {
      window.Mercury.tooltip.update();
      return expect(this.positionSpy.callCount).toEqual(1);
    });
  });


  describe("#position", function() {

    beforeEach(function() {
      window.Mercury.tooltip.build();
      return window.Mercury.displayRect = {top: 0, left: 0, width: 200, height: 200};});

    return it("positions based on the element we're showing for", function() {
      window.Mercury.tooltip.forElement = this.forElement;
      window.Mercury.tooltip.position();
      return expect(window.Mercury.tooltip.element.offset()).toEqual({top: 20 + this.forElement.outerHeight(), left: 42});
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      window.Mercury.tooltip.build();
      return window.Mercury.tooltip.initialized = true;
    });

    it("hides the element", function() {
      window.Mercury.tooltip.element.css({display: 'block'});
      window.Mercury.tooltip.hide();
      return expect(window.Mercury.tooltip.element.css('display')).toEqual('none');
    });

    return it("sets visible to false", function() {
      window.Mercury.tooltip.visible = true;
      window.Mercury.tooltip.hide();
      return expect(window.Mercury.tooltip.visible).toEqual(false);
    });
  });
});
