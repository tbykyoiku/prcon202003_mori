/*
 * ツリーベル四日市事業所
 * 第3回PGコンテスト用ベースすごろくプログラム
 * マスイベント
 */

//更新履歴
//2020 1/16 和田 新規作成
const _events = [event_Pitfall1,event_Pitfall2,event_Pitfall3,event_Pitfall4,event_Pitfall5,event_Pitfall6];

function event_Pitfall1() {
	writeMsg("2マス進んだ。");
	return playerMove(nowPlayerId,+1);
}

function event_Pitfall2() {
	writeMsg("4マス進んだ。");
	return playerMove(nowPlayerId,+2);
}

function event_Pitfall3() {
	writeMsg("6マス進だ。");
	return playerMove(nowPlayerId,+3);
}

function event_Pitfall4() {
	writeMsg("8マス進んだ。");
	return playerMove(nowPlayerId,+4);
}

function event_Pitfall5() {
	writeMsg("10マス進んだ。");
	return playerMove(nowPlayerId,+5);
}

function event_Pitfall6() {
	writeMsg("12マス進んだ。");
	return playerMove(nowPlayerId,+6);
}