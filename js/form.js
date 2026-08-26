
( function () {
	'use strict';

	var GROUP = '.js-cf7-features';
	var TARGET = '.js-cf7-other';

	var TRIGGER = 'Other';

	function setup( form ) {
		var group = form.querySelector( GROUP );
		var target = form.querySelector( TARGET );

		if ( ! group || ! target ) {
			return;
		}

		var boxes = group.querySelectorAll( 'input[type="radio"]' );

		if ( ! boxes.length ) {
			return;
		}

		var textarea = target.querySelector( 'textarea, input' );

		function refresh() {
			var isOn = Array.prototype.some.call( boxes, function ( box ) {
				return box.checked && box.value === TRIGGER;
			} );

			target.hidden = ! isOn;

			if ( ! isOn && textarea ) {
				textarea.value = '';
			}
		}

		Array.prototype.forEach.call( boxes, function ( box ) {
			box.addEventListener( 'change', refresh );
		} );

		refresh();

		form.addEventListener( 'wpcf7mailsent', refresh );
		form.addEventListener( 'wpcf7reset', refresh );
	}

	function init() {
		var forms = document.querySelectorAll( '.wpcf7-form' );

		Array.prototype.forEach.call( forms, setup );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();

jQuery(document).ready(function($){
    $('.form__row.form__conditional').appendTo('.fieldset .wpcf7-radio');
})