import { NetworkMessage } from './../Message/NetworkMessage';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Observer } from './Observer';
import * as socketio from "socket.io";
import { PacketKind } from '../Message/PacketKind';

export class DisconnectingObs extends Observer {
	
	constructor(packet:PacketKind,roomManager:RoomManager,ioServer:socketio.Server){
        super(packet,roomManager,ioServer)
    }

	public On(socket: Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			const rooms = this.RoomManager.GetRoomsFrom(socket.id);
			rooms.forEach(room=>{
				if(room.IsEmpty()){
					this.RoomManager.RemoveRoom(room.Name);
				}
			})
			console.log('[DISCONNECTED] ' + socket.id);
        });
	}
}
