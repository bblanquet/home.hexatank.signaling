import { Player } from "./Player";

export class Room {
    public Players:Player[];
    public Key:string;
    public IsHidden:boolean;
    public Name:string;

	constructor() {
		this.Key = Math.random().toString(36).substring(7);
		this.IsHidden = false;
		this.Name = '';
		this.Players = [];
	}

	public IsEmpty():boolean{
		return this.PlayerNames.length === 0;
	}

	Exist(playerName:string) {
		return 0 < this.Players.filter((p) => p.Name === playerName).length;
	}

	AddPlayer(name:string, id:string) {
		console.log(`[ADDED] [ROOM] ${this.Name} [PLAYER] ${name}`)
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	UpdatePlayerId(name:string, id:string) {
		console.log(`[UPDATED] [ROOM] ${this.Name} [PLAYER] ${name}`)
		this.RemovePlayer(name);
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	PlayerNames() {
		return this.Players.map((p) => p.Name);
	}

	RemovePlayer(playerName:string) {
		if(this.Exist(playerName)){
			console.log(`[DELETED] [ROOM] ${this.Name} [PLAYER] ${playerName}`)
		}
		this.Players = this.Players.filter((p) => p.Name !== playerName);
	}
}