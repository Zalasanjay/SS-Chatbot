'use strict';

(function ($) {
	var initLayout = function initLayout() {
		var hash = window.location.hash.replace('#', '');
		var currentTab = $('ul.navigationTabs a').bind('click', showTab).filter('a[rel=' + hash + ']');
		if (currentTab.size() == 0) {
			currentTab = $('ul.navigationTabs a:first');
		}
		showTab.apply(currentTab.get(0));
		$('#colorpickerHolder').ColorPicker({ flat: true });
		$('#colorpickerHolder2').ColorPicker({
			flat: true,
			color: '#00ff00',
			onSubmit: function onSubmit(hsb, hex, rgb) {
				$('#colorSelector2 div').css('backgroundColor', '#' + hex);
			}
		});
		$('#colorpickerHolder2>div').css('position', 'absolute');
		var widt = false;
		$('#colorSelector2').bind('click', function () {
			$('#colorpickerHolder2').stop().animate({ height: widt ? 0 : 173 }, 500);
			widt = !widt;
		});
		$('#colorpickerField1, #colorpickerField2, #colorpickerField3').ColorPicker({
			onSubmit: function onSubmit(hsb, hex, rgb, el) {
				$(el).val(hex);
				$(el).ColorPickerHide();
			},
			onBeforeShow: function onBeforeShow() {
				$(this).ColorPickerSetColor(this.value);
			}
		}).bind('keyup', function () {
			$(this).ColorPickerSetColor(this.value);
		});
		$('#colorSelector').ColorPicker({
			color: '#0000ff',
			onShow: function onShow(colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function onHide(colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function onChange(hsb, hex, rgb) {
				$('#colorSelector div').css('backgroundColor', '#' + hex);
			}
		});
	};

	var showTab = function showTab(e) {
		var tabIndex = $('ul.navigationTabs a').removeClass('active').index(this);
		$(this).addClass('active').blur();
		$('div.tab').hide().eq(tabIndex).show();
	};

	EYE.register(initLayout, 'init');
})(jQuery);