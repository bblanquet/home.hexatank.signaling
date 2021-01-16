import { ProtocolKind } from './ProtocolKind';
import { INetworkMessage } from './INetworkMessage';
import { PacketKind } from './PacketKind';

export class NetworkMessage<T> implements INetworkMessage {
	public Content: T;
	public RoomName: string;

	public Emitter: string;
	public Recipient: string;

	public SeqNum: number;
	public Protocol: ProtocolKind;
	public IsAck: boolean;

	public Kind: PacketKind;
	public EmittedDate: number;
	public Latency: number | null = null;

	public HasContent(): boolean {
		return !(typeof this.Content === 'undefined' || this.Content === null);
	}

	GetContent(): any {
		return this.Content;
	}
}
