import { DisconnectingObs } from './Observers/DisconnectingObs.';
import { KickingObs } from './Observers/KickingObs.';
import { JoiningObs } from './Observers/JoiningObs.';
import { DestroyingRoomObs } from './Observers/DestroyingRoomObs.';
import { ExistingRoomObs } from './Observers/ExistingRoomObs.';
import { LeavingObs } from './Observers/LeavingObs.';
import { NetworkMessage } from './Message/NetworkMessage';
import * as socketio from 'socket.io';
import * as http from 'http';
import { RoomManager } from './Structure/RoomManager';
import { AvailableRoomObs } from './Observers/AvailableRoomObs';
import { GettingAllRoomObs } from './Observers/GettingAllRoomObs.';
import { HidingRoomObs } from './Observers/HidingRoomObs.';
import { PasswordObs } from './Observers/PasswordObs.';
import { PacketKind } from './Message/PacketKind';

export class IoContext {
	private _ioServer: socketio.Server;
	private _roomManager: RoomManager;

	constructor(httpServer: http.Server) {
		this._ioServer = new socketio.Server(httpServer, {
			cors: {
				origin: '*',
				credentials: true
			}
		});
		this._roomManager = new RoomManager();

		this._ioServer.on(PacketKind[PacketKind.connection], (socket: socketio.Socket) => {
			console.log(`[CONNECTED] ${socket.id} - ${socket.conn.remoteAddress}`);
			console.log(`[CONNECTED] ${socket.id} - ${socket.handshake.address}`);
			[
				new LeavingObs(PacketKind.Leave, this._roomManager, this._ioServer, socket),
				new PasswordObs(PacketKind.Password, this._roomManager, this._ioServer, socket),
				new ExistingRoomObs(PacketKind.Exist, this._roomManager, this._ioServer, socket),
				new GettingAllRoomObs(PacketKind.Rooms, this._roomManager, this._ioServer, socket),
				new KickingObs(PacketKind.Kick, this._roomManager, this._ioServer, socket),
				new DestroyingRoomObs(PacketKind.Remove, this._roomManager, this._ioServer, socket),
				new AvailableRoomObs(PacketKind.Available, this._roomManager, this._ioServer, socket),
				new JoiningObs(PacketKind.Join, this._roomManager, this._ioServer, socket),
				new HidingRoomObs(PacketKind.Hide, this._roomManager, this._ioServer, socket),
				new DisconnectingObs(PacketKind.disconnect, this._roomManager, this._ioServer, socket)
			];
			[
				PacketKind[PacketKind.Offer],
				PacketKind[PacketKind.Candidate],
				PacketKind[PacketKind.OneWayPing],
				PacketKind[PacketKind.TwoWayPing],
				PacketKind[PacketKind.Reset]
			].forEach((kind) => {
				this.On(socket, kind);
			});
		});
	}

	private On(socket: socketio.Socket, message: string): void {
		socket.on(message, (msg: NetworkMessage<any>) => {
			console.log(`${msg.Emitter} sends ${message} to ${msg.Recipient}.`);
			this._ioServer.in(msg.RoomName).emit(message, msg);
		});
	}
}
