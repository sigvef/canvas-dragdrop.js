canvas-dragdrop.js
==================

Make any object on a HTML5 canvas draggable/droppable. Objects must have a property "position", which must be an object containing at least the keys "x" and "y", holding the position of the object. Objects must also have a property "size", which must be an object containing at least the keys "w" and "h" holding the width and height of the object. Position will be altered by canvas-dragdrop, size will not be.

Example usage:

    /** set up some objects **/

    var an_object = {
                        position:{x:10,y:20},
                        size:{w:10,h:20},
                        /* .. other variables and stuff */
                    };

    var other_object =  {
                            position:{x:10,y:20},
                            size:{w:10,h:20},
                            /* .. other variables and stuff */
                        };


    /** set up the CanvasDragDrop module, and hook up callbacks **/

    /* canvas is a DOM reference to a html5 canvas */
    var cdd = new CanvasDragDrop(canvas);

    cdd.makeDraggable(an_object,{

        /* all callbacks are optional */
        "dragstart":function(e){
            /* "this" is a reference to an_object in the callbacks */
        },

        "dragmove":function(e){

        },

        "dragend":function(e){

        }
    });

    cdd.makeDroppable(other_object,{
        "drop":function(e){
            /* "this" is a reference to other_object here */
        }
    });
