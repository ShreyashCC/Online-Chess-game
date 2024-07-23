import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME } from "./messages";

export class Game{
    public player1 : WebSocket;
    public player2 : WebSocket;
    public moveCount = 0;

    public board : Chess;

    private startTime : Date;

    constructor(player1 : WebSocket, player2 : WebSocket){
        this.player1 = player1;
        this.player2 = player2;

        this.board = new Chess();

        this.startTime = new Date();

        this.player1.send(JSON.stringify( { type : INIT_GAME , payload : {colour : "white"} } ))
        this.player2.send(JSON.stringify( { type : INIT_GAME , payload : {colour : "black"} } ))
    }

    makeMove(socket : WebSocket , move : { from : string ; to : string } ){
        // validate moves
        if(this.moveCount % 2 === 0 && socket !== this.player1 ){
            return;
        }
        if(this.moveCount % 2 === 1 && socket !== this.player2 ){
            return;
        }


        try{
            this.board.move(move);
        }
        catch(e){
            return;
        }

        if(this.board.isGameOver()){
            this.player1.emit( JSON.stringify({ type : GAME_OVER ,
                                                payload : {winner : this.board.turn() === "w" ? "black" : "white"}
            }))

            this.player2.emit( JSON.stringify({ type : GAME_OVER ,
                payload : {winner : this.board.turn() === "w" ? "black" : "white"}
            }))

            return;
        }

        console.log("start");
        if(this.moveCount % 2 === 0){
            console.log("sent");
            this.player2.send(JSON.stringify({type : "move" , payload : move}))
        }
        else{
            this.player1.send(JSON.stringify({type : "move" , payload : move}))
        }
        console.log("end")
        this.moveCount++;
    }
}