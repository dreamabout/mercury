/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
String.prototype.titleize = function() {
  return this[0].toUpperCase() + this.slice(1);
};


String.prototype.toHex = function() {
  if (this[0] === '#') { return this; }
  return this.replace(/rgb(a)?\(([0-9|%]+)[\s|,]?\s?([0-9|%]+)[\s|,]?\s?([0-9|%]+)[\s|,]?\s?([0-9|.|%]+\s?)?\)/gi, (x, alpha, r, g, b, a) => `#${parseInt(r).toHex()}${parseInt(g).toHex()}${parseInt(b).toHex()}`);
};


String.prototype.regExpEscape = function() {
  const specials = ['/','.','*','+','?','|','(',')','[',']','{','}','\\'];
  const escaped = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
  return this.replace(escaped, '\\$1');
};


String.prototype.printf = function() {
  const chunks = this.split('%');
  let result = chunks[0];
  const re = /^([sdf])([\s\S%]*)$/;
  let offset = 0;
  for (let index = 0; index < chunks.length; index++) {
    var chunk = chunks[index];
    var p = re.exec(chunk);
    if ((index === 0) || !p || (arguments[index] === null)) {
      if (index > 1) {
        offset += 2;
        result += `%${chunk}`;
      }
      continue;
    }
    var arg = arguments[(index - 1) - offset];
    switch (p[1]) {
      case 's': result += arg; break;
      case 'd': case 'i': result += parseInt(arg.toString(), 10); break;
      case 'f': result += parseFloat(arg); break;
    }
    result += p[2];
  }
  return result;
};


Number.prototype.toHex = function() {
  const result = this.toString(16).toUpperCase();
  if (result[1]) { return result; } else { return `0${result}`; }
};


Number.prototype.toBytes = function() {
  let bytes = parseInt(this);
  let i = 0;
  while (1023 < bytes) {
    bytes /= 1024;
    i += 1;
  }
  if (i) { return `${bytes.toFixed(2)}${['', ' kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb'][i]}`; } else { return `${bytes} bytes`; }
};
