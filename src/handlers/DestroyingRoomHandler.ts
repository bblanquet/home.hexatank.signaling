import * as socketio from "socket.io";
import { GuestMessage } from '../Message/RoomMessage';
import { RoomManager } from '../Structure/RoomManager';
import { EmptyRoomCleaner } from '../EmptyRoomCleaner';
import { Handler } from './Handler';

export class DestroyingRoomHandler extends Handler{
    constructor(private _garbage:EmptyRoomCleaner,roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
    public On(socket: socketio.Socket): void {
        socket.on('Remove', (msg:GuestMessage)=> {
            if (this.roomManager.Exist(msg.RoomName)) {
                this._garbage.Clear(msg);
            }
        });
    }
}