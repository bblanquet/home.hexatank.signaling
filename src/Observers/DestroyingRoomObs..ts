import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import * as socketio from "socket.io";
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Observer } from './Observer';

export class DestroyingRoomObs extends Observer{
    constructor(kind:PacketKind,roomManager:RoomManager,ioServer:socketio.Server){
        super(kind,roomManager,ioServer)
    }
    public On(socket: socketio.Socket): void {
        socket.on(PacketKind[this.Kind], (msg:NetworkMessage<GuestMessage>)=> {
            if (this.RoomManager.Exist(msg.Content.RoomName)) {
                this.RoomManager.RemoveRoom(msg.Content.RoomName);
            }
        });
    }
}