import { Room } from "./Room";

export class RoomManager {

    public Rooms:Room[];
	constructor() {
		this.Rooms = [];
	}

	Exist(roomName:string) :boolean{
		let count = this.Rooms.filter((r) => r.Name === roomName).length;
		return 0 < count;
	}

	MatchPassword(roomName: string, password: string) :boolean{
		const room = this.Get(roomName);
		return !room.HasPassword || this.Get(roomName).Password === password;
	}

	ExistAndHasPassword(roomName:string) {
		return this.Exist(roomName) && this.Get(roomName).HasPassword;
	}

	AddRoom(roomName:string, hasPassword:boolean, password:string) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Password = password;
			room.HasPassword = hasPassword;
			room.Name = roomName;
			this.Rooms.push(room);
			console.log(`[ADDED] [ROOM] ${roomName} [PASSWORD=${hasPassword}] ${password}`)
		}
	}

	RemoveRoom(roomName:string) {
		if(this.Exist(roomName)){
			console.log(`[DELETED] [ROOM] ${roomName}`)
		}
		this.Rooms = this.Rooms.filter((r) => r.Name !== roomName);
	}

	Get(roomName:string) {
		const room =this.Rooms.filter((r) => r.Name === roomName)[0];
		console.log(`[GET] [ROOM] ${roomName} [PASSWORD=${room.HasPassword}]`)
		return room;
	}

	GetRoomsFrom(playerId:string):Room[]{
		return this.Rooms.filter(room=>room.ExistId(playerId));
	}
}