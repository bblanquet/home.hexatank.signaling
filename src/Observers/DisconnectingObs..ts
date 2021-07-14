import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class DisconnectingObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		const rooms = this.RoomManager.GetRoomsFrom(this.Socket.id);
		rooms.forEach((room) => {
			if (room.IsEmpty()) {
				this.RoomManager.RemoveRoom(room.Name);
			}
		});
		console.log(`[DISCONNECTED] ${this.Socket.id} ${this.RoomManager.GetNameFrom(this.Socket.id)} `);
	}
}
