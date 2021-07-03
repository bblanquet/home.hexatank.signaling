import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from 'socket.io';

export class KickingObs extends Observer {
	constructor(kind: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(kind, roomManager, ioServer);
	}

	public On(socket: Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			if (this.RoomManager.Exist(msg.Content.RoomName)) {
				let room = this.RoomManager.Get(msg.Content.RoomName);
				if (room.Exist(msg.Content.PlayerName)) {
					room.RemovePlayer(msg.Content.PlayerName);
					this.Server
						.in(msg.Content.RoomName)
						.emit(PacketKind[this.Kind], NetworkMessage.Create<string>(this.Kind, msg.Content.PlayerName));
					this.Server
						.in(msg.Content.RoomName)
						.emit(
							PacketKind[PacketKind.Players],
							NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
						);
				}
			}
		});
	}
}
