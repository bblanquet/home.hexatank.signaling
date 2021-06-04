import { NetworkMessage } from './../Message/NetworkMessage';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from 'socket.io';
import { PacketKind } from '../Message/PacketKind';

export class PasswordObs extends Observer {
	constructor(kind: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(kind, roomManager, ioServer);
	}
	public On(socket: Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			console.log(`[ROOM] ${msg.Content.RoomName} [CHECK] [PASSWORD}] ${msg.Content.Password}`);
			if (this.RoomManager.MatchPassword(msg.Content.RoomName, msg.Content.Password)) {
				this.Server
					.to(socket.id)
					.emit(
						PacketKind[PacketKind.Password],
						NetworkMessage.Create(PacketKind.Password, { Password: true, RoomName: msg.Content.RoomName })
					);
			} else {
				this.Server
					.to(socket.id)
					.emit(
						PacketKind[PacketKind.Password],
						NetworkMessage.Create(PacketKind.Password, { Password: false, RoomName: msg.Content.RoomName })
					);
			}
		});
	}
}
