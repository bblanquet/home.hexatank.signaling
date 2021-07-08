import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class DestroyingRoomObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (this.RoomManager.Exist(msg.Content.RoomName)) {
			this.RoomManager.RemoveRoom(msg.Content.RoomName);
		}
	}
}
