import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';
import * as socketio from "socket.io";
import { RoomManager } from '../Structure/RoomManager';

export class JoiningHandler extends Handler {
    constructor(roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
	public On(socket: socketio.Socket): void {
		socket.on('Join', (msg: GuestMessage) => {
			this.roomManager.AddRoom(msg.RoomName);
			const room = this.roomManager.Get(msg.RoomName);
			if (msg.Key) { //if user got disconnected?
				socket.join(msg.RoomName);
				room.UpdatePlayerId(msg.PlayerName, socket.id);
			} else {
				room.AddPlayer(msg.PlayerName, socket.id);
				socket.join(msg.RoomName);
				this.ioServer.to(socket.id).emit('Joined', { Content: room.Key });
			}
			this.ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
		});
	}
}
