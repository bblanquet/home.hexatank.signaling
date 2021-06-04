import { PacketKind } from '../Message/PacketKind';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from "socket.io";

export abstract class Observer{
    constructor(protected Kind:PacketKind,protected RoomManager:RoomManager,protected Server:socketio.Server){}
    public abstract On(socket:socketio.Socket):void;
}