import { PacketKind } from './../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class KickingHandler extends Handler {
	public On(socket: Socket): void {
		socket.on(PacketKind[PacketKind.Kick], (msg: GuestMessage) => {
			if (this.roomManager.Exist(msg.RoomName)) {
				let room = this.roomManager.Get(msg.RoomName);
				if (room.Exist(msg.PlayerName)) {
					room.RemovePlayer(msg.PlayerName);
					this.ioServer.in(msg.RoomName).emit(PacketKind[PacketKind.Kick], { PlayerName: msg.PlayerName });
					this.ioServer.in(msg.RoomName).emit(PacketKind[PacketKind.Players], { Content: room.GetPlayernames() });
				}
			}
		});
	}
}
