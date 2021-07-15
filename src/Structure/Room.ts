import { Dictionary } from '../Utils/Dictionary';
import { Player } from './Player';

export class Room {
	public Players: Dictionary<Player>;
	public PlayersById: Dictionary<Player>;
	public Password: string | undefined;
	public Key: string;
	public IsHidden: boolean;
	public Name: string;
	public Max: number = 4;
	public Country: string;

	constructor(name: string, password: string | undefined) {
		this.Key = Math.random().toString(36).substring(7);
		this.IsHidden = false;
		this.Password = password;
		this.Name = name;
		this.Players = new Dictionary<Player>();
		this.PlayersById = new Dictionary<Player>();
	}

	public HasPassword(): boolean {
		return this.Password !== undefined;
	}

	public IsFree(): boolean {
		return !this.IsFull() && !this.IsHidden;
	}

	public IsEmpty(): boolean {
		return this.GetPlayernames().length === 0;
	}

	public IsFull(): boolean {
		return this.Players.Count() === this.Max;
	}

	public ExistId(id: string) {
		return this.PlayersById.Exist(id);
	}

	public GetPlayerFromId(id: string): Player {
		return this.PlayersById.Get(id);
	}

	public Add(player: Player) {
		console.log(`[ROOM] ${this.Name} [ADDED] [PLAYER] ${player.Name}`);
		this.Players.Add(player.Name, player);
		this.PlayersById.Add(player.Id, player);
	}

	public GetPlayernames(): string[] {
		return this.Players.Keys();
	}

	public RemoveFromId(id: string) {
		const player = this.PlayersById.Get(id);
		this.Players.Remove(player.Name);
		this.PlayersById.Remove(player.Id);
	}

	public RemoveFromName(name: string) {
		const player = this.Players.Get(name);
		this.Players.Remove(player.Name);
		this.PlayersById.Remove(player.Id);
	}
}
