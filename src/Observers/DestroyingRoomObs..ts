import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class DestroyingRoomObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (this.Root.Exist(msg.Content.RoomName)) {
			this.Root.Remove(msg.Content.RoomName);
		}
	}
}
