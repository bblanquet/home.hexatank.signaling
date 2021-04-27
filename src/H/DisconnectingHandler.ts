import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Handler } from './Handler';
import * as socketio from "socket.io";

export class DisconnectingHandler extends Handler {
	
    constructor(protected roomManager:RoomManager,protected ioServer:socketio.Server){
		super(roomManager,ioServer);
    }

	public On(socket: Socket): void {
		socket.on('disconnect', (msg: GuestMessage) => {
			const rooms = this.roomManager.GetRoomsFrom(socket.id);
			rooms.forEach(room=>{
				if(room.IsEmpty()){
					this.roomManager.RemoveRoom(room.Name);
				}
			})
			console.log('[DISCONNECTED] ' + socket.id);
        });
	}
}
