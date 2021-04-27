import { Room } from "./Room";

export class RoomManager {
    public Rooms:Room[];
	constructor() {
		this.Rooms = [];
	}

	Exist(roomName:string) {
		let count = this.Rooms.filter((r) => r.Name === roomName).length;
		return 0 < count;
	}

	AddRoom(roomName:string) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Name = roomName;
			this.Rooms.push(room);
			console.log(`[CREATED] [ROOM] ${roomName}`)
		}
	}

	RemoveRoom(roomName:string) {
		if(this.Exist(roomName)){
			console.log(`[DELETED] [ROOM] ${roomName}`)
		}
		this.Rooms = this.Rooms.filter((r) => r.Name !== roomName);
	}

	Get(roomName:string) {
		return this.Rooms.filter((r) => r.Name === roomName)[0];
	}

	GetRoomsFrom(playerId:string):Room[]{
		return this.Rooms.filter(room=>room.ExistId(playerId));
	}
}