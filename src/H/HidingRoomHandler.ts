import { Socket } from 'socket.io';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class HidingRoomHandler extends Handler {
	public On(socket: Socket): void {
        socket.on(PacketKind[PacketKind.Hide], (msg: GuestMessage) => {
            if (this.roomManager.Exist(msg.RoomName)) {
                this.roomManager.Get(msg.RoomName).IsHidden = true;
            }
        });
	}
}
