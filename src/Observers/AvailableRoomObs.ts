import { ContentChecker } from '../ContentChecker';
import { NetworkMessage } from '../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class AvailableRoomObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (ContentChecker.IsOk(msg.Content.RoomName) && ContentChecker.IsOk(msg.Content.PlayerName)) {
			if (
				this.RoomManager.Exist(msg.Content.RoomName) &&
				this.RoomManager.Get(msg.Content.RoomName).Exist(msg.Content.PlayerName)
			) {
				this.Server
					.to(this.Socket.id)
					.emit(
						PacketKind[this.Kind],
						NetworkMessage.Create<any>(this.Kind, { IsAvailable: false, RoomName: msg.Content.RoomName })
					);
			} else if (this.RoomManager.Exist(msg.Content.RoomName)) {
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
						'Name should only contain letter, number and spaces (max 15 characters).'
					)
				);
		}
	}
}
