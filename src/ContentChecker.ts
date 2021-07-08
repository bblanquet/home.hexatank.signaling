export class ContentChecker {
	public static IsOk(str: string): boolean {
		if (ContentChecker.IsContentOk(str)) {
			console.log(`ok ${str}`);
		}

		return ContentChecker.IsNotNull(str) && ContentChecker.IsContentOk(str) && ContentChecker.IsSizeOk(str);
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
		if (str !== undefined && str !== null) {
			return str;
		}
		return '';
	}
}
