/*

    multitouch.enchant.js
    enchant.js multitouch control plugin
    2013/07/12
    This program is MIT lisence.

*/

enchant();

enchant.MultiTouch = enchant.Class.create(enchant.Group, {

    // Touch ID counter.
    touchID: 0,

    // List of touch.
    touchList: null,

    // Multi-Touch enable flag.
    enableMultiTouch: false,

    // Parent Scene
    scene: null,

    initialize: function(scene) {
        enchant.Group.call(this);

        this.scene = scene;
        this.touchID = 0;
        this.touchList = [];

        //Multi-touch enabled flag
        this.enableMultiTouch = false;

        //It operates as a single-touch except iOS and Android
        if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0) {
            this.enableMultiTouch = true;
        } else if (navigator.userAgent.indexOf('Android') > 0) {
            this.enableMultiTouch = true;
        } else {
            this.enableMultiTouch = false;
        }

        // Event listner for parent scene.
        var self = this;

        // Intercept touchstart to touchesstart.
        scene.addEventListener("touchstart", function(e) {
            if (self.enableMultiTouch) {
                self.touchList.push({ id: self.touchID, x: e.x, y: e.y, time: 0 });
                e.ID = self.touchID;
                this.ontouchesstart(e);
                self.touchID++;
            } else {
                self.touchList[0] = { id: 0, x: e.x, y: e.y, time: 0 };
                e.ID = 0;
                this.ontouchesstart(e);
            }
        });

        // Intercept touchmove to touchesmove.
        scene.addEventListener("touchmove", function(e) {
            if (self.enableMultiTouch) {
                var min = 99999999;
                var target = 9999;
                for (var i = 0, len = self.touchList.length; i < len; i++) {
                    var x = e.x - self.touchList[i].x;
                    var y = e.y - self.touchList[i].y;
                    var dis = (x*x+y*y);
                    if (dis < min) {
                        target = i;
                        min = dis;
                    }
                }
                self.touchList[target].x = e.x;
                self.touchList[target].y = e.y;

                e.ID = self.touchList[target].id;
                e.time = self.touchList[target].time+1;
                this.ontouchesmove(e);
            } else {
                self.touchList[0] = {id:0, x: e.x, y: e.y};
                e.ID = 0;
                this.ontouchesmove(e);
            }
        });

        // Intercept touchend to touchesend.
        scene.addEventListener("touchend",function(e) {
            if (self.enableMultiTouch) {
                var min = 99999999;
                var target = 9999;
                for (var i = 0, len = self.touchList.length; i < len; i++) {
                    var x = e.x - self.touchList[i].x;
                    var y = e.y - self.touchList[i].y;
                    var dis = (x*x+y*y);
                    if (dis < min) {
                        target = i;
                        min = dis;
                    }
                }
                self.touchList[target].x = e.x;
                self.touchList[target].y = e.y;

                e.ID = self.touchList[target].id;
                e.time = self.touchList[target].time+1;
                this.ontouchesmove(e);
            } else {
                self.touchList[0] = {id:0, x: e.x, y: e.y};
                e.ID = 0;
                this.ontouchesmove(e);
            }
        });
    },

    // Number of touch
    numTouches: function() {
        return this.touchList.length;
    },

    getTouchesList: function() {
        return this.touchList;
    },

    // Force reset multi-touch
    reset: function() {
        this.touchID = 0;
        this.touchList = [];
    },
});

MultiTouch = enchant.MultiTouch;


