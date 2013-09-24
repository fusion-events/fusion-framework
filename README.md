fusion-framework
================

The Fusion Javascript Event Framework

Version: 1.0.0


DISCLAIMER
==========

As of right now, this framework only supports custom events.
You cannot use this for events that are meant to be bound to elements.


Requirements
============

This framework requires jQuery 1.9 or higher.

To Use
======


#### Creating Events

Right now, there are only two built in events. `DOCUMENT_LOAD`, and `DOCUMENT_UNLOAD`.
To use your own custom events, you need to add them to the event list, which can be done as follows:

```js
( function( fusion ) {
    fusion.events.add( 'SOME_EVENT_NAME', fusion.event.extend( { somevar: null } ) );

    // You can store those in classes too. For example, the DOCUMENT_LOAD stuff
    var func = fusion.event.extend( {
		window: window,
		document: document
    } );

    fusion.events.add( 'DOCUMENT_LOAD', func );

} )( $.fn.fusion );
```


#### Binding Events (with priorities)

To bind to these events, we will be using the `fuse` method. Pretty simple, from the demo app:

You can get to the event's data with `event.getData( [key] )`.

```js
// Note, by default $f is an alias of $.fn.fusion

// Create your first event. This has a default priority of 50.
$f.fuse( 'DOCUMENT_LOAD', function( event ) {
    event.getData( 'window' ).location.href += "#test";
} );

// Later down the line in your app, you want something bound before the above.
// So we create another bind, but set the priority to something lower than 50 (5 here).
$f.fuse( 'DOCUMENT_LOAD', function( event ) {
    event.getData( 'window' ).location.href += "#highesttest";
}, 5 );

// Even later down, we want something bound after the other two events.
// So we create another bind, but set the priority to something higher than 50 (70 here).
$f.fuse( 'DOCUMENT_LOAD', function( event ) {
    event.getData( 'window' ).location.href += "#test";
}, 70 );
```

You now have three binds on the `DOCUMENT_LOAD` event.



#### Firing Events

To fire these events, just call the `ignite` method, and pass in the event class's variables. Super simple.

For example, the `DOCUMENT_LOAD` and `DOCUMENT_UNLOAD` events.

```js
$(function () {
    fusion.ignite( 'DOCUMENT_LOAD', { window: window, cheese: 'cheese' } );
    $( document ).unload( function( ) {
        fusion.ignite( 'DOCUMENT_UNLOAD', { window: window } );
    } )
});
```

If you noticed, as a test, I've added `cheese: 'cheese'` to the `DOCUMENT_LOAD` event, to see if you could access that on the page.
You can test this yourself, but in the binds, you wont be able to access the `cheese` data, because it was never in the class properties.


Contributions
=============

If you would like to help with contributing, please do! Just fork this code, make your changes and put in a pull request.
I would love for this framework to work with element bound events, but I don't have enough time to figure that out.
