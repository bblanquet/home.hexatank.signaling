import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class KickingObs extends Observer<GuestMessage> {
	protected OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (this.Root.Exist(msg.Content.RoomName)) {
			let room = this.Root.Rooms.Get(msg.Content.RoomName);
			if (room.Players.Exist(msg.Content.PlayerName)) {
				console.log(`[KICKING REQUEST] ${msg.Content.RoomName} ${msg.Content.PlayerName}`);
				room.RemoveFromName(msg.Content.PlayerName);
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
	}
}
