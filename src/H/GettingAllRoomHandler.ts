import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomInfo } from '../Structure/RoomInfo';
import { Handler } from './Handler';

export class GettingAllRoomHandler extends Handler {
	public On(socket: Socket): void {
                console.log('[REQUESTING ROOMS] ' + socket.id);
		const freeRooms = this.roomManager.Rooms
			.filter((r) => r.IsFree())
			.map((room) => new RoomInfo(room.Name, room.PlayersCount(), room.Max));
		socket.on('Rooms', (mg: GuestMessage) => {
			this.ioServer.to(socket.id).emit('Rooms', { Content: freeRooms });
		});
	}
}
