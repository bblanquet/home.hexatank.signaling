import { RoomManager } from './../Structure/RoomManager';
import * as socketio from "socket.io";

export abstract class Handler{
    constructor(protected roomManager:RoomManager,protected ioServer:socketio.Server){}
    protected Print(message:string):void{
        console.log(message);
    }
    public abstract On(socket:socketio.Socket):void;
}