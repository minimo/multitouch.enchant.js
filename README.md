# enchant.js用マルチタッチ制御クラス

<img src="screenshot.png" />

enchant.jsではマルチタッチ対応してませんが、強引な方法で実現してみました。

短くシングルタッチすると、
タッチ場所を全て表示するモードと、
エンちゃんをピンチインアウトで回転拡大縮小するモードの切り替えが出来ます。

iPhoneでは６タッチ以上すると動作がおかしくなります（未対処）

説明：
ブラウザ上でマルチタッチすると、タッチしたそれぞれの座標でtouchstartイベントが発行されます。
その座標を記録して、touchmoveイベントが発生した時に一番近いタッチ座標が移動したものとして処理を行っております。

English:
It does not support multi-touch in enchant.js , but I tried to achieve in a pushy way.

When you short single touch , and the mode for displaying all the touch location , you can switch modes to rotate scaling ene -chan in a pinch -in out.

You freaking is the operation will be more iPhone in 6 touch(unmet)

Description:
When you multi-touch on the browser , touchstart event is issued in each of the coordinates that you touch . By recording the coordinates , we perform the processing as if the closest touch coordinates moves when touchmove event occurred.
