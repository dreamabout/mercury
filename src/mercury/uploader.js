/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.Mercury.uploader = function(file, options) {
  if (window.Mercury.config.uploading.enabled) { window.Mercury.uploader.show(file, options); }
  return window.Mercury.uploader;
};

jQuery.extend(window.Mercury.uploader, {

  show(file, options) {
    if (options == null) { options = {}; }
    this.options = options;
    this.file = new window.Mercury.uploader.File(file);
    if (this.file.errors) {
      alert(`Error: ${this.file.errors}`);
      return;
    }
    if (!this.supported()) { return; }

    window.Mercury.trigger('focus:window');
    this.initialize();
    return this.appear();
  },


  initialize() {
    if (this.initialized) { return; }
    this.build();
    this.bindEvents();
    return this.initialized = true;
  },


  supported() {
    const xhr = new XMLHttpRequest;

    if (window.Uint8Array && window.ArrayBuffer && !XMLHttpRequest.prototype.sendAsBinary) {
      XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
        const ui8a = new Uint8Array(datastr.length);
        for (let index = 0; index < datastr.length; index++) { var data = datastr[index]; ui8a[index] = (datastr.charCodeAt(index) & 0xff); }
        return this.send(ui8a.buffer);
      };
    }

    return !!(xhr.upload && xhr.sendAsBinary && (window.Mercury.uploader.fileReaderSupported() || window.Mercury.uploader.formDataSupported()));
  },

  fileReaderSupported() {
    return !!(window.FileReader);
  },
  
  formDataSupported() {
    return !!(window.FormData);
  },

  build() {
    let left, left1;
    this.element = jQuery('<div>', {class: 'mercury-uploader', style: 'display:none'});
    this.element.append('<div class="mercury-uploader-preview"><b><img/></b></div>');
    this.element.append('<div class="mercury-uploader-details"></div>');
    this.element.append('<div class="mercury-uploader-progress"><span></span><div class="mercury-uploader-indicator"><div><b>0%</b></div></div></div>');

    this.updateStatus('Processing...');

    this.overlay = jQuery('<div>', {class: 'mercury-uploader-overlay', style: 'display:none'});

    this.element.appendTo((left = jQuery(this.options.appendTo).get(0)) != null ? left : 'body');
    return this.overlay.appendTo((left1 = jQuery(this.options.appendTo).get(0)) != null ? left1 : 'body');
  },


  bindEvents() {
    return window.Mercury.on('resize', () => this.position());
  },


  appear() {
    this.fillDisplay();
    this.position();

    this.overlay.show();
    return this.overlay.animate({opacity: 1}, 200, 'easeInOutSine', () => {
      this.element.show();
      return this.element.animate({opacity: 1}, 200, 'easeInOutSine', () => {
        this.visible = true;
        return this.loadImage();
      });
    });
  },


  position() {
    const width = this.element.outerWidth();
    const height = this.element.outerHeight();

    return this.element.css({
      top: (window.Mercury.displayRect.height - height) / 2,
      left: (window.Mercury.displayRect.width - width) / 2
    });
  },


  fillDisplay() {
    const details = [
      window.Mercury.I18n('Name: %s', this.file.name),
      window.Mercury.I18n('Size: %s', this.file.readableSize),
      window.Mercury.I18n('Type: %s', this.file.type)
    ];
    return this.element.find('.mercury-uploader-details').html(details.join('<br/>'));
  },


  loadImage() {
    if (window.Mercury.uploader.fileReaderSupported()) {
      return this.file.readAsDataURL(result => {
        this.element.find('.mercury-uploader-preview b').html(jQuery('<img>', {src: result}));
        return this.upload();
      });
    } else {
      return this.upload();
    }
  },


  upload() {
    const xhr = new XMLHttpRequest;
    jQuery.each(['onloadstart', 'onprogress', 'onload', 'onabort', 'onerror'], (index, eventName) => {
      return xhr.upload[eventName] = event => this.uploaderEvents[eventName].call(this, event);
    });
    xhr.onload = event => {
      if (event.currentTarget.status >= 400) {
        this.updateStatus('Error: Unable to upload the file');
        window.Mercury.notify('Unable to process response: %s', event.currentTarget.status);
        return this.hide();
      } else {
        try {
          const response =
            window.Mercury.config.uploading.handler ?
              window.Mercury.config.uploading.handler(event.target.responseText)
            :
              jQuery.parseJSON(event.target.responseText);
          const src = response.url || response.image.url;
          if (!src) { throw 'Malformed response from server.'; }
          window.Mercury.trigger('action', {action: 'insertImage', value: {src}});
          return this.hide();
        } catch (error) {
          this.updateStatus('Error: Unable to upload the file');
          window.Mercury.notify('Unable to process response: %s', error);
          return this.hide();
        }
      }
    };

    xhr.open('post', window.Mercury.config.uploading.url, true);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, text/html, application/xml, text/xml, */*');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader(window.Mercury.config.csrfHeader, window.Mercury.csrfToken);

    // Homespun multipart uploads. Chrome 18, Firefox 11.
    //
    if (window.Mercury.uploader.fileReaderSupported()) {
      return this.file.readAsBinaryString(result => {
        
        const multipart = new window.Mercury.uploader.MultiPartPost(window.Mercury.config.uploading.inputName, this.file, result);

        // update the content size so we can calculate
        this.file.updateSize(multipart.delta);

        // set the content type and send
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + multipart.boundary);
        return xhr.sendAsBinary(multipart.body);
      });
    
    // FormData based. Safari 5.1.2.
    //
    } else {
      const formData = new FormData();
      formData.append(window.Mercury.config.uploading.inputName, this.file.file, this.file.file.name);

      return xhr.send(formData);
    }
  },



  updateStatus(message, loaded) {
    this.element.find('.mercury-uploader-progress span').html(window.Mercury.I18n(message).toString());
    if (loaded) {
      const percent = Math.floor((loaded * 100) / this.file.size) + '%';
      this.element.find('.mercury-uploader-indicator div').css({width: percent});
      return this.element.find('.mercury-uploader-indicator b').html(percent).show();
    }
  },


  hide(delay) {
    if (delay == null) { delay = 0; }
    return setTimeout(() => {
      return this.element.animate({opacity: 0}, 200, 'easeInOutSine', () => {
        return this.overlay.animate({opacity: 0}, 200, 'easeInOutSine', () => {
          this.overlay.hide();
          this.element.hide();
          this.reset();
          this.visible = false;
          return window.Mercury.trigger('focus:frame');
        });
      });
    }
    , delay * 1000);
  },


  reset() {
    this.element.find('.mercury-uploader-preview b').html('');
    this.element.find('.mercury-uploader-indicator div').css({width: 0});
    this.element.find('.mercury-uploader-indicator b').html('0%').hide();
    return this.updateStatus('Processing...');
  },


  uploaderEvents: {
    onloadstart() { return this.updateStatus('Uploading...'); },

    onprogress(event) { return this.updateStatus('Uploading...', event.loaded); },

    onabort() {
      this.updateStatus('Aborted');
      return this.hide(1);
    },

    onload() {
      return this.updateStatus('Successfully uploaded...', this.file.size);
    },

    onerror() {
      this.updateStatus('Error: Unable to upload the file');
      return this.hide(3);
    }
  }
}
);



window.Mercury.uploader.File = class File {

  constructor(file) {
    this.file = file;
    this.fullSize = (this.size = this.file.size || this.file.fileSize);
    this.readableSize = this.size.toBytes();
    this.name = this.file.name || this.file.fileName;
    this.type = this.file.type || this.file.fileType;

    // add any errors if we need to
    const errors = [];
    if (this.size >= window.Mercury.config.uploading.maxFileSize) { errors.push(window.Mercury.I18n('Too large')); }
    if (!(window.Mercury.config.uploading.allowedMimeTypes.indexOf(this.type) > -1)) { errors.push(window.Mercury.I18n('Unsupported format')); }
    if (errors.length) { this.errors = errors.join(' / '); }
  }


  readAsDataURL(callback = null) {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    return reader.onload = () => { if (callback) { return callback(reader.result); } };
  }


  readAsBinaryString(callback = null) {
    const reader = new FileReader();
    reader.readAsBinaryString(this.file);
    return reader.onload = () => { if (callback) { return callback(reader.result); } };
  }


  updateSize(delta) {
    return this.fullSize = this.size + delta;
  }
};



window.Mercury.uploader.MultiPartPost = class MultiPartPost {

  constructor(inputName, file, contents, formInputs) {
    this.inputName = inputName;
    this.file = file;
    this.contents = contents;
    if (formInputs == null) { formInputs = {}; }
    this.formInputs = formInputs;
    this.boundary = 'Boundaryx20072377098235644401115438165x';
    this.body = '';
    this.buildBody();
    this.delta = this.body.length - this.file.size;
  }


  buildBody() {
    let name;
    const boundary = '--' + this.boundary;
    for (name of Object.keys(this.formInputs || {})) {
      var value = this.formInputs[name];
      this.body += `${boundary}\r\nContent-Disposition: form-data; name=\"${name}\"\r\n\r\n${unescape(encodeURIComponent(value))}\r\n`;
    }
    return this.body += `${boundary}\r\nContent-Disposition: form-data; name=\"${this.inputName}\"; filename=\"${this.file.name}\"\r\nContent-Type: ${this.file.type}\r\nContent-Transfer-Encoding: binary\r\n\r\n${this.contents}\r\n${boundary}--`;
  }
};
