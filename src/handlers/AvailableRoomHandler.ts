import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class AvailableRoomHandler extends Handler {
	public On(socket: Socket): void {
		socket.on('Available', (msg: GuestMessage) => {
			if (this.roomManager.Exist(msg.RoomName)) {
				let room = this.roomManager.Get(msg.RoomName);
				if (room.Exist(msg.PlayerName)) {
                    this.Print(`[Unavailable] Room ${msg.RoomName} Player ${msg.PlayerName}`);
					this.ioServer.to(socket.id).emit('Available', { IsAvailable: false, RoomName: msg.RoomName });
				} else {
                    this.Print(`[Available] Room ${msg.RoomName} Player ${msg.PlayerName}`);
					this.ioServer.to(socket.id).emit('Available', { IsAvailable: true, RoomName: msg.RoomName });
				}
			}
		});
	}
}
