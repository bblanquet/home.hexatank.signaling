import { DisconnectingHandler } from './H/DisconnectingHandler';
import { KickingHandler } from './H/KickingHandler';
import { CreatingRoomHandler } from './H/CreatingRoomHandler';
import { JoiningHandler } from './H/JoiningHandler';
import { DestroyingRoomHandler } from './H/DestroyingRoomHandler';
import { ExistingRoomHandler } from './H/ExistingRoomHandler';
import { LeavingHandler } from './H/LeavingHandler';
import { NetworkMessage } from './Message/NetworkMessage';
import * as socketio from 'socket.io';
import * as http from 'http';
import { RoomManager } from './Structure/RoomManager';
import { FreeRoomHandler } from './H/FreeRoomHandler';
import { GettingAllRoomHandler } from './H/GettingAllRoomHandler';
import { HidingRoomHandler } from './H/HidingRoomHandler';

export class IoContext {
	private _ioServer: socketio.Server;
	private _roomManager: RoomManager;

	constructor(httpServer: http.Server) {
		this._ioServer = new socketio.Server(httpServer, {
			cors: {
				origin: '*',
				credentials: true,
			}
		});
		this._roomManager = new RoomManager();

		this._ioServer.on('connection', (socket: socketio.Socket) => {
			console.log('[CONNECTED] ' + socket.id);
			[
				new LeavingHandler( this._roomManager, this._ioServer),
				new ExistingRoomHandler(this._roomManager, this._ioServer),
				new GettingAllRoomHandler(this._roomManager, this._ioServer),
				new KickingHandler(this._roomManager, this._ioServer),
				new DestroyingRoomHandler(this._roomManager, this._ioServer),
				new FreeRoomHandler(this._roomManager, this._ioServer),
				new CreatingRoomHandler(this._roomManager, this._ioServer),
				new JoiningHandler(this._roomManager, this._ioServer),
				new HidingRoomHandler(this._roomManager, this._ioServer),
				new DisconnectingHandler(this._roomManager, this._ioServer),
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
