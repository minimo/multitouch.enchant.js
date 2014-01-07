/*

    multitouch.enchant.js
    enchant.js用マルチタッチ制御クラス
    2013/07/12
    This program is MIT lisence.

*/

enchant();

DEBUG_MULTITOUCH = true;

enchant.MultiTouch = enchant.Class.create(enchant.Group, {
    initialize: function(parent, infoLayer) {
        enchant.Group.call(this);

        this.touchID = 0;       //タッチＩＤ
        this.touchList = [];    //タッチ内容保存

        //マルチタッチ対応フラグ
        this.enable = false;

        //iOSとAndroid以外はシングルタッチとして動作
        if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0) {
            this.enable = true;
        } else if (navigator.userAgent.indexOf('Android') > 0) {
            this.enable = true;
        } else {
        }

        if (DEBUG_MULTITOUCH) {
            this.addEventListener('addedtoscene', function() {
                var l0 = this.l0 = new Label("number:0");
                l0.x = 0;
                l0.y = 60;
		        l0.color = "#ffffff";
	        	l0.font = "bold";
    	    	l0.parent = this;
	    	    l0.onenterframe = function() {
	        	    this.text = "number:"+this.parent.touchList.length;
	        	}
                this.parentNode.addChild(l0);

                //タッチ座標の表示
                this.ls = [];
                for (var i = 0; i < 5; i++) {
                    var lb = this.ls[i] = new Label("");
                    lb.x = 10;
                    lb.y = 70+i*10;
		            lb.color = "#ffffff";
        		    lb.font = "bold";
    	    	    lb.onenterframe = function() {
    	        	}
                    this.addChild(lb);
                }
            });
        }
    },
    onenterframe: function() {
        if (DEBUG_MULTITOUCH) {
            for ( var i = 0; i < 5; i++) {
                if (this.touchList[i]) {
                    this.ls[i].text= "touch:"+(i+1)+": x = "+~~this.touchList[i].x+": y = "+~~this.touchList[i].y;
                } else {
                    this.ls[i].text= "";
                }
            }
        }
    },
    start: function(e) {
        if (this.enable) {
            var id = this.touchID;
            this.touchList.push({ id: this.touchID, x: e.x, y: e.y, time:0 });
            this.touchID++;
            return id;
        } else {
            this.touchList[0] = { id: 0, x: e.x, y: e.y, time:0 };
            return 0;
        }
    },
    move: function(e) {
        if (this.enable) {
            var min = 99999999;
            var target = 9999;
            for (var i = 0, len = this.touchList.length; i < len; i++) {
                var x = e.x - this.touchList[i].x;
                var y = e.y - this.touchList[i].y;
//                var dis = Math.sqrt(x * x + y * y);
                var dis = (x * x + y * y);
                if (dis < min) {
                    target = i;
                    min = dis;
                }
            }
            this.touchList[target].x = e.x;
            this.touchList[target].y = e.y;
            return this.touchList[target].id;
        } else {
            this.touchList[0] = {id:0, x:e.x, y:e.y};
            return 0;
        }
    },
    end: function(e) {
        if (this.enable) {
            var min = 99999999;
            var target = 9999;
            for (var i = 0, len = this.touchList.length; i < len; i++) {
                var x = e.x - this.touchList[i].x;
                var y = e.y - this.touchList[i].y;
//                var dis = Math.sqrt(x * x + y * y);
                var dis = (x * x + y * y);
                if (dis < min) {
                    target = i;
                    min = dis;
                }
            }
            var id = this.touchList[target].id;
            this.touchList.splice(target, 1);
            return id;
        } else {
            this.touchList = [];
            return 0;
        }
    },
    numTouch: function() {
        return this.touchList.length;
    },
    reset: function() {
        this.touchID = 0;
        this.touchList = [];
    },
});

MultiTouch = enchant.MultiTouch;


