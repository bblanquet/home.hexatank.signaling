import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import * as socketio from 'socket.io';
import { RoomManager } from '../Structure/RoomManager';

export class JoiningObs extends Observer {
	constructor(packet: PacketKind, roomManager: RoomManager, ioServer: socketio.Server) {
		super(packet, roomManager, ioServer);
	}
	public On(socket: socketio.Socket): void {
		socket.on(PacketKind[this.Kind], (msg: NetworkMessage<GuestMessage>) => {
			console.log(`[JOIN REQUEST] ${msg.Content.RoomName}`)
			const roomName = msg.Content.RoomName;
			if (roomName) {
				this.RoomManager.AddRoom(roomName, msg.Content.HasPassword, msg.Content.Password);
				const room = this.RoomManager.Get(roomName);
				if (msg.Content.Key) {
					//reconnection
					socket.join(roomName);
					room.UpdatePlayerId(msg.Content.PlayerName, socket.id);
				} else {
					room.AddPlayer(msg.Content.PlayerName, socket.id);
					socket.join(roomName);
					this.Server
						.to(socket.id)
						.emit(
							PacketKind[PacketKind.Joined],
							NetworkMessage.Create<string>(PacketKind.Joined, room.Key)
						);
				}
				this.Server
					.in(roomName)
					.emit(
						PacketKind[PacketKind.Players],
						NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
					);
			}
		});
	}
}
