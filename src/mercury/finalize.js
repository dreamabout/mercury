// tell everyone that window.Mercury has loaded
if (window.Mercury.onload) { window.Mercury.onload(); }
jQuery(window).trigger('mercury:loaded');
