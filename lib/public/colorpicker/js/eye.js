"use strict";

/**
 *
 * Zoomimage
 * Author: Stefan Petre www.eyecon.ro
 * 
 */
(function ($) {
	var EYE = window.EYE = function () {
		var _registered = {
			init: []
		};
		return {
			init: function init() {
				$.each(_registered.init, function (nr, fn) {
					fn.call();
				});
			},
			extend: function extend(prop) {
				for (var i in prop) {
					if (prop[i] != undefined) {
						this[i] = prop[i];
					}
				}
			},
			register: function register(fn, type) {
				if (!_registered[type]) {
					_registered[type] = [];
				}
				_registered[type].push(fn);
			}
		};
	}();
	$(EYE.init);
})(jQuery);