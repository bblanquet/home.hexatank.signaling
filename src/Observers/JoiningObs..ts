import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { ContentChecker } from '../ContentChecker';
import { lookup } from 'geoip-lite';

export class JoiningObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (
			ContentChecker.IsOk(msg.Content.PlayerName) &&
			ContentChecker.IsOk(msg.Content.RoomName) &&
			(!msg.Content.HasPassword || (msg.Content.HasPassword && ContentChecker.IsOk(msg.Content.Password)))
		) {
			console.log(`[JOIN REQUEST] ${msg.Content.RoomName}`);
			const roomName = msg.Content.RoomName;
			const ipInfo = lookup(Observer.GetIp(this.Socket));
			let country = 'na';
			if (ipInfo) {
				country = ipInfo.country;
			}
			this.RoomManager.AddRoom(roomName, country, msg.Content.HasPassword, msg.Content.Password);
			const room = this.RoomManager.Get(roomName);
			if (msg.Content.Key) {
				//reconnection
				this.Socket.join(roomName);
				room.UpdatePlayerId(msg.Content.PlayerName, this.Socket.id);
			} else {
				room.AddPlayer(msg.Content.PlayerName, this.Socket.id);
				this.Socket.join(roomName);
				this.Server
					.to(this.Socket.id)
					.emit(PacketKind[PacketKind.Joined], NetworkMessage.Create<string>(PacketKind.Joined, room.Key));
			}
			this.Server
				.in(roomName)
				.emit(
					PacketKind[PacketKind.Players],
					NetworkMessage.Create<string[]>(PacketKind.Players, room.GetPlayernames())
				);
		} else {
			this.Server
				.to(this.Socket.id)
				.emit(
					PacketKind[PacketKind.Error],
					NetworkMessage.Create<string>(
						this.Kind,
						'Name should only contain letter, number and spaces (max 15 characters).'
					)
				);
		}
	}
}
