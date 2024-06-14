/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.insertLink", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/insertlink.html');
    window.Mercury.region = null;
    this.modal = {
      element: $(fixture.el),
      hide() {},
      resize() {}
    };
    this.insertLink = $.extend(this.modal, window.Mercury.modalHandlers.insertLink);
    return window.mercuryInstance = {document: $(document)};});

  describe("initializing", function() {

    beforeEach(function() {
      return this.insertLink.initialize();
    });

    return it("loads all links with a name into the existing bookmarks pulldown", function() {
      const options = $('#link_existing_bookmark').html();
      expect(options).toContain('link1');
      expect(options).toContain('link2');
      return expect(options).toContain('Link Two');
    });
  });


  describe("clicking on a radio button (in a label)", function() {

    beforeEach(function() {
      return this.insertLink.initialize();
    });

    return it("focuses the next input with a selectable class", function() {
      const spy = spyOn($.fn, 'focus').andCallFake(() => {});
      jasmine.simulate.click($('input[value=external_url]').get(0));
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("focusing an input", function() {

    beforeEach(function() {
      return this.insertLink.initialize();
    });

    return it("checks the corresponding checkbox", function() {
      $('#link_existing_bookmark').focus();
      return expect($('input[value=existing_bookmark]').get(0).checked).toEqual(true);
    });
  });


  describe("changing the link target", function() {

    it("shows options for whatever was selected", function() {
      $('#link_target').val('popup');
      this.insertLink.onChangeTarget();
      return expect($('#popup_options').is(':visible')).toEqual(true);
    });

    return it("calls resize", function() {
      const spy = spyOn(this.modal, 'resize');
      this.insertLink.onChangeTarget();
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("when editing", function() {

    describe("a standard link", function() {

      beforeEach(function() {
        window.Mercury.region = { selection: () => ({
          commonAncestor() { return $('<a>', {href: 'http://cnn.com', target: '_top'}).html('foo'); },
        })
      };
        return this.insertLink.initialize();
      });

      it("hides the link text input", () => expect($('#link_text_container').is(':visible')).toEqual(false));

      it("pre-fills the link url input", () => expect($('#link_external_url').val()).toEqual('http://cnn.com'));

      return it("selects the target if one's available", () => expect($('#link_target').val()).toEqual('_top'));
    });

    describe("a javascript popup link", function() {

      beforeEach(function() {
        window.Mercury.region = { selection: () => ({
          commonAncestor() { return $('<a>', {href: "javascript:void(window.open('http://cnn.com', 'popup_window', 'width=100,height=42,menubar=no,toolbar=no'))"}).html('foo'); }
        })
      };
        return this.insertLink.initialize();
      });

      it("hides the link text input", () => expect($('#link_text_container').is(':visible')).toEqual(false));

      it("pre-fills the link url input", () => expect($('#link_external_url').val()).toEqual('http://cnn.com'));

      it("selects the target", () => expect($('#link_target').val()).toEqual('popup'));

      return it("sets the width and height by parsing them out of the href", function() {
        expect($('#link_popup_width').val()).toEqual('100');
        return expect($('#link_popup_height').val()).toEqual('42');
      });
    });

    describe("a bookmark link", function() {

      beforeEach(function() {
        window.Mercury.region = { selection: () => ({
          commonAncestor() { return $('<a>', {href: '#link2'}).html('foo'); }
        })
      };
        return this.insertLink.initialize();
      });

      it("hides the link text input", () => expect($('#link_text_container').is(':visible')).toEqual(false));

      it("checks the existing bookmark radio", () => expect($('input[value=existing_bookmark]').get(0).checked).toEqual(true));

      return it("selects the correct option from the list", () => expect($('#link_existing_bookmark').val()).toEqual('link2'));
    });

    return describe("a bookmark target", function() {

      beforeEach(function() {
        window.Mercury.region = { selection: () => ({
          commonAncestor() { return $('<a>', {name: 'link3'}).html('foo'); }
        })
      };
        return this.insertLink.initialize();
      });

      it("hides the link text input", () => expect($('#link_text_container').css('display')).toEqual('none'));

      it("checks the new bookmark radio", () => expect($('input[value=new_bookmark]').get(0).checked).toEqual(true));

      return it("sets the link name input", () => expect($('#link_new_bookmark').val()).toEqual('link3'));
    });
  });


  describe("validating", function() {

    beforeEach(function() {
      this.insertLink.initialize();
      this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      return $('#link_text').val('foo');
    });

    it("displays an error if there's no content", function() {
      $('#link_text').val('');
      this.insertLink.validateForm();
      expect(this.insertLink.valid).toEqual(false);
      return expect($('#link_text').closest('.control-group').find('.error-message').html()).toEqual("can't be blank");
    });

    describe("a standard link", function() {

      it("displays an error", function() {
        this.insertLink.validateForm();
        expect(this.insertLink.valid).toEqual(false);
        return expect($('#link_external_url').closest('.control-group').find('.error-message').html()).toEqual("can't be blank");
      });

      return it("doesn't submit", function() {
        this.insertLink.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });

    describe("a bookmark link", function() {

      beforeEach(function() {
        jasmine.simulate.click($('input[value=existing_bookmark]').get(0));
        return $('#link_existing_bookmark').html('').val('');
      });

      it("displays an error", function() {
        this.insertLink.validateForm();
        expect(this.insertLink.valid).toEqual(false);
        return expect($('#link_existing_bookmark').closest('.control-group').find('.error-message').html()).toEqual("can't be blank");
      });

      return it("doesn't submit", function() {
        this.insertLink.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });

    return describe("a bookmark target", function() {

      beforeEach(() => jasmine.simulate.click($('input[value=new_bookmark]').get(0)));

      it("displays an error", function() {
        this.insertLink.validateForm();
        expect(this.insertLink.valid).toEqual(false);
        return expect($('#link_new_bookmark').closest('.control-group').find('.error-message').html()).toEqual("can't be blank");
      });

      return it("doesn't submit", function() {
        this.insertLink.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });
  });


  return describe("submitting", function() {

    describe("a new link", function() {

      beforeEach(function() {
        this.insertLink.initialize();
        this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        return $('#link_text').val('foo');
      });

      it("doesn't submit unless it's valid", function() {
        $('#link_text').val('');
        const spy = spyOn(this.modal, 'hide');
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(spy.callCount).toEqual(0);
        return expect(this.insertLink.valid).toEqual(false);
      });

      it("hides the modal", function() {
        $('#link_external_url').val('http://cnn.com');
        const spy = spyOn(this.modal, 'hide');
        jasmine.simulate.click($('input[type=submit]').get(0));
        return expect(spy.callCount).toEqual(1);
      });

      describe("as a standard link", function() {

        beforeEach(function() {
          $('#link_external_url').val('http://cnn.com');
          return $('#link_target').val('_top');
        });

        return it("triggers an action with the proper values", function() {
          jasmine.simulate.click($('input[type=submit]').get(0));
          expect(this.triggerSpy.callCount).toEqual(1);
          expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
          expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertLink');
          return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({tagName: 'a', attrs: {href: 'http://cnn.com', target: '_top'}, content: 'foo'});
        });
      });

      describe("as a javascript popup", function() {

        beforeEach(function() {
          $('#link_external_url').val('http://cnn.com');
          $('#link_target').val('popup');
          $('#link_popup_width').val(100);
          return $('#link_popup_height').val('42');
        });

        return it("triggers an action with the proper values", function() {
          jasmine.simulate.click($('input[type=submit]').get(0));
          expect(this.triggerSpy.callCount).toEqual(1);
          expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
          expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertLink');
          return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({tagName: 'a', attrs: {href: "javascript:void(window.open('http://cnn.com', 'popup_window', 'width=100,height=42,menubar=no,toolbar=no'))"}, content: 'foo'});
        });
      });

      describe("as an existing bookmark", function() {

        beforeEach(function() {
          $('#link_existing_bookmark').val('link2');
          return $('input[value=existing_bookmark]').prop('checked', true);
        });

        return it("triggers an action with the proper values", function() {
          jasmine.simulate.click($('input[type=submit]').get(0));
          expect(this.triggerSpy.callCount).toEqual(1);
          expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
          expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertLink');
          return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({tagName: 'a', attrs: {href: '#link2'}, content: 'foo'});
        });
      });

      return describe("as a new bookmark", function() {

        beforeEach(function() {
          $('#link_new_bookmark').val('link3');
          return $('input[value=new_bookmark]').prop('checked', true);
        });

        return it("triggers an action with the proper values", function() {
          jasmine.simulate.click($('input[type=submit]').get(0));
          expect(this.triggerSpy.callCount).toEqual(1);
          expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
          expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertLink');
          return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({tagName: 'a', attrs: {name: 'link3'}, content: 'foo'});
        });
      });
    });

    return describe("editing an existing link", function() {

      beforeEach(function() {
        this.existingLink = $('<a>', {name: 'link3'}).html('foo');
        window.Mercury.region = { selection: () => ({
          commonAncestor: () => this.existingLink
        })
      };
        this.insertLink.initialize();
        this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
        return $('#link_text').val('foo');
      });

      it("hides the modal", function() {
        const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
        jasmine.simulate.click($('input[type=submit]').get(0));
        return expect(spy.callCount).toEqual(1);
      });

      return describe("as a standard link", function() {

        beforeEach(function() {
          $('#link_external_url').val('http://cnn.com');
          $('#link_target').val('_top');
          return $('input[value=external_url]').prop('checked', true);
        });

        return it("triggers an action with the proper values", function() {
          jasmine.simulate.click($('input[type=submit]').get(0));
          expect(this.triggerSpy.callCount).toEqual(1);
          expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
          expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('replaceLink');
          expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({tagName: 'a', attrs: {href: 'http://cnn.com', target: '_top'}, content: 'foo'});
          return expect(this.triggerSpy.argsForCall[0][1]['node']).toEqual(this.existingLink.get(0));
        });
      });
    });
  });
});
