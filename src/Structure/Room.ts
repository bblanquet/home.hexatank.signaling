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
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	ChangeId(name:string, id:string) {
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
		this.Players = this.Players.filter((p) => p.Name !== playerName);
	}
}