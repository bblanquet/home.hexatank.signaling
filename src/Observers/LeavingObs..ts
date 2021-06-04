import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import * as socketio from 'socket.io';
import { Observer } from './Observer';
import { RoomManager } from '../Structure/RoomManager';
import { PacketKind } from '../Message/PacketKind';

export class LeavingObs extends Observer {
	constructor(kind: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(kind, roomManager, ioServer);
	}
	public On(socket: socketio.Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			socket.leave(msg.Content.RoomName);
			if (this.RoomManager.Exist(msg.Content.RoomName)) {
				let room = this.RoomManager.Get(msg.Content.RoomName);
				if (room.Exist(msg.Content.PlayerName)) {
					let room = this.RoomManager.Get(msg.Content.RoomName);
					room.RemovePlayer(msg.Content.PlayerName);
					this.Server
						.in(msg.Content.RoomName)
						.emit(
							PacketKind[PacketKind.Players],
							NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
						);
					if (room.IsEmpty()) {
						this.RoomManager.RemoveRoom(msg.Content.RoomName);
					}
				}
			}
		});
	}
}
