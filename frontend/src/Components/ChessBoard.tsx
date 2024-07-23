import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

export const MOVE = "move";

export const ChessBoard = ({ chess ,board , socket , setBoard} :{ setBoard:any;
                                                          chess : any;
                                                          board : ({ square : Square; type:PieceSymbol; color: Color} | null) [] []; 
                                                          socket :WebSocket }) => {
    const [from , setFrom] = useState<null | Square>(null);

    return <div className="text-white-200">
                {board.map((row, i) => {
                    return <div key={i} className="flex">
                        {row.map((square, j) => {
                            const squareRepresentation = String.fromCharCode(97 + (j%8)) + "" + (8 - i) as Square;
                            return <div onClick={()=>{ 
                                if(!from){
                                    setFrom(squareRepresentation);
                                }
                                else{

                                    socket.send(JSON.stringify({
                                        type : MOVE ,
                                        payload :{
                                            move : {
                                                from ,
                                                to : squareRepresentation
                                            }
                                        }

                                    }))

                                    setFrom(null)
                                    chess.move({
                                        from  ,
                                        to : squareRepresentation
                                    });
                                    setBoard(chess.board());

                                    console.log({
                                        from , 
                                        to : squareRepresentation
                                    })
                                }
                                
                            }
                            } key={j} className={`w-20 h-20 ${(i+j)%2==0 ? 'bg-blue-600' : 'bg-blue-300'}`}>
                                <div className="w-full justify-center flex h-full">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? <img className="w-8 h-112+-" src={`/${square?.color ==="b"? square?.type: `${square?.type?.toUpperCase()}`}.png`}/> : null}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                })}
            </div>
}