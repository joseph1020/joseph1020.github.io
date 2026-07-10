export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const ui = {
	ko: {
		siteDescription: 'AI 워크플로우, 자동화, 문서 제작과 기술 운영에 관한 실전 기록',
		homeIntro: [
			'이것저것 다 써봤습니다. 그래서 이제 덜 쓰려고 합니다.',
			'AI, 자동화, 문서, 맥과 윈도우. 직접 써보고 남길 만한 것만 기록합니다.',
		],
		signature: ['돌아는 갑니다.', '계속 쓸지는 모르겠습니다.'],
		blogTitle: '작업 기록',
		blogSubtitle: '써본 것, 고장 난 것, 괜히 손댄 것.',
		blogFootnote: '// 아직 한 편입니다.',
		aboutDescription: '기술, 사업, 문서, 자동화가 서로 꼬이지 않게 정리하는 일을 합니다.',
		aboutInterests: 'AI 워크플로우, 자동화, 문서와 슬라이드, 맥과 윈도우를 다룹니다.',
		aboutPreferences: [
			'새로운 도구는 좋아하지만, 도구를 관리하느라 일이 늘어나는 건 싫어합니다.',
			'복잡하고 거창한 방법보다 직관적이고 오래 쓸 수 있는 단순한 방법을 선호합니다.',
		],
		aboutNotes: '잘된 일보다 왜 일이 꼬였는지, 어떻게 풀었는지를 더 자주 적습니다.',
	},
	en: {
		siteDescription: 'Field notes on AI workflows, automation, documents, and technical operations.',
		homeIntro: [
			'I’ve tried plenty of tools. These days I’m trying to keep fewer of them.',
			'AI, automation, documents, Mac, Windows. Mostly notes from things that survived contact with actual work.',
		],
		signature: ['It runs.', 'Whether I keep using it is another question.'],
		blogTitle: 'Working notes',
		blogSubtitle: 'Things I tried, broke, or should probably have left alone.',
		blogFootnote: '// still just one note.',
		aboutDescription: 'Technology, business, documents, and automation have a habit of tangling themselves together. Much of the work is keeping the knot small.',
		aboutInterests: 'AI workflows, automation, documents, slides, Mac, and Windows. The usual suspects.',
		aboutPreferences: [
			'New tools are fine. Tool babysitting gets old quickly.',
			'Simple methods that stay understandable usually outlast elaborate systems.',
		],
		aboutNotes: 'Most notes here start when something behaves strangely, then stick around until I understand why.',
	},
} as const;

export function isLocale(value: string | undefined): value is Locale {
	return locales.includes(value as Locale);
}

export function parseBlogId(id: string) {
	const [locale, ...slugParts] = id.split('/');
	if (!isLocale(locale) || slugParts.length === 0) {
		throw new Error(`Invalid localized blog content id: ${id}`);
	}
	return {
		locale,
		slug: slugParts.join('/'),
	};
}

export function blogPath(locale: Locale, slug: string) {
	return `/${locale}/blog/${slug}/`;
}

export function localePath(locale: Locale, pathname: string) {
	const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return `/${locale}${normalized === '/' ? '/' : normalized}`;
}
