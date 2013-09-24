/**
 * @author Aaron Scherer <aequasi@gmail.com>
 * @date 9/24/13
 * @copyright Aaron Scherer 2013
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		window: window,
		document: document
	} );

	fusion.events.add( 'DOCUMENT_LOAD', func );
	fusion.events.add( 'DOCUMENT_UNLOAD', func );


})( $.fn.fusion );