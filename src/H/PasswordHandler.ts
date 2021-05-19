import { PacketKind } from './../Message/PacketKind';
import { Socket } from 'socket.io';
import { GuestMessage } from '../Message/RoomMessage';
import { Handler } from './Handler';

export class PasswordHandler extends Handler {
	public On(socket: Socket): void {
		socket.on(PacketKind[PacketKind.Password], (msg: GuestMessage) => {
            console.log(`[ROOM] ${msg.RoomName} [CHECK] [PASSWORD}] ${msg.Password}`);

			if(this.roomManager.MatchPassword(msg.RoomName,msg.Password)){
                this.ioServer.to(socket.id).emit(PacketKind[PacketKind.Password], { Password: true, RoomName: msg.RoomName });
            }else{
                this.ioServer.to(socket.id).emit(PacketKind[PacketKind.Password], { Password: false, RoomName: msg.RoomName });
            }
		});
	}
}
