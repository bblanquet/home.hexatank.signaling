import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Handler } from './Handler';
import * as socketio from "socket.io";

export class CreatingRoomHandler extends Handler {
    constructor(roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }

	public On(socket: socketio.Socket): void {
        socket.on('Create', (msg:GuestMessage)=> {
            this.roomManager.AddRoom(msg.RoomName, msg.HasPassword,msg.Password);
        });
	}
}
