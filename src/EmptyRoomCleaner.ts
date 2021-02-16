import { GuestMessage } from "./Message/RoomMessage";
import { RoomManager } from "./Structure/RoomManager";
import * as socketio from "socket.io";

export class EmptyRoomCleaner {
    private _isCollecting:boolean = false;

    constructor(protected roomManager:RoomManager,protected ioServer:socketio.Server){}

    public Clear(msg:GuestMessage):void {
        this.ioServer.of('/').in(msg.RoomName).sockets.forEach((error, socketId) => {
            if (error) {
                throw error;
            }
            this.ioServer.sockets.sockets.get(socketId).leave(msg.RoomName);
        });
        this.roomManager.RemoveRoom(msg.RoomName);
        console.log('[closed] Room ' + msg.RoomName);
        this.ioServer.in(msg.RoomName).emit('Close');
    }

    public Clearing():void {
        if (!this._isCollecting) {
            this._isCollecting = true;
            let collector = setInterval(() => {
                console.log('[collecting] start');
                if (this.ioServer && this.ioServer.sockets.sockets.values.length > 0) {
                    if (this.roomManager && this.roomManager.Rooms) {
                        console.log('[collecting] rooms ' + this.roomManager.Rooms.length);
                        if (this.roomManager.Rooms.length === 0) {
                            clearInterval(collector);
                            this._isCollecting = false;
                            return;
                        }

                        const emptyRooms = new Array<string>();
                        this.roomManager.Rooms.forEach((room) => {
                            let count = room.Players.length;
                            let disconnected = 0;
                            room.Players.forEach((player) => {
                                if (!this.ioServer.sockets.sockets.get(player.Id)){
                                    disconnected += 1;
                                }
                            });
                            if (count === disconnected) {
                                emptyRooms.push(room.Name);
                            }
                        });
                        emptyRooms.forEach((emptyRoom) => {
                            console.log('[clear] room ' + emptyRoom);
                            this.roomManager.RemoveRoom(emptyRoom);
                        });
                    }
                }
            }, 5000);
        }
    }
}