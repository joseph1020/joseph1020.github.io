import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE } from '../../consts';
import { blogPath, locales, parseBlogId, ui } from '../../i18n/ui';

export function getStaticPaths() {
	return locales.map((locale) => ({ params: { locale } }));
}

export async function GET(context) {
	const locale = context.params.locale;
	const posts = (await getCollection('blog'))
		.filter((post) => parseBlogId(post.id).locale === locale)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: `${SITE_TITLE} (${locale.toUpperCase()})`,
		description: ui[locale].siteDescription,
		site: context.site,
		items: posts.map((post) => {
			const { slug } = parseBlogId(post.id);
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: blogPath(locale, slug),
			};
		}),
	});
}
