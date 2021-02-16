import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';
import * as socketio from "socket.io";
import { EmptyRoomCleaner } from '../EmptyRoomCleaner';
import { RoomManager } from '../Structure/RoomManager';

export class JoinHandler extends Handler {
    constructor(private _garbage:EmptyRoomCleaner,roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
	public On(socket: socketio.Socket): void {
		socket.on('Join', (msg: GuestMessage) => {
			console.log('[joining] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
			this.Create(msg.RoomName);
			const room = this.roomManager.Get(msg.RoomName);
			if (msg.Key) { //if user is disconnected?
				socket.join(msg.RoomName);
				room.ChangeId(msg.PlayerName, socket.id);
				console.log('[joined again] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
			} else {
				room.AddPlayer(msg.PlayerName, socket.id);
				socket.join(msg.RoomName);
				this.ioServer.to(socket.id).emit('Joined', { Content: room.Key });
				console.log('[joined] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
			}
			this.ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
		});
	}

    private Create(roomName:string) {
        console.log('[creating room] ');
        if (!this.roomManager.Exist(roomName)) {
            this.roomManager.AddRoom(roomName);
			console.log('[created room]' + roomName);
            this._garbage.Clearing();
        } else {
            console.log('[failed to create room] name already exists ' + roomName);
        }
    }
}
