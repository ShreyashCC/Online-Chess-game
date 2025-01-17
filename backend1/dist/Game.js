"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { colour: "white" } }));
        this.player2.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { colour: "black" } }));
    }
    makeMove(socket, move) {
        // validate moves
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({ type: messages_1.GAME_OVER,
                payload: { winner: this.board.turn() === "w" ? "black" : "white" }
            }));
            this.player2.emit(JSON.stringify({ type: messages_1.GAME_OVER,
                payload: { winner: this.board.turn() === "w" ? "black" : "white" }
            }));
            return;
        }
        console.log("start");
        if (this.moveCount % 2 === 0) {
            console.log("sent");
            this.player2.send(JSON.stringify({ type: "move", payload: move }));
        }
        else {
            this.player1.send(JSON.stringify({ type: "move", payload: move }));
        }
        console.log("end");
        this.moveCount++;
    }
}
exports.Game = Game;
