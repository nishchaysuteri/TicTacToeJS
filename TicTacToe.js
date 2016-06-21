var board=["E","E","E","E","E","E","E","E","E"]
var difficulty="beginner";// for the time being
var turn,result,status="beginning";// status=end,running,beginning
var player,computer;
// var oMoves
/*To Do:-
- Own UI
- Optimize Speed(starting randomly..)+Efficiency(using oMoves)
*/

function score(state) {
	if(whoWon(state)=="X"){
		return 10;
	}else if(whoWon(state)=="O"){
		return -10;
	}
	else{
		return 0;
	}
}

function toggleTurn(t){
	if (t=="X") {
		return "O";
	}
	else {
		return "X";
	}
}

function applyAction(state,movePosition,t) {
	var temp=state.slice();
	temp[movePosition]=t;
	return temp;
}

function minMaxVal(state,t) {
	var stateScore;
	if(isTerminal(state)){
		stateScore=score(state);
	}
	else{
		var available=emptyCells(state);
		var movePosition;
		for(var i=0;i<available.length;i++){
			var tempTurn=t;
			movePosition=available[i];
			var next=applyAction(state,movePosition,tempTurn);
			tempTurn=toggleTurn(tempTurn);
			var val=minMaxVal(next,tempTurn);
			if(i==0){
				stateScore=val;
			}else{
				if(t=="O"){// Min
					stateScore=Math.min(stateScore,val);
				}
				else{ // Max
					stateScore=Math.max(stateScore,val);
				}
			}
		}
	}
	return stateScore;
}

function makeExpertMove(state) {
	var available=emptyCells(state);
	var movePosition;
	var maxPos,minPos;
	var maxVal,minVal;
	for(var i=0;i<available.length;i++){
		var tempTurn=turn;
		movePosition=available[i];
		var next=applyAction(state,movePosition,tempTurn);
		tempTurn=toggleTurn(tempTurn);
		var val=minMaxVal(next,tempTurn);
		if(i==0){
			maxVal=val;
			minVal=val;
			maxPos=movePosition;
			minPos=movePosition;
		}
		else{
			if(maxVal<val){
				maxPos=movePosition;
				maxVal=val;
			}
			if(minVal>val){
				minPos=movePosition;
				minVal=val;
			}
		}
	}
	if(turn=="X"){//max
		var next=applyAction(state,maxPos,turn);
		board=next;
		updateCells();
		turn=toggleTurn(turn);
		beginMakeMove(board);
	}
	else{//Min
		var next=applyAction(state,minPos,turn);
		board=next
		updateCells();
		turn=toggleTurn(turn);
		beginMakeMove(board)
	}
}



function emptyCells(state) {
	var returnArr=[];
	for(var i=0;i<9;i++){
		if(state[i]=="E"){
			returnArr.push(i);
		}
	}
	return returnArr;
}

function isTerminal(state){
	// Rows Check
	for(var i=0;i<=6;i+=3){
		if(state[i]!="E" && state[i]==state[i+1] && state[i+1]==state[i+2]){
			return true;
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			return true;
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {
            return true;
        }
    }
	// Check for draw
    var available=emptyCells(state);
    if(available.length==0){
    	return true;
    }
    else{
    	return false;
    }
}



function whoWon(state){
	// Check Row
	for(var i=0;i<=6;i+=3){
		if(state[i]!="E" && state[i]==state[i+1] && state[i+1]==state[i+2]){
			return state[i];
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			return state[i];
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {        
            return state[i];
        }
    }
    return "No one";
}

function makeBeginnerMove(state) {
    var available=emptyCells(state);
    var movePosition = available[Math.floor(Math.random() * available.length)];
    var next=applyAction(state,movePosition,turn);
    board=next;
	updateCells();
	turn=toggleTurn(turn);
    beginMakeMove(board)
}

function makeMove(state){
	switch(difficulty){
		case "beginner":
			makeBeginnerMove(state);
			break;
		case "expert":
			makeExpertMove(state);
			break;
	}
}

function beginMakeMove(state) {
	currentState=state;
	if(isTerminal(currentState)){
		// console.log(currentState);
		status="ended";
		if(whoWon(currentState)=="X"){
			console.log("X wins");
		}else if(whoWon(currentState)=="O"){
			console.log("O wins");
		}
		else{
			console.log("Draw");
		}
	}
	else if(turn==player){
		console.log("Human Turn");
	}
	else{
		makeMove(currentState);
	}
}

function updateCells(){
	$(".cell").each(function(index){
		if(board[index]=="X")
			$(this).html("X");
		else if(board[index]=="O"){
			$(this).html("O");
		}
	});
}

function initializeCells(){
	status="running"
	if(computer=="X"){
		turn=computer;
		beginMakeMove(board);
	}else{
		turn=player;
	}
}

$(document).ready(function () {
	$(".cell").click("on",function(){
		if(turn===player && $(this).html()==="" && status=="running"){
			var idx=Number($(this).attr("index"));
			board[idx]=player;
			updateCells();
			turn=toggleTurn(turn);
			beginMakeMove(board);
		}
	});
	
	$(".play").click("on",function(){
		player=$(this).text();
		if(player=="X"){
			computer="O";
		}else{
			computer="X";
		}
		initializeCells();
	});
	
	$(".difficulty").click("on",function(){
		difficulty=$(this).text();
	});
});
