import { NetworkMessage } from './../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { RoomDetail } from '../Structure/RoomInfo';
import { Observer } from './Observer';
import { ContentChecker } from '../ContentChecker';
import { Room } from '../Structure/Room';

export class GettingAllRoomObs extends Observer<string> {
	public OnExec(mg: NetworkMessage<string>): void {
		const filter = ContentChecker.Format(mg.Content);

		const freeRooms = new Array<RoomDetail>();
		this.Root.Rooms
			.Values()
			.filter((r) => r.IsFree())
			.filter((r) => filter === '' || r.Name.includes(filter))
			.map((room) => this.ToDetail(room))
			.some((room, i) => {
				freeRooms.push(room);
				return 20 < i;
			});

		console.log(`[ALL ROOMS] ${filter} ${freeRooms.length} ${this.Socket.id}`);
		this.Server
			.to(this.Socket.id)
			.emit(PacketKind[this.Kind], NetworkMessage.Create<RoomDetail[]>(this.Kind, freeRooms));
	}

	private ToDetail(room: Room): RoomDetail {
		return new RoomDetail(room.Name, room.Country, room.Players.Count(), room.Password !== undefined, room.Max);
	}
}
