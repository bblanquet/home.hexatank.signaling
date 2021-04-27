import { GuestMessage } from '../Message/RoomMessage';
import * as socketio from "socket.io";
import { Handler } from './Handler';
import { RoomManager } from '../Structure/RoomManager';

export class LeavingHandler extends Handler{
    constructor(roomManager:RoomManager,ioServer:socketio.Server){
        super(roomManager,ioServer)
    }
    public On(socket:socketio.Socket) : void{
        socket.on('Leave', (msg:GuestMessage) => {
            socket.leave(msg.RoomName);
            if (this.roomManager.Exist(msg.RoomName)) {
                let room = this.roomManager.Get(msg.RoomName);
                if (room.Exist(msg.PlayerName)) {
                    let room = this.roomManager.Get(msg.RoomName);
                    room.RemovePlayer(msg.PlayerName);
                    this.ioServer.in(msg.RoomName).emit('Players', { Content: room.GetPlayernames() });
                    if (room.IsEmpty()) {
                        this.roomManager.RemoveRoom(msg.RoomName);
                    }
                }
            }
        });
    }
}