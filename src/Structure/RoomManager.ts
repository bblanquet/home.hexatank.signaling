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

	Match(roomName: string, password: string) :boolean{
		return this.Get(roomName).Password === password;
	}

	ExistAndHasPassword(roomName:string) {
		return this.Exist(roomName) && this.Get(roomName).HasPasword;
	}

	AddRoom(roomName:string, hasPassword:boolean, password:string) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Password = password;
			room.HasPasword = hasPassword;
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