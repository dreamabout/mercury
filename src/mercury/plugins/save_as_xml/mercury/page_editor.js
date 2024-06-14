/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.PageEditor = class PageEditor extends window.window.Mercury.PageEditor {

  save() {
    let left, method;
    const url = (left = this.saveUrl != null ? this.saveUrl : window.window.Mercury.saveUrl) != null ? left : this.iframeSrc();
    const data = this.serializeAsXml();
    console.log('saving', data);
    return;
    if (this.options.saveMethod === 'PUT') { method = 'PUT'; }
    return jQuery.ajax(url, {
      headers: window.window.Mercury.ajaxHeaders(),
      type: method || 'POST',
      dataType: 'xml',
      data,
      success: () => {
        return window.window.Mercury.changes = false;
      },
      error: () => {
        return alert(`window.Mercury was unable to save to the url: ${url}`);
      }
    });
  }

  serializeAsXml() {
    const data = this.serialize();
    const regionNodes = [];
    for (var regionName in data) {
      var regionProperties = data[regionName];
      var snippetNodes = [];
      for (var snippetName in regionProperties['snippets']) {
        var snippetProperties = regionProperties['snippets'][snippetName];
        snippetNodes.push(`<${snippetName} name=\"${snippetProperties['name']}\"><![CDATA[${jQuery.toJSON(snippetProperties['options'])}]]></${snippetName}>`);
      }
      regionNodes.push(`<region name=\"${regionName}\" type=\"${regionProperties['type']}\"><value>\n<![CDATA[${regionProperties['value']}]]>\n</value><snippets>${snippetNodes.join('')}</snippets></region>`);
    }
    return `<regions>${regionNodes.join('')}</regions>`;
  }
};
