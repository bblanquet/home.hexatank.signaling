import { NetworkMessage } from './../Message/NetworkMessage';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';

export class HidingRoomObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (this.RoomManager.Exist(msg.Content.RoomName)) {
			this.RoomManager.Get(msg.Content.RoomName).IsHidden = true;
		}
	}
}
