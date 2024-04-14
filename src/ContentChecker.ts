import { Usernames } from './Names';
import { Room } from './Structure/Room';

export class ContentChecker {
	public static IsOk(str: string): boolean {
		return ContentChecker.IsContentOk(str) && ContentChecker.IsNotNull(str) && ContentChecker.IsSizeOk(str);
	}

	public static IsPasswordOK(str: string): boolean {
		return (
			str === undefined ||
			(ContentChecker.IsContentOk(str) && ContentChecker.IsMaxSizeOk(str) && ContentChecker.IsContentOk(str))
		);
	}

	private static IsMaxSizeOk(str: string): boolean {
		return str.length < 30;
	}

	private static IsSizeOk(str: string): boolean {
		return 3 < str.length && str.length < 30;
	}

	private static IsNotNull(str: string) {
		return !(str === undefined || str === null);
	}

	private static IsContentOk(str: string) {
		return new RegExp('^[A-Za-z0-9 ]+$').test(str);
	}

	public static Format(str: string): string {
		if (this.IsNotNull(str)) {
			return str;
		}
		return '';
	}

	public static GetFakeRooms(): Room[] {
		return Usernames.map((username) => {
			const room = new Room(username, undefined);
			room.Country = 'fr';
			return room;
		});
	}
}
