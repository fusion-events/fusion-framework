/**
 * Input Events
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		input: null
	} );

	fusion.events.add( 'INPUT_BLUR', func );
	fusion.events.add( 'INPUT_FOCUS', func );
	fusion.events.add( 'INPUT_FOCUS_IN', func );
	fusion.events.add( 'INPUT_FOCUS_OUT', func );
	fusion.events.add( 'INPUT_CHANGE', func );
	fusion.events.add( 'INPUT_CLICK', func );
	//fusion.events.add( 'INPUT_DOUBLE_CLICK', func );
	fusion.events.add( 'INPUT_HOVER', func );
	//fusion.events.add( 'INPUT_MOUSE_DOWN', func );
	//fusion.events.add( 'INPUT_MOUSE_ENTER', func );
	//fusion.events.add( 'INPUT_MOUSE_LEAVE', func );
	//fusion.events.add( 'INPUT_MOUSE_MOVE', func );
	//fusion.events.add( 'INPUT_MOUSE_OUT', func );
	//fusion.events.add( 'INPUT_MOUSE_OVER', func );
	//fusion.events.add( 'INPUT_MOUSE_UP', func );


	func = fusion.event.extend( {
		input: null,
		key: null
	} );
	fusion.events.add( 'INPUT_KEY_PRESS', func );
	fusion.events.add( 'INPUT_KEY_UP', func );
	fusion.events.add( 'INPUT_KEY_DOWN', func );


	/**
	 * Triggers
	 */
	$( function() {
		$( document ).on( 'blur', ':input', function() {
			fusion.ignite( 'INPUT_BLUR', { input: this } );
		} );
		$( document ).on( 'focus', ':input', function() {
			fusion.ignite( 'INPUT_FOCUS', { input: this } );
		} );
		$( document ).on( 'focusin', ':input', function() {
			fusion.ignite( 'INPUT_FOCUS_IN', { input: this } );
		} );
		$( document ).on( 'focusout', ':input', function() {
			fusion.ignite( 'INPUT_FOCUS_OUT', { input: this } );
		} );
		$( document ).on( 'change', ':input', function() {
			fusion.ignite( 'INPUT_CHANGE', { input: this } );
		} );
		$( document ).on( 'click', ':input', function() {
			fusion.ignite( 'INPUT_CLICK', { input: this } );
		} );
		/*$( document ).on( 'dblclick', ':input', function() {
			fusion.ignite( 'INPUT_DOUBLE_CLICK', { input: this } );
		} );*/
		$( document ).on( 'hover', ':input', function() {
			fusion.ignite( 'INPUT_HOVER', { input: this } );
		} );
		/*$( document ).on( 'mousedown', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_DOWN', { input: this } );
		} );
		$( document ).on( 'mouseenter', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_ENTER', { input: this } );
		} );
		$( document ).on( 'mouseleave', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_LEAVE', { input: this } );
		} );
		$( document ).on( 'mousemove', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_MOVE', { input: this } );
		} );
		$( document ).on( 'mouseout', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_OUT', { input: this } );
		} );
		$( document ).on( 'mouseover', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_OVER', { input: this } );
		} );
		$( document ).on( 'mouseup', ':input', function() {
			fusion.ignite( 'INPUT_MOUSE_UP', { input: this } );
		} );*/


		$( document ).on( 'keypress', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEY_PRESS', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
		$( document ).on( 'keyup', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEY_UP', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
		$( document ).on( 'keydown', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEY_DOWN', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
	} );

})( $.fn.fusion );
