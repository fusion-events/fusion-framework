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
	fusion.events.add( 'INPUT_CHANGE', func );


	func = fusion.event.extend( {
		input: null,
		key: null
	} );
	fusion.events.add( 'INPUT_KEYUP', func );
	fusion.events.add( 'INPUT_KEYDOWN', func );


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
		$( document ).on( 'change', ':input', function() {
			fusion.ignite( 'INPUT_CHANGE', { input: this } );
		} );
		$( document ).on( 'keyup', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEYUP', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
		$( document ).on( 'keydown', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEYDOWN', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
	} );

})( $.fn.fusion );