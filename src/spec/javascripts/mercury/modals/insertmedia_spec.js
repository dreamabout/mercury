/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.insertMedia", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/insertmedia.html');
    window.Mercury.region = null;
    spyOn(window, 'setTimeout').andCallFake((callback, timeout) => callback());
    this.modal = {
      element: $(fixture.el),
      hide() {},
      resize() {}
    };
    this.insertMedia = $.extend(this.modal, window.Mercury.modalHandlers.insertMedia);
    return window.mercuryInstance = {document: $(document)};});

  describe("clicking on a radio button (in a label)", function() {

    beforeEach(function() {
      return this.insertMedia.initialize();
    });

    return it("focuses the next input with a selectable class", function() {
      const spy = spyOn($.fn, 'focus').andCallFake(() => {});
      jasmine.simulate.click($('input[value=image_url]').get(0));
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("focusing an input", function() {

    beforeEach(function() {
      return this.insertMedia.initialize();
    });

    it("checks the corresponding checkbox", function() {
      $('#media_youtube_url').focus();
      return expect($('input[value=youtube_url]').get(0).checked).toEqual(true);
    });

    it("hides all the option divs", function() {
      $('#media_youtube_url').focus();
      expect($('#image_url_options').css('display')).toEqual('none');
      return expect($('#vimeo_url_options').css('display')).toEqual('none');
    });

    it("shows the options for the item that was focused", function() {
      $('#media_youtube_url').focus();
      return expect($('#youtube_url_options').css('display')).toNotEqual('none');
    });

    return it("calls resize", function() {
      const spy = spyOn(this.modal, 'resize').andCallFake(() => {});
      $('#media_youtube_url').focus();
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("when editing", function() {

    describe("an existing image", function() {

      beforeEach(function() {
        this.focusSpy = spyOn($.fn, 'focus').andCallThrough();
        this.selection = {is() { return $('<img>', {src: '/foo.gif', align: 'right', style: 'float: left; width: 170px; height: 220px;'}); }};
        window.Mercury.region = {selection: () => this.selection};
        return this.insertMedia.initialize();
      });

      it("pre-fills the image url", () => expect($('#media_image_url').val()).toEqual('/foo.gif'));

      it("focuses the url input", function() {
        expect(this.focusSpy.callCount).toEqual(2);
        return expect($('input[value=image_url]').get(0).checked).toEqual(true);
      });

      it("sets the image alignment option", () => expect($('#media_image_alignment').val()).toEqual('right'));

      it("sets the image float option", () => expect($('#media_image_float').val()).toEqual('left'));

      it("sets the image width option", () => expect($('#media_image_width').val()).toEqual('170'));

      return it("sets the image height option", () => expect($('#media_image_height').val()).toEqual('220'));
    });

    describe("an existing youtube video", function() {

      beforeEach(function() {
        this.focusSpy = spyOn($.fn, 'focus').andCallThrough();
        this.selection = {is() { return $('<iframe>', {src: 'https://www.youtube.com/embed/foo?wmode=transparent', style: 'width:100px;height:42px'}); }};
        window.Mercury.region = {selection: () => this.selection};
        return this.insertMedia.initialize();
      });

      it("pre-fills the url", () => expect($('#media_youtube_url').val()).toEqual('https://youtu.be/foo'));

      it("focuses the url input", () => expect($('input[value=youtube_url]').get(0).checked).toEqual(true));

      it("sets the width option", () => expect($('#media_youtube_width').val()).toEqual('100'));

      return it("sets the height option", () => expect($('#media_youtube_height').val()).toEqual('42'));
    });

    return describe("an existing vimeo video", function() {

      beforeEach(function() {
        this.focusSpy = spyOn($.fn, 'focus').andCallThrough();
        this.selection = {is() { return $('<iframe>', {src: 'http://player.vimeo.com/video/foo?title=1&byline=1&portrait=0&color=ffffff', style: 'width:100px;height:42px'}); }};
        window.Mercury.region = {selection: () => this.selection};
        return this.insertMedia.initialize();
      });

      it("pre-fills the url", () => expect($('#media_vimeo_url').val()).toEqual('http://vimeo.com/foo'));

      it("focuses the url input", () => expect($('input[value=vimeo_url]').get(0).checked).toEqual(true));

      it("sets the width option", () => expect($('#media_vimeo_width').val()).toEqual('100'));

      return it("sets the height option", () => expect($('#media_vimeo_height').val()).toEqual('42'));
    });
  });


  describe("validating", function() {

    beforeEach(function() {
      this.insertMedia.initialize();
      return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    });

    describe("an image", function() {

      it("displays an error", function() {
        this.insertMedia.validateForm();
        expect(this.insertMedia.valid).toEqual(false);
        return expect($('#media_image_url').closest('.control-group').find('.error-message').html()).toEqual("can't be blank");
      });

      return it("doesn't submit", function() {
        this.insertMedia.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });

    describe("a youtube video", function() {

      beforeEach(() => $('input[value=youtube_url]').prop('checked', true));

      it("displays an error", function() {
        this.insertMedia.validateForm();
        expect(this.insertMedia.valid).toEqual(false);
        return expect($('#media_youtube_url').closest('.control-group').find('.error-message').html()).toEqual("is invalid");
      });

      return it("doesn't submit", function() {
        this.insertMedia.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });

    return describe("a vimeo video", function() {
      beforeEach(() => $('input[value=vimeo_url]').prop('checked', true));

      it("displays an error", function() {
        this.insertMedia.validateForm();
        expect(this.insertMedia.valid).toEqual(false);
        return expect($('#media_vimeo_url').closest('.control-group').find('.error-message').html()).toEqual("is invalid");
      });

      return it("doesn't submit", function() {
        this.insertMedia.validateForm();
        return expect(this.triggerSpy.callCount).toEqual(0);
      });
    });
  });


  return describe("submitting", function() {

    beforeEach(function() {
      this.insertMedia.initialize();
      return this.triggerSpy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
    });

    it("doesn't submit unless it's valid", function() {
      const spy = spyOn(this.modal, 'hide');
      jasmine.simulate.click($('input[type=submit]').get(0));
      expect(spy.callCount).toEqual(0);
      return expect(this.insertMedia.valid).toEqual(false);
    });

    it("hides the modal", function() {
      $('#media_image_url').val('foo.gif');
      const spy = spyOn(this.modal, 'hide');
      jasmine.simulate.click($('input[type=submit]').get(0));
      return expect(spy.callCount).toEqual(1);
    });

    describe("an image", function() {

      beforeEach(function() {
        $('#media_image_url').val('http://domain/foo.gif');
        $('#media_image_alignment').val('right');
        $('#media_image_float').val('left');
        $('#media_image_width').val('170');
        return $('#media_image_height').val('220');
      });

      it("triggers an action with the proper values", function() {
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertImage');
        return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({src: 'http://domain/foo.gif', align: 'right', style: 'float: left; width: 170px; height: 220px;'});
      });

      return it("does not include width and height values if none are set", function() {
        $('#media_image_width').val('');
        $('#media_image_height').val('');
        jasmine.simulate.click($('input[type=submit]').get(0));
        return expect(this.triggerSpy.argsForCall[0][1]['value']).toEqual({src: 'http://domain/foo.gif', align: 'right', style: 'float: left; '});
      });
    });

    describe("a youtube video", function() {

      beforeEach(function() {
        $('#media_youtube_url').val('http://youtu.be/foo');
        $('#media_youtube_width').val(100);
        $('#media_youtube_height').val('42');
        return $('input[value=youtube_url]').prop('checked', true);
      });

      it("triggers an action with the proper values", function() {
        $('#media_youtube_url').val('http://youtu.be/foo');
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertHTML');
        const value = $('<div>').html(this.triggerSpy.argsForCall[0][1]['value']).html();
        expect(value).toContain('100px');
        expect(value).toContain('42px');
        return expect(value).toContain('src="http://www.youtube.com/embed/foo?wmode=transparent"');
      });

      return it("triggers an action with the proper values using https", function() {
        $('#media_youtube_url').val('https://youtu.be/foo');
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertHTML');
        const value = $('<div>').html(this.triggerSpy.argsForCall[0][1]['value']).html();
        expect(value).toContain('100px');
        expect(value).toContain('42px');
        return expect(value).toContain('src="https://www.youtube.com/embed/foo?wmode=transparent"');
      });
    });

    return describe("a vimeo video", function() {

      beforeEach(function() {
        $('#media_vimeo_width').val(100);
        $('#media_vimeo_height').val('42');
        return $('input[value=vimeo_url]').prop('checked', true);
      });

      it("triggers an action with the proper values", function() {
        $('#media_vimeo_url').val('http://vimeo.com/foo');
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertHTML');
        const value = $('<div>').html(this.triggerSpy.argsForCall[0][1]['value']).html();
        expect(value).toContain('100px');
        expect(value).toContain('42px');
        return expect(value).toContain('http://player.vimeo.com/video/foo?title=1&amp;byline=1&amp;portrait=0&amp;color=ffffff');
      });

      return it("triggers an action with the proper values using https", function() {
        $('#media_vimeo_url').val('https://vimeo.com/foo');
        jasmine.simulate.click($('input[type=submit]').get(0));
        expect(this.triggerSpy.callCount).toEqual(1);
        expect(this.triggerSpy.argsForCall[0][0]).toEqual('action');
        expect(this.triggerSpy.argsForCall[0][1]['action']).toEqual('insertHTML');
        const value = $('<div>').html(this.triggerSpy.argsForCall[0][1]['value']).html();
        expect(value).toContain('100px');
        expect(value).toContain('42px');
        return expect(value).toContain('https://player.vimeo.com/video/foo?title=1&amp;byline=1&amp;portrait=0&amp;color=ffffff');
      });
    });
  });
});
