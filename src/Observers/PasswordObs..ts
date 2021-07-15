import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { PacketKind } from '../Message/PacketKind';

export class PasswordObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		console.log(`[ROOM] ${msg.Content.RoomName} [CHECK] [PASSWORD}] ${msg.Content.Password}`);
		if (this.Root.MatchPassword(msg.Content.RoomName, msg.Content.Password)) {
			this.Server
				.to(this.Socket.id)
				.emit(
					PacketKind[PacketKind.Password],
					NetworkMessage.Create(PacketKind.Password, { Password: true, RoomName: msg.Content.RoomName })
				);
		} else {
			this.Server
				.to(this.Socket.id)
				.emit(
					PacketKind[PacketKind.Password],
					NetworkMessage.Create(PacketKind.Password, { Password: false, RoomName: msg.Content.RoomName })
				);
		}
	}
}
