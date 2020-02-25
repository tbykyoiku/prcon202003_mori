/*
 * ツリーベル四日市事業所
 * 第3回PGコンテスト用ベースすごろくプログラム
 * メイン処理
 */

//更新履歴
//2020 1/16 和田 新規作成

/* 定数 */
//const _ROLLSPEED = 10;

/* グローバル変数 */

//マス数
var  _BOARDSIZE = 30;

//プレイヤー数
var playerCnt = 1;

//ターンプレイヤー
var nowPlayerId = 1;

//プレイヤー情報
var playerInfo = [];

//ダイスロール非同期処理管理ID
var diceTimerId;

/**
 * 初期処理
 */
$(function() {
	//ログ初期化
	$("#logMsg").val("");

	//プレイヤー情報初期化
	//スタート位置：0
	playerInfo[1] = {Pos:0};
});

/**
 * ログメッセージ書き込み処理
 */
function writeMsg(msg){
	$("#logMsg").val($("#logMsg").val() + msg  + "\r\n");
	$("#logMsg").scrollTop($("#logMsg")[0].scrollHeight);
}

/**
 * ゲーム開始時処理
 */
function startGame() {
	//盤面描画
	drawBoard();

	//プレイヤー位置描画
	drawBoardPos();

	//設定エリア非表示
	$("#gameSettingArea").hide();

	//ゲームエリア表示
	$("#gameArea").show();
	writeMsg("ゲームを開始します。");
	startTurn(nowPlayerId);
}

	//マス数レンジスライダ
$(function() {
    var select = $( "#minbeds" );
    var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
      min: 1,
      max: 100,
      range: "min",
      value: select[ 0 ].selectedIndex + 1,
      slide: function( event, ui ) {
      select[ 0 ].selectedIndex = ui.value - 1;
      _BOARDSIZE = ui.value;
      },
      change: function( event, ui ) {
    	  _BOARDSIZE = ui.value;
      }
    });
    $( "#minbeds" ).change(function() {
      slider.slider( "value", this.selectedIndex + 1 );
    });
  });

function labelchange() {
	_BOARDSIZE = $('#minbeds').get(0);
};

//サイコロを振るプログラム
var count;	// 変化しているように見せる回数
var $id = function(id){ return document.getElementById(id); };
var sainome; //賽の目
/*
* サイコロを振る
*/
function shake(){
	var sai = Math.floor(Math.random() * 6) + 1;		// 1から6までの適当な数字
	sainome = sai;
	sai = sai + ".png";							// 画像ファイル名生成
	$id("saikoro").innerHTML = "<img src='" + sai + "' width='64' height='64'>";
}

/*
* サイコロを振るときのアニメーション
*/
function anime(){
	if(count > 20){	// 適当に20回ほど振る
		count = 0;
		$id("btn").disabled = "";	// ボタンを使える状態にする
		writeMsg(sainome  +"が出ました");
		//ダイスの移動結果か、イベントの実行結果でゲーム終了条件を満たしたらゲーム終了
		if(playerMove(nowPlayerId,sainome) || eventCheck(nowPlayerId)) {
			gameEnd();
		} else {
			endTurn();
		}
		return 0;
	}
	shake();
	count++;
	setTimeout(anime, 50);	// 50ミリ秒間隔で表示切り替え
}

function saikoro(){
	count = 0;
	$id("btn").disabled = "true";	// ボタンを使用不可にする
	anime();						// サイコロアニメ開始
}

/*
* 起動時の処理
*/
window.onload = function(){
	shake();		// 一回だけサイコロを振る
}


/**
 * 盤面描画処理
 */
function drawBoard(){
	var massIdCnt = 0;
	var drawVectorNormal = true;
	var nowYRow =  $('<div class="boardYRow"></div>');

	//プレイヤーの盤面上のコマ
	var massElm =  '<span class="boardMass"><div class="massPlayerArea"></div></span>'

	var boardXSize = 18;

	var xCnt = 0;
	for(var i=0;i < _BOARDSIZE;i++) {
		//右方向にマス描画
		if(drawVectorNormal) {
			if( xCnt  !=  boardXSize) {
				var mass = $(massElm).attr("massNo",massIdCnt).attr("id","mass"+massIdCnt);
				$(nowYRow).append(mass);
				massIdCnt++;
				xCnt++;
			} else {
				$("#board").append(nowYRow);
				nowYRow =  $('<div></div>');
				for(var j=0;j<boardXSize-1;j++) {
					$(nowYRow).append( '<span class="karaMass"></span>')
				}
				var mass = $(massElm).attr("massNo",massIdCnt).attr("id","mass"+massIdCnt);
				$(nowYRow).append(mass);
				massIdCnt++;
				$("#board").append(nowYRow);
				nowYRow =  $('<div></div>');
				drawVectorNormal = false;
				xCnt = 0;
			}
		//左方向にマス描画
		} else {
			if( xCnt  !=  boardXSize) {
				var mass = $(massElm).attr("massNo",massIdCnt).attr("id","mass"+massIdCnt);
				$(nowYRow).prepend(mass);
				massIdCnt++;
				xCnt++;
			} else {
				$("#board").append(nowYRow);
				nowYRow =  $('<div></div>');
				var mass = $(massElm).attr("massNo",massIdCnt).attr("id","mass"+massIdCnt);
				$(nowYRow).append(mass);
				massIdCnt++;
				$("#board").append(nowYRow);
				nowYRow =  $('<div></div>');
				drawVectorNormal = true;
				xCnt = 0;
			}
		}
	}
	$("#board").append(nowYRow).width(80*boardXSize);
	//開始地点と終了地点には色を付ける
	$("#mass"+0).css("background-color","yellow");
	$("#mass"+(_BOARDSIZE-1)).css("background-color","blue");
}

/**
 * プレイヤー情報から盤面に位置を再描画
 */
function drawBoardPos() {
	$(".playerMassIcon").remove();
	for(var i=1;i<playerCnt+1;i++) {
		var pos = playerInfo[i].Pos
		$("#mass" + pos + " .massPlayerArea").append("<span class='playerMassIcon'>〇</span>");
	}
}

/**
 * ターン開始時処理
 */
function startTurn(){
	setTimeout(diceRoll,1500);
}

///**
// * ダイス回転開始
// */
//function diceRoll(){
//	diceTimerId = setInterval(function(){
//		$("#dice").text(Math.floor(Math.random() * 6)+1);
//	},_ROLLSPEED)
//	$("#diceroll").removeAttr("disabled");
//}
//
//
///**
// * ダイス停止処理
// */
//function diceStop() {
//	clearInterval(diceTimerId);
//	var diceCnt = Number($("#dice").text().trim());
//	writeMsg(diceCnt  +"が出ました");
//	$("#diceroll").attr("disabled","disabled");
//
//	//ダイスの移動結果か、イベントの実行結果でゲーム終了条件を満たしたらゲーム終了
//	if(playerMove(nowPlayerId,diceCnt) || eventCheck(nowPlayerId)) {
//		gameEnd();
//	} else {
//		endTurn();
//	}
//}

/**
 * 指定したプレイヤーの位置を指定したマス分移動させる
 * @param pId 移動させる対象のプレイヤーID
 * @param move 移動数
 * @return true:ゲーム終了 false：ゲーム継続
 */
function playerMove(pId,move) {
	if(playerInfo[pId].Pos+ move <= 0) {
		playerInfo[pId].Pos = 0;
		drawBoardPos();
	} else if(playerInfo[pId].Pos+ move >= _BOARDSIZE-1) {
		playerInfo[pId].Pos = _BOARDSIZE-1;
		drawBoardPos();
		return true
	} else {
		playerInfo[pId].Pos = playerInfo[pId].Pos + move;
		drawBoardPos();
	}
	return false
}

/**
 * 指定プレイヤーのマス位置イベントを実行
 * @param pId
 * @return true:ゲーム終了 false：ゲーム継続
 */
function eventCheck(pId){
	//到着マスのイベント発生
	var massEvt = _events[sainome];
	if(massEvt) {
		return massEvt();
	} else {
		writeMsg("何も起こらなかった");
	}
	return false;
}
/*
 * ターン終了時処理
 */
function endTurn(){
	if(nowPlayerId < playerCnt) {
		nowPlayerId++;
	} else {
		nowPlayerId = 1;
	}
	startTurn();
}

/**
 * ゲーム終了条件が満たされたときにゲームを終了させる
 */
function gameEnd(){
	writeMsg("ゲーム終了");
}