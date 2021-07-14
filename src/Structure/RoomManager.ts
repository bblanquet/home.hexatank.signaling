import { Player } from './Player';
import { Room } from './Room';

export class RoomManager {
	public Rooms: Room[];
	constructor() {
		this.Rooms = [];
	}

	Exist(roomName: string): boolean {
		let count = this.Rooms.filter((r) => r.Name === roomName).length;
		return 0 < count;
	}

	MatchPassword(roomName: string, password: string): boolean {
		const room = this.Get(roomName);
		return !room.HasPassword || this.Get(roomName).Password === password;
	}

	ExistAndHasPassword(roomName: string) {
		return this.Exist(roomName) && this.Get(roomName).HasPassword;
	}

	AddRoom(roomName: string, country: string, hasPassword: boolean, password: string) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Country = country;
			room.Password = password === undefined ? '' : password;
			room.HasPassword = hasPassword === undefined ? false : hasPassword;
			room.Name = roomName;
			this.Rooms.push(room);
			console.log(`[ADDED] [ROOM] ${roomName} [PASSWORD=${room.HasPassword}] ${room.Password}`);
		}
	}

	RemoveRoom(roomName: string) {
		if (this.Exist(roomName)) {
			console.log(`[DELETED] [ROOM] ${roomName}`);
		}
		this.Rooms = this.Rooms.filter((r) => r.Name !== roomName);
	}

	Get(roomName: string) {
		const room = this.Rooms.filter((r) => r.Name === roomName)[0];
		console.log(`[GET] [ROOM] ${room.Name} [PASSWORD=${room.HasPassword}]`);
		return room;
	}

	GetRoomsFrom(playerId: string): Room[] {
		return this.Rooms.filter((room) => room.ExistId(playerId));
	}

	GetNameFrom(playerId: string): string {
		let p: Player = undefined;
		this.Rooms.some((room) => {
			p = room.GetPlayerFromId(playerId);
			return p !== undefined;
		});
		if (p !== undefined) {
			return '';
		} else {
			return p.Name;
		}
	}
}
