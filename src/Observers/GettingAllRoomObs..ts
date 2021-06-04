import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomInfo } from '../Structure/RoomInfo';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from 'socket.io';

export class GettingAllRoomObs extends Observer {
	constructor(kind: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(kind, roomManager, ioServer);
	}

	public On(socket: Socket): void {
		socket.on(PacketKind[this.Kind], (mg: NetworkMessage<GuestMessage>) => {
			const availableRooms = this.RoomManager.Rooms
				.filter((r) => r.IsFree())
				.map((room) => new RoomInfo(room.Name, room.PlayersCount(), room.HasPassword, room.Max));
			console.log('[REQUESTING ROOMS] [' + availableRooms.length + '] ' + socket.id);
			this.Server
				.to(socket.id)
				.emit(PacketKind[this.Kind], NetworkMessage.Create<RoomInfo[]>(this.Kind, availableRooms));
		});
	}
}
