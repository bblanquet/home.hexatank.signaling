import { Player } from "./Player";

export class Room {
    public Players:Player[];
	public Password:string;
	public HasPasword:boolean;
    public Key:string;
    public IsHidden:boolean;
    public Name:string;
	public Max:number=4;

	constructor() {
		this.Key = Math.random().toString(36).substring(7);
		this.IsHidden = false;
		this.Password = '';
		this.HasPasword = false;
		this.Name = '';
		this.Players = [];
	}

	public PlayersCount():number{
		return this.Players.length;
	}

	public IsFree():boolean{
		return !this.IsFull() && !this.IsHidden;
	}

	public IsEmpty():boolean{
		return this.GetPlayernames.length === 0;
	}

	public IsFull():boolean{
		return this.Players.length === this.Max;
	}

	public Exist(playerName:string) {
		return this.Players.some((p) => p.Name === playerName);
	}

	public ExistId(playerId:string) {
		return this.Players.some((p) => p.Id === playerId);
	}

	public AddPlayer(name:string, id:string) {
		console.log(`[ADDED] [ROOM] ${this.Name} [PLAYER] ${name}`)
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	public UpdatePlayerId(name:string, id:string) {
		console.log(`[UPDATED] [ROOM] ${this.Name} [PLAYER] ${name}`)
		this.RemovePlayer(name);
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	public GetPlayernames() {
		return this.Players.map((p) => p.Name);
	}

	public RemovePlayer(playerName:string) {
		if(this.Exist(playerName)){
			console.log(`[DELETED] [ROOM] ${this.Name} [PLAYER] ${playerName}`)
		}
		this.Players = this.Players.filter((p) => p.Name !== playerName);
	}
}