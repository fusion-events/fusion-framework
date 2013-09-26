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


})( $.fn.fusion );