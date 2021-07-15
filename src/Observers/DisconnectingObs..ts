import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { PacketKind } from '../Message/PacketKind';

export class DisconnectingObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		console.log(`[DISCONNECTED] ${this.Socket.id} ${this.Root.GetNameFrom(this.Socket.id)} `);
		const room = this.Root.GetRoomsFrom(this.Socket.id);
		if (room) {
			room.RemoveFromId(this.Socket.id);
			this.Server
				.in(room.Name)
				.emit(
					PacketKind[PacketKind.Players],
					NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
				);
			if (room.IsEmpty()) {
				this.Root.Remove(room.Name);
			}
		}
	}
}
