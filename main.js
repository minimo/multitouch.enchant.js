/*

    multitouch.enchant.js Sample
	2013/08/08
	This program is MIT lisence.

*/

enchant();

// randomize 0～max-1
var rand = function(max){ return ~~(Math.random() * max); }
var sec = function(s){ return ~~(s*game.fps); };
var toRad = 3.14159/180;    //degree to radian
var toDeg = 180/3.14159;    //redian to degree

window.onload = function() {
    game = new Core(320, 320);
    game.fps = 30;
    game.preload(
        'media/icon0.png', 'media/arrow.png', 'media/chara1.png'
    );

    //Keybind
    game.keybind(32,'space');

    game.onload = function(){
        main = new MainScene;
        game.pushScene(main);
    };
    game.start();
};

MainScene = enchant.Class.create(enchant.Scene, {

    // Demonstration mode
    mode: 0,

    initialize: function() {
        enchant.Scene.call(this);
        this.backgroundColor = 'rgb(0,0,0)';

        // Initialize Multi-touch.
        this.multiTouch = new MultiTouch(this);

        // Display number of touch.
        var l0 = this.l0 = new Label("number:0");
        l0.x = 10;
        l0.y = 10;
		l0.color = "#ffffff";
		l0.font = "bold";
        this.addChild(l0);

        // Display coordinate of touch.
        this.ls = [];
        for (var i = 0; i < 5; i++) {
            var lb = this.lb = new Label("");
            lb.x = 10;
            lb.y = 20+i*10;
		    lb.color = "#ffffff";
		    lb.font = "bold";
            this.addChild(lb);
            this.ls[this.ls.length] = lb;
        }

        // Line drawing preparation
        var scr = this.scr = new Sprite(320, 320);
        var srf = new Surface(320, 320);
        scr.image = srf;
        this.addChild(scr);

        // Pointer aray
        this.pointers = [];
    },

    onenterframe: function() {
        // Display number of touch and coordinate of touch.
        this.l0.text = "number:"+this.multiTouch.numTouches();
        var touchesList = this.multiTouch.getTouchesList();
        for ( var i = 0; i < 5; i++) {
            if (touchesList[i]) {
                this.ls[i].text= "touch:"+(i+1)+": x = "+~~touchesList[i].x+": y = "+~~touchesList[i].y;
            } else {
                this.ls[i].text= "";
            }
        }

        // Multi touch test
        if (this.mode == 0) {
            // Mode Initialize
            if (this.mode != this.modeBefore) {
            }
            // Draw line.
            this.scr.image.clear();
            if (touchesList.length > 1) {
                var context = this.scr.image.context;
                context.beginPath();
                context.strokeStyle='rgb(255, 255, 255)';
                context.moveTo(touchesList[0].x, touchesList[0].y);

                var max = touchesList.length>5?5:touchesList.length;
                for (var i = 1, len = max; i < len; i++) {
                    context.lineTo(touchesList[i].x, touchesList[i].y);
                }
                context.lineTo(touchesList[0].x, touchesList[0].y);
                context.stroke();
            }
        }
    },

    // touches control
    ontouchesstart: function(e) {
		var sp = new Sprite(16, 16);
		sp.image = game.assets['media/icon0.png'];
        sp.frame = 20;
        sp.id = e.id;
        sp.x = e.x-8;
        sp.y = e.y-8;
        sp.scaleX = 2;
        sp.scaleY = 2;
        this.addChild(sp);
        this.pointers[e.id] = sp;
    },

    ontouchesmove: function(e) {
        var sp = this.pointers[e.id];
        if (sp) {
            sp.x = e.x-8;
            sp.y = e.y-8;
        }
    },

    ontouchesend: function(e) {
        var sp = this.pointers[e.id];
        if (sp) {
            this.removeChild(sp);
        }

        if (this.multiTouch.numTouches == 0) {
            if (this.pointers.length != 0) {
                for(this.pointers in p) {
                    this.removeChild(p);
                }
            }
        }
    },
});


