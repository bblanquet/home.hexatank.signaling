import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { RoomInfo } from '../Structure/RoomInfo';
import { Observer } from './Observer';
import { ContentChecker } from '../ContentChecker';

export class GettingAllRoomObs extends Observer<string> {
	public OnExec(mg: NetworkMessage<string>): void {
		const filter = ContentChecker.Format(mg.Content);

		const freeRooms = this.RoomManager.Rooms
			.filter((r) => r.IsFree())
			.filter((r) => filter === '' || r.Name.includes(filter))
			.map((room) => new RoomInfo(room.Name, room.Country, room.PlayersCount(), room.HasPassword, room.Max))
			.filter((u, i) => i < 20);
		console.log(`[ALL ROOMS] ${filter} ${freeRooms.length} ${this.Socket.id}`);

		if (mg)
			this.Server
				.to(this.Socket.id)
				.emit(PacketKind[this.Kind], NetworkMessage.Create<RoomInfo[]>(this.Kind, freeRooms));
	}
}
