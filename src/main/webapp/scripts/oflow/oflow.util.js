(function($) {
	$.fn.extend({
		dataToForm : function(data) {
			if (data) {
				var formid = "#" + this.attr('id');
				for (prop in data) {
					if ($("[name=" + prop + "]", formid).is("input:radio")
							|| $("[name=" + prop + "]", formid).is(
									"input:checkbox")) {
						$("[name=" + prop + "]", formid).each(function() {
							if ($(this).val() == data[i]) {
								$(this).attr("checked", true);
							} else {
								$(this).attr("checked", false);
							}
						});
					} else {
						// this is very slow on big table and form.
						$("[name=" + prop + "]", formid).val(data[prop]);
					}
				}
			}
		},
		formToData : function() {
			var fields = this.serializeArray();
			var data = {};
			$.each(fields, function(i, field) {
				data[field.name] = field.value;
			});

			return data;
		},
		disableSelection : function() { // 禁止文字选择
			return this.each(function() {
				this.onselectstart = function() {
					return false;
				};
				this.unselectable = "on";
				jQuery(this).css('user-select', 'none');
				jQuery(this).css('-o-user-select', 'none');
				jQuery(this).css('-moz-user-select', 'none');
				jQuery(this).css('-khtml-user-select', 'none');
				jQuery(this).css('-webkit-user-select', 'none');
			});
		}
	});
})(jQuery);