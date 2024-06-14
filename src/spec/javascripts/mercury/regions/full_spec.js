/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.Regions.Full", function() {

  beforeEach(function() {
    fixture.load('mercury/regions/full.html');
    return this.regionElement = $('#full_region1');
  });

  describe("constructor", function() {

    beforeEach(function() {
      this.buildSpy = spyOn(window.Mercury.Regions.Full.prototype, 'build').andCallFake(() => {});
      return this.bindEventsSpy = spyOn(window.Mercury.Regions.Full.prototype, 'bindEvents').andCallFake(() => {});
    });

    it("expects an element and window", function() {
      this.region = new window.Mercury.Regions.Full(this.regionElement, window);
      expect(this.region.element.get(0)).toEqual($('#full_region1').get(0));
      return expect(this.region.window).toEqual(window);
    });

    it("accepts options", function() {
      this.region = new window.Mercury.Regions.Full(this.regionElement, window, {foo: 'something'});
      return expect(this.region.options).toEqual({foo: 'something'});
    });

    it("sets it's type", function() {
      this.region = new window.Mercury.Regions.Full(this.regionElement, window);
      return expect(this.region.type()).toEqual('full');
    });

    it("calls build", function() {
      this.region = new window.Mercury.Regions.Full(this.regionElement, window);
      return expect(this.buildSpy.callCount).toEqual(1);
    });

    return it("calls bindEvents", function() {
      this.region = new window.Mercury.Regions.Full(this.regionElement, window);
      return expect(this.bindEventsSpy.callCount).toEqual(1);
    });
  });


  describe("#build", function() {

    it("sets the content to &nbsp; if the content is blank [mozilla only]", function() {});

    it("sets the current overflow to the element data", function() {});

    it("resets the elements overflow to auto", function() {});

    it("sets the container to have special handling if it's not a div [mozilla only]", function() {});

    it("turns on contentEditable", function() {});

    it("sets the version to 1 on any snippets within it", function() {});

    it("enables and disables some basic contentEditable features (only once)", function() {});

    return it("sets mercuryEditing on the document", function() {});
  });


  describe("observed events", function() {

    describe("custom event: region:update", function() {

      it("sets a timeout and forces a selection", function() {});

      it("sets up the table editor if we're in a table", function() {});

      it("displays a tooltip if the selection is within an anchor", function() {});

      it("hides the tooltip if the selection is not within an anchor", function() {});

      it("does nothing if previewing", function() {});

      return it("does nothing if it's not the active region", function() {});
    });

    describe("custom event: possible:drop", function() {

      it("does nothing if previewing", function() {});

      return describe("when a snippet image is in the content", function() {

        it("calls focus", function() {});

        it("calls displayOptionsFor for the snippet", function() {});

        return it("calls the native undo", function() {});
      });
    });

    describe("dragenter", function() {

      it("does nothing if previewing", function() {});

      return it("prevents the default action if shift is pressed", function() {});
    });

    describe("dragover", function() {

      it("does nothing if previewing", function() {});

      return it("prevents the default action if shift is pressed", function() {});
    });

    describe("drop", function() {

      it("triggers the possible:drop event in a setTimeout", function() {});

      it("does nothing if previewing", function() {});

      return describe("when a file is dropped", function() {

        it("prevents the default action", function() {});

        it("calls focus", function() {});

        return it("loads the uploader", function() {});
      });
    });

    describe("paste", function() {

      it("tells mercury that changes have been made", function() {});

      // mozilla: doesn't seem to handle pasting in elements besides divs.
      it("prevents the default if it's a special container", function() {});

      it("calls handle paste with the pre-paste content in a setTimeout", function() {});

      it("does nothing if previewing", function() {});

      return it("does nothing if it's not the active region", function() {});
    });

    describe("focus", function() {

      it("sets the active region", function() {});

      it("forces a selection", function() {});

      it("triggers a region:focused event", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("blur", function() {

      it("triggers a region:blurred event", function() {});

      it("hides the tooltip", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("click", () => it("sets anchor targets to top if previewing", function() {}));

    describe("dblclick", function() {

      it("does nothing if previewing", function() {});

      return describe("on an image", function() {

        it("selects the image element", function() {});

        return it("triggers the button event with the insertMedia action", function() {});
      });
    });

    describe("mouseup", function() {

      it("calls pushHistory", function() {});

      it("triggers the region:update event", function() {});

      return it("does nothing if previewing", function() {});
    });

    describe("keydown", function() {

      it("does nothing if previewing", function() {});

      it("tells mercury that changes have been made", function() {});

      it("calls pushHistory", function() {});

      it("calls execCommand with undo on meta+z", function() {});

      it("calls execCommand with redo on shift+meta+z", function() {});

      describe("pressing enter in a list", function() {

        it("prevents the default event", function() {});
        return it("calls execCommand with insertLineBreak", function() {});
      });

      describe("pressing enter when it's a special container (not a div)", function() {

        it("prevents the default event", function() {});
        return it("calls execCommand with insertHTML and <br/>", function() {});
      });

      describe("pressing tab", () => it("calls execCommand with inserHTML and two spaces", function() {}));

      describe("pressing tab in a list", function() {

        it("calls execCommand with indent", function() {});

        it("calls execCommand with outdent if shift is used", function() {});

        return it("doesn't call execCommand with inserHTML and two spaces", function() {});
      });

      return describe("with common actions", function() {

        it("calls execCommand with bold on meta+b", function() {});

        it("calls execCommand with italic on meta+i", function() {});

        return it("calls execCommand with underline on meta+u", function() {});
      });
    });

    return describe("keyup", function() {

      it("triggers the region:update event", function() {});

      return it("does nothing if previewing", function() {});
    });
  });


  describe("#focus", function() {

    describe("if this isn't the active region", function() {

      it("calls focus on the element", function() {});

      return it("collapses the selection", function() {});
    });

    it("sets a timeout that forces the selection", function() {});

    return it("triggers the region:update event", function() {});
  });


  describe("#content", function() {

    describe("when setting the content", function() {

      it("sanitizes the html (in case there's anything malformed)", function() {});

      it("fills in any snippets with their stored content", function() {});

      it("sets the html", function() {});

      return it("creates a selection if there's markers", function() {});
    });

    return describe("when getting the content", function() {

      it("removes any meta tags", function() {});

      it("places markers if asked", function() {});

      it("sanitizes the html (in case there's anything malformed)", function() {});

      it("replaces the snippet contents with an identifier if asked", function() {});

      return it("returns the content", function() {});
    });
  });


  describe("#togglePreview", function() {

    describe("when not previewing", function() {

      it("replaces the content with whatever the content is", function() {});

      it("turns contentEditable off", function() {});

      it("sets the overflow back to what was stored on the element", function() {});

      return it("blurs the element", function() {});
    });

    return describe("when previewing", function() {

      it("turns contentEditable on", function() {});

      return it("sets the overflow to auto", function() {});
    });
  });


  describe("#execCommand", function() {

    describe("when a handler exists", function() {

      it("calls it if one is defined in window.Mercury.config.behaviors", function() {});

      return it("calls it if one is defined in actions", function() {});
    });

    return describe("when a handler doesn't exist", function() {

      it("gets the html value of a jQuery element if one is passed in with the insertHTML action", function() {});

      it("calls the native execCommand", function() {});

      // mozilla has a weird bug when indenting.. if there's only one element in the region it will put the blockquote
      // outside the region, so we have to remove it so it seems like nothing happened.
      return it("removes the previous sibling if it doesn't match what used to be there on indent [mozilla only]", function() {});
    });
  });


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


  describe("#path", function() {

    it("returns an array of parents from the element with the selection to the region element", function() {});

    return it("returns an empty array if there's no selection", function() {});
  });


  describe("#currentElement", function() {

    it("returns the element that's closest to the node or element with the selection", function() {});

    return it("returns an empty array if there's no selection", function() {});
  });


  return describe("#handlePaste", function() {});
});



describe("window.Mercury.Regions.Full.actions", function() {

  beforeEach(() => fixture.load('mercury/regions/full.html'));
    //@region = new window.Mercury.Regions.Full($('#full_region1'), window)
    //@actions = window.Mercury.Regions.Full.actions

  //
  // behaviors
  //

  describe("*horizontalRule", () => it("replaces the selection with an hr tag", function() {}));


  describe("*htmlEditor", () => it("opens a modal", function() {}));

  //
  // native actions
  //

  describe("-formatblock", () => it("wraps the line of the selection in a given tag", function() {}));


  describe("-foreColor", () => it("wraps the selection in a span styled with the color", function() {}));


  describe("-bold", () => it("wraps the selection in a strong or s tag", function() {}));


  describe("-italic", () => it("wraps the selection in an em or i tag", function() {}));


  describe("-strikethrough", () => it("wraps the selection in a strike tag", function() {}));


  describe("-underline", () => it("wraps the selection in a u tag", function() {}));


  describe("-subscript", () => it("wraps the selection in a sub tag", function() {}));


  describe("-superscript", () => it("wraps the selection in a sup tag", function() {}));


  describe("-justifyLeft", () => it("justifies the text to the left", function() {}));


  describe("-justifyCenter", () => it("justifies the test to be in the center", function() {}));


  describe("-justifyRight", () => it("justifies the text to the right", function() {}));


  describe("-justifyFull", () => it("styles the text to be fully justified", function() {}));


  describe("-insertUnorderedList", () => it("wraps the line of the selection in an unordered list", function() {}));


  describe("-insertOrderedList", () => it("wraps the line of the selection in an ordered list", function() {}));


  describe("-outdent", () => it("unwraps the line of the selection in a blockquote tag", function() {}));


  describe("-indent", () => it("wraps the line of the selection in a blockquote tag", function() {}));

  //
  // custom actions
  //

  describe(".undo", function() {

    it("calls undo on the history buffer", function() {});

    return it("sets the contents", function() {});
  });


  describe(".redo", function() {

    it("calls redo on the history buffer", function() {});

    return it("sets the contents", function() {});
  });


  describe(".style", () => it("wraps the selection in a span tag with a given class", function() {}));


  describe(".backColor", () => it("wraps the selection in a span styled with the background color", function() {}));


  describe(".removeFormatting", () => it("replaces the selection with the text content of the selection", function() {}));


  describe(".overline", () => it("wraps the selection in a span styled with an overline", function() {}));


  describe(".insertRowBefore", () => it("calls addRow on the table editor", function() {}));


  describe(".insertRowAfter", () => it("calls addRow on the table editor", function() {}));


  describe(".deleteRow", () => it("calls removeRow on the table editor", function() {}));


  describe(".insertColumnBefore", () => it("calls addColumn on the table editor", function() {}));


  describe(".insertColumnAfter", () => it("calls addColumn on the table editor", function() {}));


  describe(".deleteColumn", () => it("calls removeColumn on the table editor", function() {}));


  describe(".increaseColspan", () => it("calls increaseColspan on the table editor", function() {}));


  describe(".decreaseColspan", () => it("calls decreaseColspan on the table editor", function() {}));


  describe(".increaseRowspan", () => it("calls increaseRowspan on the table editor", function() {}));


  describe(".decreaseRowspan", () => it("calls decreaseRowspan on the table editor", function() {}));


  describe(".replaceHTML", () => it("sets the content", function() {}));


  describe(".insertImage", () => it("replaces the selection with an image tag", function() {}));


  describe(".insertLink", () => it("inserts a link node", function() {}));


  describe(".replaceLink", function() {

    it("selects the anchor tag that we're going to replace", function() {});

    return it("replaces the selection with an anchor tag", function() {});
  });


  describe(".insertSnippet", function() {

    it("selects any snippets that have the same identity", function() {});

    return it("replaces the selection with the content returned from the snippets getHTML", function() {});
  });


  describe(".editSnippet", function() {

    it("does nothing if there's no snippet being hovered over", function() {});

    return it("calls displayOntions for the snippet", function() {});
  });


  return describe(".removeSnippet", function() {

    it("calls remove on the snippet element", function() {});

    return it("fires a hide:toolbar event", function() {});
  });
});
