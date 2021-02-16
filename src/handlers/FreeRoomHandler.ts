import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class FreeRoomHandler extends Handler {
	public On(socket: Socket): void {
		socket.on('Available', (msg: GuestMessage) => {
			if (this.roomManager.Exist(msg.RoomName) && this.roomManager.Get(msg.RoomName).Exist(msg.PlayerName)) {
				this.ioServer.to(socket.id).emit('Available', { IsAvailable: false, RoomName: msg.RoomName });
			}else if(this.roomManager.Exist(msg.RoomName)){
				this.ioServer.to(socket.id).emit('Available', { IsAvailable: true, RoomName: msg.RoomName });
			}
		});
	}
}
