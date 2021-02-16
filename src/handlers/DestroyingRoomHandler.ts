import * as socketio from "socket.io";
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { Handler } from './Handler';

export class DestroyingRoomHandler extends Handler{
    constructor(roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
    public On(socket: socketio.Socket): void {
        socket.on('Remove', (msg:GuestMessage)=> {
            if (this.roomManager.Exist(msg.RoomName)) {
                this.roomManager.RemoveRoom(msg.RoomName);
            }
        });
    }
}