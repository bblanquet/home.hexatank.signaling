import { RoomManager } from './../Structure/RoomManager';
import * as socketio from "socket.io";

export abstract class Handler{
    constructor(protected roomManager:RoomManager,protected ioServer:socketio.Server){}
    public abstract On(socket:socketio.Socket):void;
}