import { KickHandler } from './handlers/KickHandler';
import { CreateRoomHandler } from './handlers/CreateRoomHandler';
import { JoinHandler } from './handlers/JoinHandler';
import { DestroyingRoomHandler } from './handlers/DestroyingRoomHandler';
import { ExistingRoomHandler } from './handlers/ExistingRoomHandler';
import { LeavingHandler } from './handlers/LeavingHandler';
import { NetworkMessage } from './Message/NetworkMessage';
import * as socketio from 'socket.io';
import * as http from 'http';
import { RoomManager } from './Structure/RoomManager';
import { EmptyRoomCleaner } from './EmptyRoomCleaner';
import { AvailableRoomHandler } from './handlers/AvailableRoomHandler';
import { AllRoomHandler } from './handlers/AllRoomHandler';
import { HideHandler } from './handlers/HideHandler';

export class IoContext {
	private _ioServer: socketio.Server;
	private _roomManager: RoomManager;
	private _emptyRoomCleaner: EmptyRoomCleaner;

	constructor(httpServer: http.Server) {
		this._ioServer = new socketio.Server(httpServer, {
			cors: {
				origin: true,
				credentials: true
			}
		});
		this._roomManager = new RoomManager();
		this._emptyRoomCleaner = new EmptyRoomCleaner(this._roomManager, this._ioServer);

		console.log('START io server ');

		this._ioServer.on('connection', (socket: socketio.Socket) => {
			console.log('[connected] socketId ' + socket.id);
			[
				new LeavingHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
				new ExistingRoomHandler(this._roomManager, this._ioServer),
				new AllRoomHandler(this._roomManager, this._ioServer),
				new KickHandler(this._roomManager, this._ioServer),
				new DestroyingRoomHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
				new AvailableRoomHandler(this._roomManager, this._ioServer),
				new CreateRoomHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
				new JoinHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
				new HideHandler(this._roomManager, this._ioServer)
			].forEach((handler) => {
				handler.On(socket);
			});

			['Offer', 'Candidate', 'OneWayPing', 'TwoWayPing', 'Reset' ].forEach((kind) => {
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
