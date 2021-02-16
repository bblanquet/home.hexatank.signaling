import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class ExistingRoomHandler extends Handler{
    public On(socket: Socket): void {
        socket.on('Exist', (msg:GuestMessage)=> {
            this.ioServer.to(socket.id).emit('Exist', { Exist: this.roomManager.Exist(msg.RoomName), RoomName: msg.RoomName });
        });
    }
}