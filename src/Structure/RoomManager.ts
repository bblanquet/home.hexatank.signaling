import { Room } from "./Room";

export class RoomManager {
    public Rooms:Room[];
	constructor() {
		this.Rooms = [];
	}

	Exist(roomName:string) {
		let count = this.Rooms.filter((r) => r.Name === roomName).length;
		console.log('[count] ' + roomName + ': ' + count);
		return 0 < count;
	}

	AddRoom(roomName:string) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Name = roomName;
			this.Rooms.push(room);
			console.log('[created] ' + roomName);
		}
	}

	RemoveRoom(roomName:string) {
		this.Rooms = this.Rooms.filter((r) => r.Name !== roomName);
	}

	Get(roomName:string) {
		return this.Rooms.filter((r) => r.Name === roomName)[0];
	}

	RemovePlayer(playerName:string, roomName:string) {
		if (this.Exist(roomName)) {
			let room = this.Get(roomName);
			room.RemovePlayer(playerName);
		}
	}
}