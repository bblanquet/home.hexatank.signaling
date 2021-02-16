import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class HideHandler extends Handler {
	public On(socket: Socket): void {
        socket.on('Hide', (msg: GuestMessage) => {
            if (this.roomManager.Exist(msg.RoomName)) {
                this.roomManager.Get(msg.RoomName).IsHidden = true;
            }
        });
	}
}
