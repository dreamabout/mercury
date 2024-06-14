/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Statusbar", function() {

  beforeEach(function() {
    fixture.load('mercury/statusbar.html');
    $.fx.off = true;
    return this.region = {
      path() { return [{tagName: 'A'}, {tagName: 'B'}, {tagName: 'C'}]; }
    };});

  afterEach(function() {
    this.statusbar = null;
    return delete(this.statusbar);
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Statusbar.prototype, 'build');
      this.bindEventsSpy = spyOn(window.Mercury.Statusbar.prototype, 'bindEvents');
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, foo: 'bar', visible: false});
    });

    it("accepts options", function() {
      return expect(this.statusbar.options.foo).toEqual('bar');
    });

    it("sets visible based on options", function() {
      return expect(this.statusbar.visible).toEqual(false);
    });

    it("calls build", function() {
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Statusbar.prototype, 'bindEvents').andCallFake(() => {});
      return this.statusbar = new window.Mercury.Statusbar({appendTo: '#statusbar_container', visible: false});
    });

    it("builds an element", () => expect($('.mercury-statusbar').length).toEqual(1));

    it("builds an about element", function() {
      expect($('.mercury-statusbar-about').length).toEqual(1);
      return expect(this.statusbar.aboutElement).toBeDefined();
    });

    it("hides the element if it's not supposed to be visible", () => expect($('.mercury-statusbar').css('visibility')).toEqual('hidden'));

    return it("can append to any element", () => expect($('#statusbar_container .mercury-statusbar').length).toEqual(1));
  });


  describe("observed events ", function() {

    beforeEach(function() {
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el});
    });

    describe("custom event: region:update", () => it("calls setPath if a region was provided", function() {
      const spy = spyOn(window.Mercury.Statusbar.prototype, 'setPath').andCallFake(() => {});
      window.Mercury.trigger('region:update', {region: this.region});
      return expect(spy.callCount).toEqual(1);
    }));

    return describe("clicking on the about element", () => it("opens a lightview", function() {
      const spy = spyOn(window.Mercury, 'lightview').andCallFake(() => {});
      jasmine.simulate.click($('.mercury-statusbar-about').get(0));
      return expect(spy.callCount).toEqual(1);
    }));
  });


  describe("#height", function() {

    beforeEach(function() {
      spyOn(window.Mercury.Statusbar.prototype, 'bindEvents').andCallFake(() => {});
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, visible: true});
    });

    return it("knows it's own height", function() {
      return expect(this.statusbar.height()).toEqual(20);
    });
  }); // styled with css in the template


  describe("#top", function() {

    describe("when visible", function() {

      beforeEach(function() {
        spyOn(window.Mercury.Statusbar.prototype, 'bindEvents').andCallFake(() => {});
        return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, visible: true});
      });

      return it("returns the offset top of the element", function() {
        return expect(this.statusbar.top()).toEqual($('.mercury-statusbar').offset().top);
      });
    });

    return describe("when not visible", function() {

      beforeEach(function() {
        spyOn(window.Mercury.Statusbar.prototype, 'bindEvents').andCallFake(() => {});
        return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, visible: false});
      });

      return it("returns the offset top of the element + it's outer height", function() {
        return expect(this.statusbar.top()).toEqual($('.mercury-statusbar').offset().top + $('.mercury-statusbar').outerHeight());
      });
    });
  });


  describe("#setPath", function() {

    beforeEach(function() {
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el});
    });

    return it("builds a path and displays it", function() {
      this.statusbar.setPath(this.region.path());
      return expect($('.mercury-statusbar').html()).toMatch(/<span><strong>Path: <\/strong><a>c<\/a> .+ <a>b<\/a> .+ <a>a<\/a><\/span>/);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, visible: false});
    });

    it("sets visible to true", function() {
      this.statusbar.visible = false;
      this.statusbar.show();
      return expect(this.statusbar.visible).toEqual(true);
    });

    it("displays the element", function() {
      $('.mercury-statusbar').css({visibility: 'hidden'});
      this.statusbar.show();
      return expect($('.mercury-statusbar').css('visibility')).toEqual('visible');
    });

    return it("sets the opacity of the element", function() {
      $('.mercury-statusbar').css({opacity: 0});
      this.statusbar.show();
      return expect($('.mercury-statusbar').css('opacity')).toEqual('1');
    });
  });


  return describe("#hide", function() {

    beforeEach(function() {
      return this.statusbar = new window.Mercury.Statusbar({appendTo: fixture.el, visible: true});
    });

    it("sets visible to false", function() {
      this.statusbar.visible = true;
      this.statusbar.hide();
      return expect(this.statusbar.visible).toEqual(false);
    });

    return it("hides the element", function() {
      $('.mercury-statusbar').css({visibility: 'visible'});
      this.statusbar.hide();
      return expect($('.mercury-statusbar').css('visibility')).toEqual('hidden');
    });
  });
});
