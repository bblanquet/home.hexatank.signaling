import { NetworkMessage } from '../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { PacketKind } from '../Message/PacketKind';

export class ExitObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		this.Socket.leave(msg.Content.RoomName);
		if (this.Root.Exist(msg.Content.RoomName)) {
			let room = this.Root.Rooms.Get(msg.Content.RoomName);
			if (room.Players.Exist(msg.Content.PlayerName)) {
				let room = this.Root.Rooms.Get(msg.Content.RoomName);
				room.RemoveFromName(msg.Content.PlayerName);
				this.Server
					.in(msg.Content.RoomName)
					.emit(
						PacketKind[PacketKind.Players],
						NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
					);
				if (room.IsEmpty()) {
					this.Root.Remove(msg.Content.RoomName);
				}
			}
		}
	}
}
