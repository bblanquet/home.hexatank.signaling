import { Dictionary } from '../Utils/Dictionary';
import { Room } from './Room';

export class RoomManager {
	public Rooms: Dictionary<Room>;
	constructor() {
		this.Rooms = new Dictionary<Room>();
	}

	Exist(roomName: string): boolean {
		return this.Rooms.Exist(roomName);
	}

	MatchPassword(roomName: string, password: string): boolean {
		const room = this.Rooms.Get(roomName);
		return !room.HasPassword() || room.Password === password;
	}

	Add(room: Room) {
		if (!this.Exist(room.Name)) {
			this.Rooms.Add(room.Name, room);
			console.log(`[ADDED] [ROOM] ${room.Name} [PASSWORD=${room.HasPassword()}] ${room.Password}`);
		}
	}

	Remove(roomName: string) {
		if (this.Exist(roomName)) {
			console.log(`[DELETED] [ROOM] ${roomName}`);
			this.Rooms.Remove(roomName);
		}
	}

	GetRoomsFrom(playerId: string): Room {
		return this.Rooms.Values().find((room) => room.ExistId(playerId));
	}

	GetNameFrom(playerId: string): string {
		const room = this.Rooms.Values().find((r) => r.ExistId(playerId));
		if (room) {
			return room.GetPlayerFromId(playerId).Name;
		}
		return '';
	}
}
