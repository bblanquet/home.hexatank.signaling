import { NetworkMessage } from './Message/NetworkMessage';
import * as socketio from "socket.io";
import * as http from "http";
import { RoomManager } from "./Structure/RoomManager";
import { GuestMessage } from "./Message/RoomMessage";

export class IoContext{
    private _ioServer:socketio.Server;
    private _isCollecting:boolean = false;
    private _roomManager:RoomManager = new RoomManager();

    constructor(httpServer:http.Server){
        this._ioServer = new socketio.Server(httpServer);
        
        this._ioServer.on('connection', (socket) => {
            console.log('[connected] socketId ' + socket.client.id);
            socket.on('Create', (msg:string)=> this.Create(msg));
        
            socket.on('Leave', (msg:GuestMessage)=> {
                socket.leave(msg.RoomName);
        
                if (this._roomManager.Exist(msg.RoomName)) {
                    let room = this._roomManager.Get(msg.RoomName);
                    if (room.Exist(msg.PlayerName)) {
                        console.log('[leaving] ' + msg.RoomName + ' Player ' + msg.PlayerName);
                        let room = this._roomManager.Get(msg.RoomName);
                        room.RemovePlayer(msg.PlayerName);
                        this._ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
                        if (room.Players.length === 0) {
                            this.Leave(msg);
                        }
                    }
                }
            });
        
            socket.on('Kick', (msg:GuestMessage)=> {
                if (this._roomManager.Exist(msg.RoomName)) {
                    let room = this._roomManager.Get(msg.RoomName);
                    if (room.Exist(msg.PlayerName)) {
                        console.log('[kicking] Room' + msg.RoomName + ' Player ' + msg.PlayerName);
                        room.RemovePlayer(msg.PlayerName);
                        this._ioServer.in(msg.RoomName).emit('Kick', { PlayerName: msg.PlayerName });
                        this._ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
                    }
                }
            });
        
            socket.on('Remove', (msg:GuestMessage)=> {
                if (this._roomManager.Exist(msg.RoomName)) {
                    this.Leave(msg);
                }
            });
        
            socket.on('Hide', (msg:GuestMessage)=> {
                if (this._roomManager.Exist(msg.RoomName)) {
                    this._roomManager.Get(msg.RoomName).IsHidden = true;
                }
            });
        
            socket.on('Exist', (msg:GuestMessage)=> {
                if (this._roomManager.Exist(msg.RoomName)) {
                    this._ioServer.to(socket.id).emit('Exist', { Exist: true, RoomName: msg.RoomName });
                } else {
                    this._ioServer.to(socket.id).emit('Exist', { Exist: false, RoomName: msg.RoomName });
                }
            });
        
            socket.on('Available', (msg:GuestMessage)=> {
                if (this._roomManager.Exist(msg.RoomName)) {
                    let room = this._roomManager.Get(msg.RoomName);
                    if (room.Exist(msg.PlayerName)) {
                        console.log('[Not Available] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
                        this._ioServer.to(socket.id).emit('Available', { IsAvailable: false, RoomName: msg.RoomName });
                    } else {
                        console.log('[Available] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
                        this._ioServer.to(socket.id).emit('Available', { IsAvailable: true, RoomName: msg.RoomName });
                    }
                }
            });
        
            socket.on('Join', (msg:GuestMessage)=> {
                console.log('[joining] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
                this.Create(msg.RoomName);
                let room = this._roomManager.Get(msg.RoomName);
                if (msg.Key) {
                    socket.join(msg.RoomName);
                    room.ChangeId(msg.PlayerName, socket.client.id);
                    console.log('[joined again] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
                } else {
                    room.AddPlayer(msg.PlayerName, socket.client.id);
                    socket.join(msg.RoomName);
                    this._ioServer.to(socket.id).emit('Joined', { Content: room.Key });
                    console.log('[joined] Room ' + msg.RoomName + ' Player ' + msg.PlayerName);
                }
                this._ioServer.in(msg.RoomName).emit('Players', { Content: room.PlayerNames() });
            });
        
            socket.on('Rooms', (mg:GuestMessage)=> {
                this._ioServer.to(socket.id).emit('Rooms', { Content: this._roomManager.Rooms.filter((r) => !r.IsHidden).map((r) => r.Name) });
            });
        
            socket.on('Offer', (msg:NetworkMessage<any>)=> {
                console.log(msg.Emitter + ' sends offer to ' + msg.Recipient + '.');
                this._ioServer.in(msg.RoomName).emit('Offer', msg);
            });
        
            socket.on('Candidate', (msg:NetworkMessage<any>)=> {
                console.log(msg.Emitter + ' sends candidate to ' + msg.Recipient + '.');
                this._ioServer.in(msg.RoomName).emit('Candidate', msg);
            });
        
            socket.on('OneWayPing', (msg:NetworkMessage<any>)=> {
                console.log(msg.Emitter + ' sends OneWayPing to ' + msg.Recipient + '.');
                this._ioServer.in(msg.RoomName).emit('OneWayPing', msg);
            });
        
            socket.on('TwoWayPing', (msg:NetworkMessage<any>)=> {
                console.log(msg.Emitter + ' sends TwoWayPing to ' + msg.Recipient + '.');
                this._ioServer.in(msg.RoomName).emit('TwoWayPing', msg);
            });
        
            socket.on('Reset', (msg:NetworkMessage<any>)=> {
                console.log(msg.Emitter + ' sends Reset to ' + msg.Recipient + '.');
                this._ioServer.in(msg.RoomName).emit('Reset', msg);
            });
        });
    }

    private Create(roomName:string) {
        console.log('[creating] room');
        if (!this._roomManager.Exist(roomName)) {
            this._roomManager.AddRoom(roomName);
            console.log('[created] room');
            this.CollectGarbage();
        } else {
            console.log('[not created] Room already exists ' + roomName);
        }
    }
    
    private Leave(msg:GuestMessage):void {
        this._ioServer.of('/').in(msg.RoomName).sockets.forEach((error, socketId) => {
            if (error) {
                throw error;
            }
            this._ioServer.sockets.sockets.get(socketId).leave(msg.RoomName);
        });
        this._roomManager.RemoveRoom(msg.RoomName);
        console.log('[closed] Room ' + msg.RoomName);
        this._ioServer.in(msg.RoomName).emit('Close');
    }

    private CollectGarbage():void {
        if (!this._isCollecting) {
            this._isCollecting = true;
            let collector = setInterval(() => {
                console.log('[collecting] start');
                if (this._ioServer && this._ioServer.sockets.sockets.values.length > 0) {
                    if (this._roomManager && this._roomManager.Rooms) {
                        console.log('[collecting] rooms ' + this._roomManager.Rooms.length);
                        if (this._roomManager.Rooms.length === 0) {
                            clearInterval(collector);
                            this._isCollecting = false;
                            return;
                        }

                        const emptyRooms = new Array<string>();
                        this._roomManager.Rooms.forEach((room) => {
                            let count = room.Players.length;
                            let disconnected = 0;
                            room.Players.forEach((player) => {
                                if (!this._ioServer.sockets.sockets.get(player.Id)){
                                    disconnected += 1;
                                }
                            });
                            if (count === disconnected) {
                                emptyRooms.push(room.Name);
                            }
                        });
                        emptyRooms.forEach((emptyRoom) => {
                            console.log('[clear] room ' + emptyRoom);
                            this._roomManager.RemoveRoom(emptyRoom);
                        });
                    }
                }
            }, 5000);
        }
    }
}