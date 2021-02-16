import { EmptyRoomCleaner } from '../EmptyRoomCleaner';
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Handler } from './Handler';
import * as socketio from "socket.io";

export class CreateRoomHandler extends Handler {
    constructor(private _garbage:EmptyRoomCleaner,roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }

	public On(socket: socketio.Socket): void {
        socket.on('Create', (msg:GuestMessage)=> {
            console.log('[creating room] ');
            if (!this.roomManager.Exist(msg.RoomName)) {
                this.roomManager.AddRoom(msg.RoomName);
                console.log('[created room]' + msg.RoomName);
                this._garbage.Clearing();
            } else {
                console.log('[failed to create room] name already exists ' + msg.RoomName);
            }
        });

	}
}
