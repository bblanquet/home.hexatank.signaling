import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import * as socketio from 'socket.io';
import { RoomManager } from '../Structure/RoomManager';

export class FreeRoomObs extends Observer {
	constructor(kind: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(kind, roomManager, ioServer);
	}

	public On(socket: Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			if (
				this.RoomManager.Exist(msg.Content.RoomName) &&
				this.RoomManager.Get(msg.Content.RoomName).Exist(msg.Content.PlayerName)
			) {
				this.Server
					.to(socket.id)
					.emit(
						PacketKind[this.Kind],
						NetworkMessage.Create<any>(this.Kind, { IsAvailable: false, RoomName: msg.Content.RoomName })
					);
			} else if (this.RoomManager.Exist(msg.Content.RoomName)) {
				this.Server
					.to(socket.id)
					.emit(
						PacketKind[this.Kind],
						NetworkMessage.Create<any>(this.Kind, { IsAvailable: true, RoomName: msg.Content.RoomName })
					);
			}
		});
	}
}
