/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Regions.Markdown", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/markdown.html');
    return this.regionElement = $('#markdown_region1');
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Regions.Markdown.prototype, 'build').andCallFake(() => {});
      this.bindEventsSpy = spyOn(window.Mercury.Regions.Markdown.prototype, 'bindEvents').andCallFake(() => {});
      return spyOn(window.Mercury.Regions.Markdown.prototype, 'pushHistory').andCallFake(() => {});
    });

    it("expects an element and window", function() {
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window);
      expect(this.region.element.get(0)).toEqual($('#markdown_region1').get(0));
      return expect(this.region.window).toEqual(window);
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window, {foo: 'something'});
      return expect(this.region.options).toEqual({foo: 'something'});
    });

    it("sets it's type", function() {
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window);
      return expect(this.region.type()).toEqual('markdown');
    });

    it("creates a markdown converter using Showdown", function() {
      const spy = spyOn(Showdown, 'converter').andCallFake(() => {});
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window);
      expect(spy.callCount).toEqual(1);
      return expect(this.region.converter).toBeDefined();
    });

    it("calls build", function() {
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window);
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      this.region = new window.Mercury.Regions.Markdown(this.regionElement, window);
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    it("creates a textarea", function() {});

    it("fills the textarea with the contents of the element", function() {});

    it("sets some styles on the textarea", function() {});

    it("appends the textarea to the element", function() {});

    it("creates a preview element", function() {});

    it("appends the preview element to the element", function() {});

    it("element is reassigned to the textarea", function() {});

    return it("calls resize", function() {});
  });


  describe("#focus", () => it("calls focus on the element", function() {}));


  describe("observed events", function() {

    describe("custom event: mode", () => it("calls togglePreview if the mode is preview", function() {}));

    describe("custom event: focus:frame", function() {

      it("calls focus", function() {});

      it("does nothing if previewing", function() {});

      return it("does nothing if it's not the active region", function() {});
    });

    describe("custom event: action", function() {

      it("calls execCommand", function() {});

      it("does nothing if previewing", function() {});

      return it("does nothing if it's not the active region", function() {});
    });

    describe("custom event: unfocus:regions", function() {

      it("blurs the element", function() {});

      it("removes the focus class from the element", function() {});

      it("triggers the region:blurred event", function() {});

      it("does nothing if previewing", function() {});

      return it("does nothing if it's not the active region", function() {});
    });

    describe("dragenter", function() {

      it("prevents the default action", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("dragover", function() {

      it("prevents the default action", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("drop", function() {

      it("does nothing if previewing", function() {});

      describe("when there's an active snippet", function() {

        it("calls focus", function() {});

        it("calls displayOptionsFor for the snippet", function() {});

        return it("calls the native undo", function() {});
      });

      return describe("when a file is dropped", function() {

        it("calls focus", function() {});

        return it("loads the uploader", function() {});
      });
    });

    describe("focus", function() {

      it("does nothing if previewing", function() {});

      it("sets the active region to itself", function() {});

      it("adds the focus class to the element", function() {});

      return it("triggers the region:focused event", function() {});
    });

    describe("keydown", function() {

      it("does nothing if previewing", function() {});

      it("tells mercury that changes have been made", function() {});

      it("calls pushHistory", function() {});

      it("calls execCommand with undo on meta+z", function() {});

      it("calls execCommand with redo on shift+meta+z", function() {});

      describe("pressing enter in a list", function() {

        it("prevents the default event", function() {});

        return it("adds a new line with the next number or just dash for unordered lists", function() {});
      });

      describe("pressing tab", () => it("calls execCommand with inserHTML and two spaces", function() {}));

      return describe("with common actions", function() {

        it("calls execCommand with bold on meta+b", function() {});

        it("calls execCommand with italic on meta+i", function() {});

        return it("calls execCommand with underline on meta+u", function() {});
      });
    });

    describe("keyup", function() {

      it("triggers the region:update event", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("mouseup", function() {

      it("calls focus", function() {});

      it("triggers the region:update event", function() {});

      return it("does nothing if previewing", function() {});
    });

    return describe("click on the preview element", () => it("sets anchor targets to top if previewing", function() {}));
  });


  describe("#content", function() {

    describe("when setting the content using a string", () => it("sets the value of the element", function() {}));

    describe("when setting the content using an object (with a selection)", function() {

      it("sets the value of the element", function() {});

      return it("selects using the selection start/end from the object", function() {});
    });

    return describe("when getting the content", () => it("returns the element value", function() {}));
  });


  describe("#togglePreview", function() {

    describe("when not previewing", function() {

      it("sets the value of the preview element to the html from the markdown converter", function() {});

      it("shows the preview element", function() {});

      return it("hides the element", function() {});
    });

    return describe("when previewing", function() {

      it("hides the preview element", function() {});

      return it("shows the element", function() {});
    });
  });


  describe("#execCommand", function() {

    it("calls resize", function() {});

    return describe("when a handler exists", () => it("calls it if one is defined in actions", function() {}));
  });


  describe("#htmlAndSelection", () => it("returns an object with the content and the selection start/end", function() {}));


  describe("#pushHistory", function() {

    it("clears the history timeout", function() {});

    it("immediately pushes to the history buffer", function() {});

    it("remembers the last key pressed if one was passed", function() {});

    describe("when pressing enter, delete, or backspace", function() {

      it("immediately pushes to the history buffer", function() {});

      return it("only pushes once for each keyCode (eg. enter enter enter results in one push)", function() {});
    });

    return describe("when pressing any other key", () => it("waits for 2.5 seconds and then pushes to the history buffer", function() {}));
  });


  describe("#selection", () => it("returns a new instance of the selection helper class", function() {}));


  describe("#resize", function() {});


  return describe("#snippets", function() {});
});



describe("window.Mercury.Regions.Markdown.actions", function() {

  beforeEach(() => fixture.load('mercury/regions/markdown.html'));
    //@region = new window.Mercury.Regions.Markdown($('#markdown_region1'), window)
    //@actions = window.Mercury.Regions.Markdown.actions

  describe(".undo", function() {

    it("calls undo on the history buffer", function() {});

    return it("sets the contents", function() {});
  });


  describe(".redo", function() {

    it("calls redo on the history buffer", function() {});

    return it("sets the contents", function() {});
  });


  describe(".insertHTML", function() {

    it("gets the html value if it's a jQuery object", function() {});

    return it("replaces the selection with the content", function() {});
  });


  describe(".insertImage", () => it("replaces the selection with the image markup", function() {}));


  describe(".insertLink", () => it("replaces the selection with the link markup", function() {}));


  describe(".insertUnorderedList", () => it("replaces the selection with the unordered list markup", function() {}));


  describe(".insertOrderedList", () => it("replaces the selection with the ordered list markup", function() {}));


  describe(".style", () => it("wraps the selection in a span tag with a given class", function() {}));


  describe(".formatblock", function() {

    it("unwraps the line of the selection of any block format markup", function() {});

    return it("wraps the line of the selection with the given block format markup", function() {});
  });


  describe(".bold", () => it("wraps the selection in the bold markup (**)", function() {}));


  describe(".italic", () => it("wraps the selection in the italics markup (_)", function() {}));


  describe(".subscript", () => it("wraps the selection in a sub tag", function() {}));


  describe(".superscript", () => it("wraps the selection in a sup tag", function() {}));


  describe(".indent", () => it("adds a > to the front of the line", function() {}));


  describe(".outdent", () => it("removes a > from the front of the line", function() {}));


  describe(".horizontalRule", () => it("replaces the selection with the hr markup (- - -)", function() {}));


  return describe(".insertSnippet", () => it("replaces the selection with the content returned from the snippets getText", function() {}));
});
