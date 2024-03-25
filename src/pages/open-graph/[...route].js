import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const collectionEntries = await getCollection('docs');
const pages = Object.fromEntries(collectionEntries.map(({ slug, data }) => [slug, data]));

export const { getStaticPaths, GET } = OGImageRoute({
    param: 'route',

    pages: pages,

    getImageOptions: (path, page) => ({
        title: page.ogtitle ? page.ogtitle : page.title,
        description: 'Detect & patch vulnerabilities in your WordPress apps',
        bgImage: {
            path: './public/images/og_bg.png',
            fit: 'contain'
        },
        logo: {
            path: './public/images/patchstack_logomark.png',
            size:[100]
        },
        font: {
            title: {
                size: 65,
                families: [
                    'Faktum Wide SemiBold',
                ],
                weight: 'SemiBold',
            },
            description: {
                size: 25,
                lineHeight: 1.25,
                families: [
                    'Faktum Wide SemiBold',
                ],
                weight: 'regular',
            },
        },
        fonts: [
            './src/pages/open-graph/_faktum.woff',
        ],
    }),
});