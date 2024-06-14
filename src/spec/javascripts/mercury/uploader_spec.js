/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.uploader", function() {

  beforeEach(function() {
    fixture.load('mercury/uploader.html');
    window.Mercury.config.uploading.enabled = true;
    this.fileReaderSupport = spyOn(window.Mercury.uploader, 'fileReaderSupported');
    this.fileReaderSupport.andCallFake(() => true);
    $.fx.off = true;
    return this.mockFile = {
      size: 1024,
      fileName: 'image.png',
      type: 'image/png'
    };});

  afterEach(() => window.Mercury.uploader.initialized = false);

  describe("singleton method", function() {

    beforeEach(function() {
      return this.showSpy = spyOn(window.Mercury.uploader, 'show').andCallFake(() => {});
    });

    it("calls show", function() {
      window.Mercury.uploader(this.mockFile);
      return expect(this.showSpy.callCount).toEqual(1);
    });

    it("returns the function object", function() {
      const ret = window.Mercury.uploader(this.mockFile);
      return expect(ret).toEqual(window.Mercury.uploader);
    });

    return it("doesn't call show if disabled in configuration", function() {
      window.Mercury.config.uploading.enabled = false;
      window.Mercury.uploader(this.mockFile);
      return expect(this.showSpy.callCount).toEqual(0);
    });
  });


  describe("#show", function() {

    beforeEach(function() {
      this.initializeSpy = spyOn(window.Mercury.uploader, 'initialize').andCallFake(() => {});
      return this.appearSpy = spyOn(window.Mercury.uploader, 'appear').andCallFake(() => {});
    });

    it("expects a file object", function() {
      window.Mercury.uploader.show(this.mockFile);
      return expect(window.Mercury.uploader.file.name).toEqual(this.mockFile.fileName);
    });

    it("accepts options", function() {
      window.Mercury.uploader.show(this.mockFile, {foo: 'bar'});
      return expect(window.Mercury.uploader.options).toEqual({foo: 'bar'});
    });

    it("creates a file instance from the file", function() {
      window.Mercury.uploader.show(this.mockFile);
      expect(window.Mercury.uploader.file.name).toEqual(this.mockFile.fileName);
      return expect(window.Mercury.uploader.file.fullSize).toEqual(1024);
    });

    it("alerts and stops if the file has errors (too large or unsupported mimetype)", function() {
      this.mockFile.size = 123123123123;
      const spy = spyOn(window, 'alert').andCallFake(() => {});
      window.Mercury.uploader.show(this.mockFile);
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['Error: Too large']);
    });

    it("doesn't do anything unless xhr uploading is supported in the browser", function() {
      spyOn(window.Mercury.uploader, 'supported').andCallFake(() => false);
      window.Mercury.uploader.show(this.mockFile);
      return expect(this.initializeSpy.callCount).toEqual(0);
    });

    it("triggers an event to focus the window", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      window.Mercury.uploader.show(this.mockFile);
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:window']);
    });

    it("calls initialize", function() {
      window.Mercury.uploader.show(this.mockFile);
      return expect(this.initializeSpy.callCount).toEqual(1);
    });

    return it("calls appear", function() {
      window.Mercury.uploader.show(this.mockFile);
      return expect(this.appearSpy.callCount).toEqual(1);
    });
  });


  describe("#initialize", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.uploader, 'build').andCallFake(() => {});
      return this.bindEventsSpy = spyOn(window.Mercury.uploader, 'bindEvents').andCallFake(() => {});
    });

    it("calls build", function() {
      window.Mercury.uploader.initialize();
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    it("calls bindEvents", function() {
      window.Mercury.uploader.initialize();
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });

    return it("only initializes once", function() {
      window.Mercury.uploader.initialize();
      expect(this.buildSpy.callCount).toEqual(1);
      window.Mercury.uploader.initialize();
      return expect(this.buildSpy.callCount).toEqual(1);
    });
  });


  describe("#supported", function() {

    it("prototypes sendAsBinary onto XMLHttpRequest if it's not already there", function() {
      XMLHttpRequest.prototype.sendAsBinary = null;
      window.Mercury.uploader.supported();
      return expect(XMLHttpRequest.prototype.sendAsBinary).toBeDefined();
    });

    it("returns true if everything needed is supported", function() {
      const ret = window.Mercury.uploader.supported();
      return expect(ret).toEqual(true);
    });

    return it("returns false if everything isn't supported", function() {
      window.Uint8Array = null;
      const ret = window.Mercury.uploader.supported();
      return expect(ret).toEqual(true);
    });
  });


  describe("#build", function() {

    beforeEach(() => window.Mercury.uploader.options = {appendTo: fixture.el});

    it("builds an element structure", function() {
      window.Mercury.uploader.build();
      const html = $('<div>').html(window.Mercury.uploader.element).html();
      expect(html).toContain('class="mercury-uploader"');
      expect(html).toContain('class="mercury-uploader-preview"');
      expect(html).toContain('<b><img></b>');
      expect(html).toContain('class="mercury-uploader-details"');
      expect(html).toContain('<span>Processing...</span>');
      expect(html).toContain('class="mercury-uploader-indicator"');
      return expect(html).toContain('<div><b>0%</b></div>');
    });

    it("builds an overlay", function() {
      window.Mercury.uploader.build();
      const html = $('<div>').html(window.Mercury.uploader.overlay).html();
      return expect(html).toContain('class="mercury-uploader-overlay"');
    });

    return it("appends to any element", function() {
      window.Mercury.uploader.options = {appendTo: '#uploader_container'};
      window.Mercury.uploader.build();
      return expect($('#uploader_container .mercury-uploader').length).toEqual(1);
    });
  });


  describe("observed events", () => describe("custom event: resize", () => it("calls position", function() {
    const spy = spyOn(window.Mercury.uploader, 'position').andCallFake(() => {});
    window.Mercury.uploader.bindEvents();
    window.Mercury.trigger('resize');
    return expect(spy.callCount).toEqual(1);
  })));


  describe("#appear", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      window.Mercury.uploader.build();
      this.fillDisplaySpy = spyOn(window.Mercury.uploader, 'fillDisplay').andCallFake(() => {});
      this.positionSpy = spyOn(window.Mercury.uploader, 'position').andCallFake(() => {});
      return this.loadImageSpy = spyOn(window.Mercury.uploader, 'loadImage').andCallFake(() => {});
    });

    it("calls fillDisplay", function() {
      window.Mercury.uploader.appear();
      return expect(this.fillDisplaySpy.callCount).toEqual(1);
    });

    it("calls position", function() {
      window.Mercury.uploader.appear();
      return expect(this.positionSpy.callCount).toEqual(1);
    });

    it("displays the overlay, and the element", function() {
      window.Mercury.uploader.appear();
      expect($('.mercury-uploader', fixture.el).css('display')).toEqual('block');
      return expect($('.mercury-uploader-overlay', fixture.el).css('display')).toEqual('block');
    });

    it("sets visible to true", function() {
      window.Mercury.uploader.appear();
      return expect(window.Mercury.uploader.visible).toEqual(true);
    });

    return it("calls loadImage", function() {
      window.Mercury.uploader.appear();
      return expect(this.loadImageSpy.callCount).toEqual(1);
    });
  });


  describe("#position", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      window.Mercury.uploader.build();
      this.fillDisplaySpy = spyOn(window.Mercury.uploader, 'fillDisplay').andCallFake(() => {});
      return this.positionSpy = spyOn(window.Mercury.uploader, 'position').andCallFake(() => {});
    });

    return it("centers the element in the viewport", function() {
      // todo: this isn't really being tested
      window.Mercury.uploader.element.css({display: 'block'});
      window.Mercury.uploader.position();
      return this.expect($('.mercury-uploader', fixture.el).offset()).toEqual({top: 0, left: 0});
    });
  });


  describe("#fillDisplay", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      window.Mercury.uploader.file = {name: 'image.png', size: 1024, type: 'image/png'};
      return window.Mercury.uploader.build();
    });

    return it("puts the file details into the element", function() {
      window.Mercury.uploader.fillDisplay();
      return expect($('.mercury-uploader-details', fixture.el).html()).toEqual('Name: image.png<br>Size: undefined<br>Type: image/png');
    });
  });


  describe("#loadImage", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      window.Mercury.uploader.file = new window.Mercury.uploader.File(this.mockFile);
      window.Mercury.uploader.build();
      spyOn(FileReader.prototype, 'readAsBinaryString').andCallFake(() => {});
      this.fileReaderSupport.andCallFake(() => true);
      return this.readAsDataURLSpy = spyOn(window.Mercury.uploader.File.prototype, 'readAsDataURL').andCallFake(callback => callback('data-url'));
    });

    it("calls file.readAsDataURL", function() {
      window.Mercury.uploader.loadImage();
      return expect(this.readAsDataURLSpy.callCount).toEqual(1);
    });

    it("sets the preview image src to the file contents", function() {
      window.Mercury.uploader.loadImage();
      return expect($('.mercury-uploader-preview img', fixture.el).attr('src')).toEqual('data-url');
    });

    return it("calls upload", function() {
      const spy = spyOn(window.Mercury.uploader, 'upload').andCallFake(() => {});
      window.Mercury.uploader.loadImage();
      return expect(spy.callCount).toEqual(1);
    });
  });

  describe("#loadImage without FileReader", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      window.Mercury.uploader.file = new window.Mercury.uploader.File(this.mockFile);
      window.Mercury.uploader.build();
      return this.fileReaderSupport.andCallFake(() => false);
    });

    return it("calls upload", function() {
      const spy = spyOn(window.Mercury.uploader, 'upload').andCallFake(() => {});
      window.Mercury.uploader.loadImage();
      return expect(spy.callCount).toEqual(1);
    });
  });


  describe("#upload", () => it("should build a multipart form and submit it"));


  describe("#updateStatus", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      return window.Mercury.uploader.build();
    });

    it("updated the message in the progress display", function() {
      window.Mercury.uploader.updateStatus('status message');
      return expect($('.mercury-uploader-progress span', fixture.el).html()).toEqual('status message');
    });

    it("updates the progress indicator width", function() {
      window.Mercury.uploader.updateStatus('message', 512);
      return expect($('.mercury-uploader-indicator div', fixture.el).css('width')).toEqual('50px');
    });

    return it("updates the progress indicator value", function() {
      window.Mercury.uploader.updateStatus('message', 512);
      return expect($('.mercury-uploader-indicator b', fixture.el).html()).toEqual('50%');
    });
  });


  describe("#hide", function() {

    beforeEach(function() {
      this.setTimeoutSpy = spyOn(window, 'setTimeout');
      window.Mercury.uploader.options = {appendTo: fixture.el};
      return window.Mercury.uploader.build();
    });

    it("accepts a delay", function() {
      this.setTimeoutSpy.andCallFake(() => {});
      window.Mercury.uploader.hide(1);
      expect(this.setTimeoutSpy.callCount).toEqual(1);
      return expect(this.setTimeoutSpy.argsForCall[0][1]).toEqual(1000);
    });

    it("hides the overlay and element", function() {
      this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
      window.Mercury.uploader.hide();
      expect($('.mercury-uploader', fixture.el).css('opacity')).toEqual('0');
      return expect($('.mercury-uploader-overlay', fixture.el).css('opacity')).toEqual('0');
    });

    it("calls reset", function() {
      this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
      const spy = spyOn(window.Mercury.uploader, 'reset').andCallFake(() => {});
      window.Mercury.uploader.hide();
      return expect(spy.callCount).toEqual(1);
    });

    it("sets visible to false", function() {
      this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
      window.Mercury.uploader.hide();
      return expect(window.Mercury.uploader.visible).toEqual(false);
    });

    return it("focuses the frame", function() {
      this.setTimeoutSpy.andCallFake((callback, timeout) => callback());
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      window.Mercury.uploader.hide();
      expect(spy.callCount).toEqual(1);
      return expect(spy.argsForCall[0]).toEqual(['focus:frame']);
    });
  });


  describe("#reset", function() {

    beforeEach(function() {
      window.Mercury.uploader.options = {appendTo: fixture.el};
      return window.Mercury.uploader.build();
    });

    it("removes the preview image", function() {
      $('.mercury-uploader-indicator div', fixture.el).html('foo');
      window.Mercury.uploader.reset();
      return expect($('.mercury-uploader-preview b', fixture.el).html()).toEqual('');
    });

    it("resets the progress back to 0", function() {
      $('.mercury-uploader-indicator div', fixture.el).css({width: '50%'});
      $('.mercury-uploader-indicator b', fixture.el).html('50%');
      window.Mercury.uploader.reset();
      expect($('.mercury-uploader-indicator div', fixture.el).css('width')).toEqual('0px');
      return expect($('.mercury-uploader-indicator b', fixture.el).html()).toEqual('0%');
    });

    return it("sets the status back to 'Processing...' for next time", function() {
      const spy = spyOn(window.Mercury.uploader, 'updateStatus').andCallFake(() => {});
      window.Mercury.uploader.reset();
      return expect(spy.callCount).toEqual(1);
    });
  });


  return describe("uploaderEvents", function() {

    beforeEach(function() {
      window.Mercury.uploader.file = this.mockFile;
      this.updateStatusSpy = spyOn(window.Mercury.uploader, 'updateStatus').andCallFake(() => {});
      this.hideSpy = spyOn(window.Mercury.uploader, 'hide').andCallFake(() => {});
      return this.events = window.Mercury.uploader.uploaderEvents;
    });

    describe(".onloadstart", () => it("updates the status to 'Uploading...'", function() {
      this.events.onloadstart.call(window.Mercury.uploader);
      expect(this.updateStatusSpy.callCount).toEqual(1);
      return expect(this.updateStatusSpy.argsForCall[0]).toEqual(['Uploading...']);
    }));

    describe(".onprogress", () => it("updates the status to 'Uploading...' and passes the amount sent so far", function() {
      this.events.onprogress.call(window.Mercury.uploader, {loaded: 512});
      expect(this.updateStatusSpy.callCount).toEqual(1);
      return expect(this.updateStatusSpy.argsForCall[0]).toEqual(['Uploading...', 512]);
    }));

    describe(".onabort", function() {

      it("updates the status to 'Aborted'", function() {
        this.events.onabort.call(window.Mercury.uploader);
        expect(this.updateStatusSpy.callCount).toEqual(1);
        return expect(this.updateStatusSpy.argsForCall[0]).toEqual(['Aborted']);
      });

      return it("calls hide", function() {
        this.events.onabort.call(window.Mercury.uploader);
        return expect(this.hideSpy.callCount).toEqual(1);
      });
    });

    describe(".onload", () => it("updates the status to 'Successfully uploaded' and passes the total file size", function() {
      this.events.onload.call(window.Mercury.uploader);
      expect(this.updateStatusSpy.callCount).toEqual(1);
      return expect(this.updateStatusSpy.argsForCall[0]).toEqual(['Successfully uploaded...', 1024]);
    }));

    return describe(".onerror", function() {

      it("updates the status to 'Error: Unable to upload the file'", function() {
        this.events.onerror.call(window.Mercury.uploader);
        expect(this.updateStatusSpy.callCount).toEqual(1);
        return expect(this.updateStatusSpy.argsForCall[0]).toEqual(['Error: Unable to upload the file']);
      });

      return it("calls hide", function() {
        this.events.onerror.call(window.Mercury.uploader);
        expect(this.hideSpy.callCount).toEqual(1);
        return expect(this.hideSpy.argsForCall[0]).toEqual([3]);
      });
    });
  });
});



describe("window.Mercury.uploader.File", function() {

  beforeEach(function() {
    return this.mockFile = {
      size: 1024,
      fileName: 'image.png',
      type: 'image/png'
    };});

  afterEach(function() {
    this.file = null;
    return delete(this.file);
  });

  describe("constructor", function() {

    it("expects a file", function() {
      this.file = new window.Mercury.uploader.File(this.mockFile);
      return expect(this.file.file).toEqual(this.mockFile);
    });

    it("reads attributes of the file and sets variables", function() {
      this.file = new window.Mercury.uploader.File(this.mockFile);
      expect(this.file.size).toEqual(1024);
      expect(this.file.fullSize).toEqual(1024);
      expect(this.file.readableSize).toEqual('1.00 kb');
      expect(this.file.name).toEqual('image.png');
      return expect(this.file.type).toEqual('image/png');
    });

    return it("adds errors if there's any", function() {
      window.Mercury.config.uploading.maxFileSize = 100;
      window.Mercury.config.uploading.allowedMimeTypes = ['image/foo'];
      this.file = new window.Mercury.uploader.File(this.mockFile);
      return expect(this.file.errors).toEqual('Too large / Unsupported format');
    });
  });


  describe("#readAsDataURL", function() {

    it("it calls readAsDataURL on a FileReader object", function() {
      const spy = spyOn(window.FileReader.prototype, 'readAsDataURL').andCallFake(() => {});
      this.file = new window.Mercury.uploader.File(this.mockFile);
      this.file.readAsDataURL();
      return expect(spy.callCount).toEqual(1);
    });

    return it("calls a callback if one was provided", function() {
      spyOn(FileReader.prototype, 'readAsDataURL').andCallFake(() => {});
      FileReader.prototype.result = 'result';
      let callCount = 0;
      const callback = r => callCount += 1;

      this.file = new window.Mercury.uploader.File(this.mockFile);
      const onload = this.file.readAsDataURL(callback);
      onload();
      return expect(callCount).toEqual(1);
    });
  });


  describe("#readAsBinaryString", function() {

    it("it calls readAsBinaryString on a FileReader object", function() {
      const spy = spyOn(window.FileReader.prototype, 'readAsBinaryString').andCallFake(() => {});
      this.file = new window.Mercury.uploader.File(this.mockFile);
      this.file.readAsBinaryString();
      return expect(spy.callCount).toEqual(1);
    });

    return it("calls a callback if one was provided", function() {
      spyOn(FileReader.prototype, 'readAsBinaryString').andCallFake(() => {});
      FileReader.prototype.result = 'result';
      let callCount = 0;
      const callback = r => callCount += 1;

      this.file = new window.Mercury.uploader.File(this.mockFile);
      const onload = this.file.readAsBinaryString(callback);
      onload();
      return expect(callCount).toEqual(1);
    });
  });


  return describe("#updateSize", () => it("updates the size based on a delta", function() {
    this.file = new window.Mercury.uploader.File(this.mockFile);
    this.file.updateSize(20);
    return expect(this.file.fullSize).toEqual(1044);
  }));
});



describe("window.Mercury.uploader.MultiPartPost", function() {

  beforeEach(function() {
    return this.mockFile = {
      size: 1024,
      name: 'image.png',
      type: 'image/png'
    };});

  afterEach(function() {
    this.multiPartPost = null;
    return delete(this.multiPartPost);
  });

  describe("constructor", function() {

    it("expects an inputName, file, and file contents", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents');
      expect(this.multiPartPost.inputName).toEqual('foo[bar]');
      expect(this.multiPartPost.file).toEqual(this.mockFile);
      return expect(this.multiPartPost.contents).toEqual('file contents');
    });

    it("accepts a formInputs object", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents', {foo: 'bar'});
      return expect(this.multiPartPost.formInputs).toEqual({foo: 'bar'});
    });

    it("defines a boundary string", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents');
      return expect(this.multiPartPost.boundary).toEqual('Boundaryx20072377098235644401115438165x');
    });

    it("calls buildBody", function() {
      const spy = spyOn(window.Mercury.uploader.MultiPartPost.prototype, 'buildBody').andCallFake(() => {});
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents');
      return expect(spy.callCount).toEqual(1);
    });

    return it("sets a delta based on the body size and file size", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents');
      return expect(this.multiPartPost.delta).toEqual(-790);
    });
  });


  return describe("#buildBody", function() {

    it("creates a multipart post body with the file information", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents');
      expect(this.multiPartPost.body).toContain('--Boundaryx20072377098235644401115438165x');
      expect(this.multiPartPost.body).toContain('Content-Disposition: form-data; name="foo[bar]"; filename="image.png"');
      expect(this.multiPartPost.body).toContain('Content-Type: image/png');
      expect(this.multiPartPost.body).toContain('Content-Transfer-Encoding: binary');
      return expect(this.multiPartPost.body).toContain('file contents');
    });

    return it("includes form inputs if passed in", function() {
      this.multiPartPost = new window.Mercury.uploader.MultiPartPost('foo[bar]', this.mockFile, 'file contents', {foo: 'bar'});
      return expect(this.multiPartPost.body).toContain('Content-Disposition: form-data; name="foo"\r\n\r\nbar');
    });
  });
});
