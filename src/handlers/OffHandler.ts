import { GuestMessage } from './../Message/RoomMessage';
import * as socketio from "socket.io";
import { Handler } from './Handler';
import { EmptyRoomCleaner } from '../EmptyRoomCleaner';
import { RoomManager } from '../Structure/RoomManager';

export class OffHandler extends Handler{
    constructor(private _garbage:EmptyRoomCleaner,roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
    public On(socket:socketio.Socket) : void{
        socket.on('Leave', (msg:GuestMessage) => {
            socket.leave(msg.RoomName);
            if (this.roomManager.Exist(msg.RoomName)) {
                let room = this.roomManager.Get(msg.RoomName);
                if (room.Exist(msg.PlayerName)) {
                    this.Print(`[leaving] ${msg.RoomName} Player ${msg.PlayerName}`);
                    let room = this.roomManager.Get(msg.RoomName);
                    room.RemovePlayer(msg.PlayerName);
                    this.ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
                    if (room.IsEmpty()) {
                        this._garbage.Clear(msg);
                    }
                }
            }
        });
    }
}