import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class AllRoomHandler extends Handler {
	public On(socket: Socket): void {
        socket.on('Rooms', (mg: GuestMessage) => {
            this.ioServer
                .to(socket.id)
                .emit('Rooms', { Content: this.roomManager.Rooms.filter((r) => !r.IsHidden).map((r) => r.Name) });
        });
	}
}
