function CanvasDragDrop(canvas){
    this.canvas = canvas;
    this.draggables = [];
    this.droppables = [];
    this.dragged = undefined;
    this.xoffset = 0;
    this.yoffset = 0;

    var that = this;
    this.canvas.addEventListener("mousedown", function(e){
        /* find element under mouse position */
        var coords = that.relMouseCoords(e);
        /* if there is an element, set as only item being dragged */
        for(var i=0;i<that.draggables.length;i++){
            var draggable = that.draggables[i];
            if(that.contains(draggable.obj, coords)){
                /* defensively check if anything is already being dragged */
                if(that.dragged){
                    e.draggable = that.dragged.obj;
                    (that.dragged.callbacks["dragend"]||function(){}).call(that.dragged.obj,e);
                }
                that.dragged = draggable;
                that.xoffset = -draggable.obj.position.x + coords.x;
                that.yoffset = -draggable.obj.position.y + coords.y;
                e.draggable = that.dragged.obj;
                (that.dragged.callbacks["dragstart"]||function(e){}).call(draggable.obj,e);
                break;
            }
        }
    });

    this.canvas.addEventListener("mousemove", function(e){
        /* if any element is being dragged, update position */
        if(that.dragged){
            e.draggable = that.dragged.obj;
            var coords = that.relMouseCoords(e);
            that.dragged.obj.position.x = coords.x-that.xoffset;
            that.dragged.obj.position.y = coords.y-that.yoffset;
            (that.dragged.callbacks["dragmove"]||function(e){}).call(that.dragged.obj,e);
        }
    });

    this.canvas.addEventListener("mouseup", function(e){
        /* if any element is being dragged, set as undragged, and see if any element has been dropped upon */
        if(that.dragged){
            var coords = that.relMouseCoords(e);
            e.draggable = that.dragged.obj;
            (that.dragged.callbacks["dragend"]||function(){}).call(that.dragged.obj,e);
            for(var i=0;i<that.droppables.length;i++){
                var droppable = that.droppables[i];
                if(that.contains(droppable.obj, coords)){
                    (droppable.callbacks["drop"]||function(){}).call(droppable.obj,e); 
                }
            }
            that.dragged = undefined;
        }
    });
}

CanvasDragDrop.prototype.contains = function(obj, point){
    /* simple AABB */
    var x = obj.position.x; var y = obj.position.y;
    var w = obj.size.w; var h = obj.size.h;
    return w>0&&h>0&&point.x>=x&&point.x<x+w&&point.y>=y&&point.y<y+h;
}


CanvasDragDrop.prototype.makeDroppable = function(obj, callbacks){
    /* check if obj is not already droppable */
    for(var i=0;i<this.droppables.length;i++){
        if(obj == this.droppables[i].obj) return;
    }
    this.droppables.push({obj:obj, callbacks:callbacks||{}});
}

CanvasDragDrop.prototype.makeDraggable = function(obj, callbacks){
    /* check if object already draggable */
    for(var i=0;i<this.draggables.length;i++){
        if(obj == this.draggables[i].obj) return;
    }
    this.draggables.push({obj:obj, callbacks:callbacks||{}});
}

CanvasDragDrop.prototype.remove = function(obj){
    for(var i=0;i<this.draggables.length;i++){
        if(obj == this.draggables[i].obj){
            for(var j in this.draggables[i].callbacks){
                this.canvas.removeEventListener(j,this.draggables[i].callbacks[j]);
            }
            Array.remove(i--);
            break;
        }
    }
    for(var i=0;i<this.droppables.length;i++){
        if(obj == this.droppables[i].obj){
            for(var j in this.draggables[i].callbacks){
                this.canvas.removeEventListener(j,this.draggables[i].callbacks[j]);
            }
            Array.remove(i--);
            break;
        }
    }
}

/* adapted from http://stackoverflow.com/a/5932203/1083927 */
CanvasDragDrop.prototype.relMouseCoords = function(e){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this.canvas;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}


/* added for convenience */

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
      var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
          return array.push.apply(array, rest);
};
