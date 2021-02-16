import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class ExistingRoomHandler extends Handler{
    public On(socket: Socket): void {
        socket.on('Exist', (msg:GuestMessage)=> {
            if (this.roomManager.Exist(msg.RoomName)) {
                this.ioServer.to(socket.id).emit('Exist', { Exist: true, RoomName: msg.RoomName });
            } else {
                this.ioServer.to(socket.id).emit('Exist', { Exist: false, RoomName: msg.RoomName });
            }
        });
    }
}