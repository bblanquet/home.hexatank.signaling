import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { ContentChecker } from '../ContentChecker';

export class ExistingRoomObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (ContentChecker.IsOk(msg.Content.RoomName) && ContentChecker.IsOk(msg.Content.PlayerName)) {
			console.log(`[EXIST REQUEST] ${msg.Content.RoomName}`);
			const message = NetworkMessage.Create<{ Exist: boolean; RoomName: string }>(this.Kind, {
				Exist: this.Root.Exist(msg.Content.RoomName),
				RoomName: msg.Content.RoomName
			});
			this.Server.to(this.Socket.id).emit(PacketKind[this.Kind], message);
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
