/**
 * Document Events
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		window: window,
		document: document
	} );

	fusion.events.add( 'DOCUMENT_LOAD', func );
	fusion.events.add( 'DOCUMENT_UNLOAD', func );


	/**
	 * Triggers
	 */
	$( function() {
		fusion.ignite( 'DOCUMENT_LOAD', { window: window, document: document } );
		$( document ).unload( function() {
			fusion.ignite( 'DOCUMENT_UNLOAD', { window: window, document: document } );
		} )
	} );

})( $.fn.fusion );