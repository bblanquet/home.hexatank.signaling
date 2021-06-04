import { NetworkMessage } from './../Message/NetworkMessage';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from "socket.io";
import { PacketKind } from '../Message/PacketKind';

export class HidingRoomObs extends Observer {
    constructor(packet:PacketKind,roomManager:RoomManager,ioServer:socketio.Server){
        super(packet,roomManager,ioServer)
    }

	public On(socket: Socket): void {
        socket.on(PacketKind[PacketKind.Hide], (msg: NetworkMessage<GuestMessage>) => {
            if (this.RoomManager.Exist(msg.Content.RoomName)) {
                this.RoomManager.Get(msg.Content.RoomName).IsHidden = true;
            }
        });
	}
}
