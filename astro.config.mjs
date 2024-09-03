import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
const site_url = process.env.URL;
const site = site_url || 'http://localhost:4321/academy/';

const base_var = process.env.BASE;
const base = base_var ? base_var : 'academy';


// https://astro.build/config
export default defineConfig({
  site: site,
  base: base,
  image: {
		service: passthroughImageService(),
	},
  banner: {
    enabled: true,
    content: 'Biggest Bounty Update Ever - <a href="https://patchstack.com/articles/biggest-wordpress-bug-bounty-program-upgrade-is-here/" target="about:blank">learn more</a>',

  },
  integrations: [starlight({
    title: 'Patchstack Academy',
    favicon: '/images/psfavicon.svg',
    customCss: ['./src/styles/custom.css'],
    editLink: {
      baseUrl: 'https://github.com/patchstack/academy/edit/main/'
    },
    logo: {
      src: './src/assets/logo.svg',
      replacesTitle: true
    },
    social: {
      github: 'https://github.com/patchstack/academy',
      discord: 'https://discord.gg/rkE8yxtNmS',
      'x.com': 'https://twitter.com/patchstackapp',
      linkedin: 'https://www.linkedin.com/company/patchstack'
    },
    components: {
      ThemeProvider: './src/components/ThemeProvider.astro',
      ThemeSelect: './src/components/ThemeSelect.astro',
      Head: './src/components/Head.astro',
      PageSidebar: './src/components/PageSidebar.astro',
      MarkdownContent: './src/components/MarkdownContent.astro',
      EditLink: './src/components/EditLink.astro',
      PageFrame: './src/components/PageFrame.astro',
    },
    sidebar: [{
      label: '👋 Welcome',
      collapsed: true,
      autogenerate: {
        directory: 'welcome',
        collapsed: true
      }
    }, {
      label: '📚 General',
      collapsed: true,
      autogenerate: {
        directory: 'general',
        collapsed: true
      }
    }, {
      label: '🌐 WordPress',
      collapsed: true,
      autogenerate: {
        directory: 'wordpress',
        collapsed: true
      }
    }, {
      label: '📝 To Do',
      collapsed: true,
      autogenerate: {
        directory: 'to-do',
        collapsed: true
      }
    }]
  }), icon(), sitemap()]
});