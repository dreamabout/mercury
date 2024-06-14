/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// ## Require all the dependencies
//= require mercury/dependencies/jquery-ui-1.8.13.custom
//= require mercury/dependencies/jquery.additions
//= require mercury/dependencies/jquery.htmlClean
//= require mercury/dependencies/liquidmetal
//= require mercury/dependencies/showdown
//
// ## Require all mercury files
//= require_self
//= require ./native_extensions
//= require ./page_editor
//= require ./history_buffer
//= require ./table_editor
//= require ./dialog
//= require ./palette
//= require ./select
//= require ./panel
//= require ./modal
//= require ./lightview
//= require ./statusbar
//= require ./toolbar
//= require ./toolbar.button
//= require ./toolbar.button_group
//= require ./toolbar.expander
//= require ./tooltip
//= require ./snippet
//= require ./snippet_toolbar
//= require ./region
//= require ./uploader
//= require_tree ./regions
//= require_tree ./dialogs
//= require_tree ./modals
//= require ./finalize
//
if (!window.Mercury) { window.Mercury = {}; }
jQuery.extend(window.Mercury, {
  version: '0.9.0',

  // window.Mercury object namespaces
  Regions: window.Mercury.Regions || {},
  modalHandlers: window.Mercury.modalHandlers || {},
  lightviewHandlers: window.Mercury.lightviewHandlers || {},
  dialogHandlers: window.Mercury.dialogHandlers || {},
  preloadedViews: window.Mercury.preloadedViews || {},

  // Custom ajax headers
  ajaxHeaders() {
    const headers = {};
    headers[window.Mercury.config.csrfHeader] = window.Mercury.csrfToken;
    return headers;
  },


  // Custom event methods
  on(eventName, callback) {
    return jQuery(window).on(`mercury:${eventName}`, callback);
  },


  off(eventName, callback) {
    return jQuery(window).off(`mercury:${eventName}`, callback);
  },


  one(eventName, callback) {
    return jQuery(window).one(`mercury:${eventName}`, callback);
  },


  trigger(eventName, options) {
    window.Mercury.log(eventName, options);
    return jQuery(window).trigger(`mercury:${eventName}`, options);
  },


  // Alerting and logging methods
  notify(...args) {
    return window.alert(window.Mercury.I18n.apply(this, args));
  },


  warn(message, severity) {
    if (severity == null) { severity = 0; }
    if (console) {
      try { return console.warn(message); }
      catch (e1) {
        if (severity >= 1) {
          try { return console.debug(message); } catch (e2) {}
        }
      }
    } else if (severity >= 1) {
      return window.Mercury.notify(message);
    }
  },


  deprecated(message){
    if (console && console.trace) { message = `${message} -- ${console.trace()}`; }
    //throw "deprecated: #{message}"
    return window.Mercury.warn(`deprecated: ${message}`, 1);
  },


  log() {
    if (window.Mercury.debug && console) {
      if ((arguments[0] === 'hide:toolbar') || (arguments[0] === 'show:toolbar')) { return; }
      try { return console.debug(arguments); }
      catch (e) {}
    }
  },


  // I18n / Translation methods
  locale() {
    let subLocale, topLocale;
    if (window.Mercury.determinedLocale) { return window.Mercury.determinedLocale; }
    if (window.Mercury.config.localization.enabled) {
      let locale = [];
      if (navigator.language && (locale = navigator.language.toString().split('-')).length) {
        topLocale = window.Mercury.I18n[locale[0]] || {};
        subLocale = locale.length > 1 ? topLocale[`_${locale[1].toUpperCase()}_`] : undefined;
      }
      if (!window.Mercury.I18n[locale[0]]) {
        locale = window.Mercury.config.localization.preferredLocale.split('-');
        topLocale = window.Mercury.I18n[locale[0]] || {};
        subLocale = locale.length > 1 ? topLocale[`_${locale[1].toUpperCase()}_`] : undefined;
      }
    }
    return window.Mercury.determinedLocale = {top: topLocale || {}, sub: subLocale || {}};
  },


  I18n(sourceString, ...args) {
    const locale = window.Mercury.locale();
    const translation = (locale.sub[sourceString] || locale.top[sourceString] || sourceString || '').toString();
    if (args.length) { return translation.printf.apply(translation, args); } else { return translation; }
  }
}
);
