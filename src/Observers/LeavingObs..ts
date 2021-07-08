import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { PacketKind } from '../Message/PacketKind';

export class LeavingObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		this.Socket.leave(msg.Content.RoomName);
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
	}
}
