import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Observer } from './Observer';
import * as socketio from "socket.io";

export class CreatingRoomObs extends Observer {
    constructor(packet:PacketKind, roomManager:RoomManager,ioServer:socketio.Server){
        super(packet,roomManager,ioServer)
    }

	public On(socket: socketio.Socket): void {
        socket.on(PacketKind[this.Kind], (msg:NetworkMessage<GuestMessage>)=> {
            if(msg.RoomName){
                this.RoomManager.AddRoom(msg.RoomName, msg.Content.HasPassword,msg.Content.Password);
            }

        });
	}
}
