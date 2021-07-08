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
	protected GetIp(): string {
		const ip = this.Socket.conn.headers['x-forwarded-for'] || this.Socket.conn.remoteAddress.split(':')[3];
		console.log(`[IP] ${this.Socket.id} - ${ip}`);
		return ip;
	}
}
