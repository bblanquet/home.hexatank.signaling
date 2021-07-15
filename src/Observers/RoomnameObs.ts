import { ContentChecker } from '../ContentChecker';
import { NetworkMessage } from '../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class RoomnameObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (ContentChecker.IsOk(msg.Content.RoomName) && ContentChecker.IsOk(msg.Content.PlayerName)) {
			if (
				this.Root.Exist(msg.Content.RoomName) &&
				this.Root.Rooms.Get(msg.Content.RoomName).Players.Exist(msg.Content.PlayerName)
			) {
				this.Server
					.to(this.Socket.id)
					.emit(
						PacketKind[this.Kind],
						NetworkMessage.Create<any>(this.Kind, { IsAvailable: false, RoomName: msg.Content.RoomName })
					);
			} else if (this.Root.Exist(msg.Content.RoomName)) {
				this.Server
					.to(this.Socket.id)
					.emit(
						PacketKind[this.Kind],
						NetworkMessage.Create<any>(this.Kind, { IsAvailable: true, RoomName: msg.Content.RoomName })
					);
			}
		} else {
			this.Server
				.to(this.Socket.id)
				.emit(
					PacketKind[PacketKind.Error],
					NetworkMessage.Create<string>(
						this.Kind,
						'Name should only contain letter, number and spaces (max 30 characters).'
					)
				);
		}
	}
}
