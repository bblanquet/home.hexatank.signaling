import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class DisconnectingHandler extends Handler {
	public On(socket: Socket): void {
		socket.on('disconnect', (msg: GuestMessage) => {
			console.log('[DISCONNECTED] ' + socket.id);
        });
	}
}
