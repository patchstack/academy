import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
const site_url = process.env.URL;
const site = site_url || 'http://localhost:4321';


// https://astro.build/config
export default defineConfig({
  site: site,
  image: {
		service: passthroughImageService(),
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
      linkedin: 'https://www.linkedin.com/company/patchtsack'
    },
    components: {
      ThemeProvider: './src/components/ThemeProvider.astro',
      ThemeSelect: './src/components/ThemeSelect.astro',
      Head: './src/components/Head.astro',
      PageSidebar: './src/components/PageSidebar.astro',
      MarkdownContent: './src/components/MarkdownContent.astro',
      EditLink: './src/components/EditLink.astro'
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