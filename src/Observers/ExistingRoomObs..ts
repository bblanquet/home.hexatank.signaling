import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from "socket.io";
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';

export class ExistingRoomObs extends Observer{
    constructor(kind:PacketKind,roomManager:RoomManager,ioServer:socketio.Server){
        super(kind,roomManager,ioServer)
    }
    public On(socket: Socket): void {
        socket.on(PacketKind[this.Kind], (msg:NetworkMessage<GuestMessage>)=> {
            const message = NetworkMessage.Create<{Exist:boolean,RoomName:string}>(this.Kind,{
                Exist:this.RoomManager.Exist(msg.Content.RoomName),
                RoomName:msg.Content.RoomName
            });
            this.Server.to(socket.id).emit(PacketKind[this.Kind], message);
        });
    }
}