/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Toolbar.ButtonGroup", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.button_group.html');
    window.Mercury.Toolbar.ButtonGroup.contexts.foo = () => false;
    return this.region = {
      element: $('<div>'),
      currentElement() { return $('<div>'); }
    };});

  afterEach(function() {
    this.buttonGroup = null;
    delete(this.buttonGroup);
    return $(window).unbind('mercury:region:update');
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Toolbar.ButtonGroup.prototype, 'build').andCallThrough();
      this.bindEventsSpy = spyOn(window.Mercury.Toolbar.ButtonGroup.prototype, 'bindEvents').andCallThrough();
      return this.buttonGroup = new window.Mercury.Toolbar.ButtonGroup('foo', {_context: true});
    });

    it("returns an element", function() {
      const html = $('<div>').html(this.buttonGroup).html();
      return expect(html).toEqual('<div class="mercury-button-group mercury-foo-group disabled"></div>');
    });

    it("calls build", function() {
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });


  return describe("observed events", function() {

    describe("custom event: region:update", () => it("sets disabled/enabled state based on it's context", function() {
      this.buttonGroup = new window.Mercury.Toolbar.ButtonGroup('foo', {_context: true});
      const contextSpy = spyOn(window.Mercury.Toolbar.ButtonGroup.contexts, 'foo').andCallFake(() => true);

      expect(this.buttonGroup.hasClass('disabled')).toEqual(true);

      window.Mercury.trigger('region:update', {region: this.region});
      expect(contextSpy.callCount).toEqual(1);
      return expect(this.buttonGroup.hasClass('disabled')).toEqual(false);
    }));

    describe("custom event: region:focused", function() {

      beforeEach(function() {
        return this.region = {
          type() { return 'full'; },
          element: $('<div>')
        };});

      it("disables if the region type isn't supported", function() {
        this.buttonGroup = new window.Mercury.Toolbar.ButtonGroup('foo', {_regions: ['foo']});
        this.buttonGroup.removeClass('disabled');
        window.Mercury.trigger('region:focused', {region: this.region});
        return expect(this.buttonGroup.hasClass('disabled')).toEqual(true);
      });

      return it("enables if the region type is supported", function() {
        this.buttonGroup = new window.Mercury.Toolbar.ButtonGroup('foo', {_regions: ['full']});
        this.buttonGroup.addClass('disabled');
        window.Mercury.trigger('region:focused', {region: this.region});
        return expect(this.buttonGroup.hasClass('disabled')).toEqual(false);
      });
    });

    return describe("custom event: region:blurred", () => it("disables if it's a button group for specific region types", function() {
      this.buttonGroup = new window.Mercury.Toolbar.ButtonGroup('foo', {_regions: ['full']});
      this.buttonGroup.removeClass('disabled');
      return window.Mercury.trigger('region:blurred', {region: this.region});
    }));
  });
});



describe("window.Mercury.Toolbar.ButtonGroup.contexts", function() {

  beforeEach(function() {
    fixture.load('mercury/toolbar.button_group.html');
    this.contexts = window.Mercury.Toolbar.ButtonGroup.contexts;
    return this.region = $('#context_container');
  });

  return describe("table", () => it("looks up for a table tag", function() {
    expect(this.contexts.table($('#context_td'), this.region)).toEqual(true);
    return expect(this.contexts.table($('#context_em'), this.region)).toEqual(false);
  }));
});
