import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { GuestMessage } from '../Message/RoomMessage';
import { Observer } from './Observer';
import { ContentChecker } from '../ContentChecker';
import { lookup } from 'geoip-lite';
import { Player } from '../Structure/Player';
import { Room } from '../Structure/Room';

export class JoiningObs extends Observer<GuestMessage> {
	public OnExec(msg: NetworkMessage<GuestMessage>): void {
		if (
			ContentChecker.IsOk(msg.Content.PlayerName) &&
			ContentChecker.IsOk(msg.Content.RoomName) &&
			ContentChecker.IsPasswordOK(msg.Content.Password)
		) {
			const roomName = msg.Content.RoomName;
			this.Root.Add(this.GetRoom(msg));
			const room = this.Root.Rooms.Get(msg.Content.RoomName);
			room.Add(new Player(msg.Content.PlayerName, this.Socket.id));
			this.Socket.join(roomName);
			this.Server
				.to(this.Socket.id)
				.emit(PacketKind[PacketKind.Joined], NetworkMessage.Create<string>(PacketKind.Joined, room.Key));
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
						'Name should only contain letter, number and spaces (max 30 characters).'
					)
				);
		}
	}

	private GetRoom(msg: NetworkMessage<GuestMessage>) {
		const country = this.GetCountry();
		let room = new Room(
			msg.Content.RoomName,
			msg.Content.Password === undefined || msg.Content.Password === '' ? undefined : msg.Content.Password
		);
		room.Country = country;
		return room;
	}

	private GetCountry() {
		const ipInfo = lookup(Observer.GetIp(this.Socket));
		let country = 'na';
		if (ipInfo) {
			country = ipInfo.country;
		}
		return country;
	}
}
