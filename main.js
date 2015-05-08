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

var userAgent = "";		//Browser
var soundEnable = true;	//Sound enable flag
var smartphone = false;	//detect smartphone

var floor = 1;

window.onload = function() {
	//running browser
	if( (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 ){
		userAgent = "iOS";
		soundEnable = false;
		smartphone = true;
	}else if( navigator.userAgent.indexOf('Android') > 0){
		userAgent = "Android";
		soundEnable = false;
		smartphone = true;
	}else if( navigator.userAgent.indexOf('Chrome') > 0){
		userAgent = "Chrome";
	}else if( navigator.userAgent.indexOf('Firefox') > 0){
		userAgent = "Firefox";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('Safari') > 0){
		userAgent = "Safari";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('IE') > 0){
		userAgent = "IE";
	}else{
		userAgent = "unknown";
	}

    game = new Core(320, 320);
    game.fps = 30;
    game.preload(
        'media/icon0.png', 'media/arrow.png', 'media/space3.png'
    );
    if (soundEnable) {
    }

    //Keybind
    game.keybind(32,'space');

    game.onload = function(){
        main = new MainScene;
        game.pushScene(main);
    };
    game.start();
};

MainScene = enchant.Class.create(enchant.Scene, {
    initialize: function() {
        enchant.Scene.call(this);
        this.backgroundColor = 'rgb(0,0,0)';
        
        // touch ID counter.
        this.touchID = 0;

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
        this.touches = [];

        // Management mode
        this.mode = 0;
        this.modeBefore = -1;
        this.maxnumber = 0;
        this.touchTime = 0;
        
        // Line drawing preparation
        var scr = this.scr = new Sprite(320, 320);
        var srf = new Surface(320, 320);
        scr.image = srf;
        this.addChild(scr);

        // Sprite
        var spr = this.sprite = new Sprite(32, 32);
        spr.image = game.assets['media/space3.png'];
        spr.frame = 5;
        spr.x = 160-16;
        spr.y = 160-16;
        spr.onenterframe = function() {
            if (this.age % 3 == 0)this.frame++;
            if (this.frame > 7)this.frame = 5;
        }
        this.addChild(spr);

        // Pinch in - out
        this.dis = 0;
        this.disStart = 0;
        this.disBefore = 0;
        this.rot = 0;
        this.rotStart = 0;
        this.rotBefore = 0;
    },
    onenterframe: function() {
        // Display number of touch and coordinate of touch.
        this.l0.text = "number:"+this.touches.length;
        for ( var i = 0; i < 5; i++) {
            if (this.touches[i]) {
                this.ls[i].text= "touch:"+(i+1)+": x = "+~~this.touches[i].x+": y = "+~~this.touches[i].y;
            } else {
                this.ls[i].text= "";
            }
        }

        // Multi touch test
        if (this.mode == 0) {
            if (this.mode != this.modeBefore) {
                this.sprite.visible = false;
            }
            // Draw line.
            this.scr.image.clear();
            if (this.touches.length > 1) {
                var context = this.scr.image.context;
                context.beginPath();
                context.strokeStyle='rgb(255, 255, 255)';
                context.moveTo(this.touches[0].x, this.touches[0].y);
                for (var i = 1, len = this.touches.length; i < len; i++) {
                    context.lineTo(this.touches[i].x, this.touches[i].y);
                }
                context.lineTo(this.touches[0].x, this.touches[0].y);
                context.stroke();
            }
        }

        // Rotation and scaling
        if (this.mode == 1) {
            // Initialize
            if (this.mode != this.modeBefore) {
                this.sprite.visible = true;
                this.disStart = this.disBefore = -1;
            }
            // Multi-touch case
            if (this.touches.length > 1) {
                //１つめと２つめの距離と角度算出
                var x1 = this.touches[0].x;
                var y1 = this.touches[0].y;
                var x2 = this.touches[1].x;
                var y2 = this.touches[1].y;
                var x = x2-x1;
                var y = y2-y1;
                this.dis = Math.sqrt(x*x+y*y);
                this.rot = Math.atan2(x, y)*toDeg;
                
                if (this.disBefore == -1) {
                    this.disStart = this.dis;
                    this.disBefore = this.dis;
                    this.rotStart = this.rot;
                    this.rotBefore = this.rot;
                }
                this.sprite.scaleX += (this.dis-this.disBefore)/100;
                this.sprite.scaleY += (this.dis-this.disBefore)/100;
                if( this.sprite.scaleX < 0.2) {
                    this.sprite.scaleX = 0.2;
                    this.sprite.scaleY = 0.2;
                }
                this.sprite.rotation -= (this.rot-this.rotBefore);
                this.disBefore = this.dis;
                this.rotBefore = this.rot;
            } else {
                this.disStart = this.disBefore = -1;
            }
        }
        this.modeBefore = this.mode;
        this.touchTime++;
    },
    //操作系
    ontouchstart: function(e) {
        //タッチ一回目の場合、タッチ時間リセット
        if (this.touches.length == 0)this.touchTime = 0;
        
        //ポインタ表示
        param = new Sprite(16 ,16);
        param.image = game.assets['media/icon0.png'];
        param.x = e.x-8;
        param.y = e.y-8;
        param.frame = 20;
        param.scaleX = 3;
        param.scaleY = 3;
        param.id = this.touchID;    //タッチＩＤ
        if (this.mode != 0) param.visible = false;  //モードによって表示非表示の切り替え
        this.addChild(param);
        this.touches[this.touches.length] = param;  //タッチ配列に追加

        //シーケンス内最大タッチ数
        if (this.touches.length > this.maxnumber) {
            this.maxnumber = this.touches.length;
        }
        this.touchID++;
    },
    ontouchmove: function(e) {
        //一番近いポインタを移動したものとして処理を行う
        var min = 99999;
        var target = 9999;
        for ( var i = 0, len = this.touches.length; i < len; i++) {
            var x = e.x-this.touches[i].x;
            var y = e.y-this.touches[i].y;
            var dis = Math.sqrt(x*x+y*y);
            if (dis < min) {
                target = i;
                min = dis;
            }
        }
        this.touches[target].x = e.x-8;
        this.touches[target].y = e.y-8;
    },
    ontouchend: function(e) {
        //一番近いポインタを移動したものとして処理を行う
        var min = 99999;
        var target = 9999;
        for ( var i = 0, len = this.touches.length; i < len; i++) {
            var x = e.x-this.touches[i].x;
            var y = e.y-this.touches[i].y;
            var dis = Math.sqrt(x*x+y*y);
            if (dis < min) {
                target = i;
                min = dis;
            }
        }
        //タッチ終了したので削除
        this.removeChild(this.touches[target]);
        this.touches.splice(target, 1);

        //シングルタッチだった場合モード変更（0.5秒以内）
        if (this.touches.length == 0 && this.touchTime < 15 ) {
            if (this.maxnumber == 1){
                this.mode++;
                this.mode %= 2;
            }
            this.maxnumber = 0;
        }
    },
});


