import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class KickHandler extends Handler {
	public On(socket: Socket): void {
		socket.on('Kick', (msg: GuestMessage) => {
			if (this.roomManager.Exist(msg.RoomName)) {
				let room = this.roomManager.Get(msg.RoomName);
				if (room.Exist(msg.PlayerName)) {
					this.Print('[kicking] Room' + msg.RoomName + ' Player ' + msg.PlayerName);
					room.RemovePlayer(msg.PlayerName);
					this.ioServer.in(msg.RoomName).emit('Kick', { PlayerName: msg.PlayerName });
					this.ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
				}
			}
		});
	}
}
