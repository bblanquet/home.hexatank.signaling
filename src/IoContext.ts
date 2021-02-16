import { KickHandler } from './handlers/KickHandler';
import { CreateRoomHandler } from './handlers/CreateRoomHandler';
import { JoinHandler } from './handlers/JoinHandler';
import { DestroyingRoomHandler } from './handlers/DestroyingRoomHandler';
import { ExistingRoomHandler } from './handlers/ExistingRoomHandler';
import { OffHandler } from './handlers/OffHandler';
import { NetworkMessage } from './Message/NetworkMessage';
import * as socketio from 'socket.io';
import * as http from 'http';
import { RoomManager } from './Structure/RoomManager';
import { GuestMessage } from './Message/RoomMessage';
import { Handler } from './handlers/Handler';
import { EmptyRoomCleaner } from './EmptyRoomCleaner';
import { AvailableRoomHandler } from './handlers/AvailableRoomHandler';
import { AllRoomHandler } from './handlers/AllRoomHandler';

export class IoContext {
	private _ioServer: socketio.Server;
	private _roomManager: RoomManager;
	private _emptyRoomCleaner: EmptyRoomCleaner;
	private _handers: Handler[];

	constructor(httpServer: http.Server) {
		this._ioServer = new socketio.Server(httpServer, {
			cors: {
				origin: true,
				credentials: true
			}
		});
		this._roomManager = new RoomManager();
		this._emptyRoomCleaner = new EmptyRoomCleaner(this._roomManager, this._ioServer);
		this._handers = [
			new OffHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
			new ExistingRoomHandler(this._roomManager, this._ioServer),
			new AllRoomHandler(this._roomManager, this._ioServer),
			new KickHandler(this._roomManager, this._ioServer),
			new DestroyingRoomHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
			new AvailableRoomHandler(this._roomManager, this._ioServer),
			new CreateRoomHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer),
			new JoinHandler(this._emptyRoomCleaner, this._roomManager, this._ioServer)
		];

		console.log('START io server ');

		this._ioServer.on('connection', (socket: socketio.Socket) => {
			console.log('[connected] socketId ' + socket.id);

			this._handers.forEach((handler) => {
				handler.On(socket);
			});

			socket.on('Hide', (msg: GuestMessage) => {
				if (this._roomManager.Exist(msg.RoomName)) {
					this._roomManager.Get(msg.RoomName).IsHidden = true;
				}
			});

			socket.on('Offer', (msg: NetworkMessage<any>) => {
				console.log(msg.Emitter + ' sends offer to ' + msg.Recipient + '.');
				this._ioServer.in(msg.RoomName).emit('Offer', msg);
			});

			socket.on('Candidate', (msg: NetworkMessage<any>) => {
				console.log(msg.Emitter + ' sends candidate to ' + msg.Recipient + '.');
				this._ioServer.in(msg.RoomName).emit('Candidate', msg);
			});

			socket.on('OneWayPing', (msg: NetworkMessage<any>) => {
				console.log(msg.Emitter + ' sends OneWayPing to ' + msg.Recipient + '.');
				this._ioServer.in(msg.RoomName).emit('OneWayPing', msg);
			});

			socket.on('TwoWayPing', (msg: NetworkMessage<any>) => {
				console.log(msg.Emitter + ' sends TwoWayPing to ' + msg.Recipient + '.');
				this._ioServer.in(msg.RoomName).emit('TwoWayPing', msg);
			});

			socket.on('Reset', (msg: NetworkMessage<any>) => {
				console.log(msg.Emitter + ' sends Reset to ' + msg.Recipient + '.');
				this._ioServer.in(msg.RoomName).emit('Reset', msg);
			});
		});
	}

	private On(socket:socketio.Socket, message:string):void{
		socket.on(message, (msg: NetworkMessage<any>) => {
			console.log(`${msg.Emitter} sends ${message} to ${msg.Recipient}.`);
			this._ioServer.in(msg.RoomName).emit(message, msg);
		});
	}
}