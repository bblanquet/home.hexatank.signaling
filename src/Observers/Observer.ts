import { PacketKind } from '../Message/PacketKind';
import { RoomManager } from '../Structure/RoomManager';
import * as socketio from 'socket.io';
import { NetworkMessage } from '../Message/NetworkMessage';

export abstract class Observer<T> {
	constructor(
		protected Kind: PacketKind,
		protected RoomManager: RoomManager,
		protected Server: socketio.Server,
		protected Socket: socketio.Socket
	) {
		this.Socket.on(PacketKind[this.Kind], (message: NetworkMessage<T>) => this.OnExec(message));
	}
	protected abstract OnExec(message: NetworkMessage<T>): void;
	public static GetIp(socket: socketio.Socket): string {
		let ip = socket.conn.remoteAddress.split(':')[3];
		try {
			Object.keys(socket.request.headers).forEach((h) => {
				console.log(h);
			});
			ip = socket.request.headers['X-Real-IP'];
		} catch (error) {
			console.log('no reverse proxy');
		}
		console.log(`[IP] ${socket.id} - ${ip}`);
		return ip;
	}
}
