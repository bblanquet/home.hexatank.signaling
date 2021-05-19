import { PacketKind } from './../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomInfo } from '../Structure/RoomInfo';
import { Handler } from './Handler';

export class GettingAllRoomHandler extends Handler {
	public On(socket: Socket): void {
                console.log('[REQUESTING ROOMS] ' + socket.id);
		const availableRooms = this.roomManager.Rooms
			.filter((r) => r.IsFree())
			.map((room) => new RoomInfo(room.Name, room.PlayersCount(), room.HasPassword, room.Max));
		socket.on(PacketKind[PacketKind.Rooms], (mg: GuestMessage) => {
			this.ioServer.to(socket.id).emit(PacketKind[PacketKind.Rooms], { Content: availableRooms });
		});
	}
}
