---
title: WordPress Hacking Tips and Tricks
sidebar:
  order: 4
contributors:
    - dhakalananda
---


In this article, we will be covering some WordPress-related quirks that we can use to make our hacking more efficient and easier.

## Browsing Source Code

For all the open-source plugins in the WordPress repository, we can browse through their source code using a tool called [Plugin Subversions (SVN)](https://plugins.svn.wordpress.org). It contains the source code for all the plugins that are available at https://wordpress.org/plugins.

Similarly, [Themes SVN](https://themes.svn.wordpress.org) is there for all the themes hosted at https://wordpress.org/themes.

### How to use the SVN?

The SVN is divided into four subcategories:

#### 1. Assets

This section contains all the images, gifs, videos, audio, and other static content needed for the plugin. We can ignore this section as there is nothing important here.

#### 2. Branches

The branches are used to store the latest development code for each major release. Any minor releases are updated with the code for that branch. This section is also not particularly interesting for us.

#### 3. Tags

Tags contain snapshots of the plugin's versions. If the plugin is currently at 1.8 and we want the source code of version 1.1, we can navigate to the tags section and get the source code for that particular version.

You can browse through the tags of [Elementor](https://plugins.svn.wordpress.org/elementor/tags) as an example. 

#### 4. Trunks

The Trunks section has the latest development code in the plugin. We can similarly browse the code to the tags, except that only the latest code version will be available.

Now that we have a brief idea of all the sections of the SVN, we can easily browse the code of any version of the plugin without having to download it through the WordPress plugin directory.

### WordPress Trac

The Trac is primarily used to track down all the code changes in the plugin/theme. This is the most useful tool that a hacker can have to track down all the changes and see if any vulnerabilities were patched/introduced in the latest version.

If you go to https://plugins.trac.wordpress.org/browser/elementor, you can see that it's almost the same as SVN. However, the major difference between the two is that Trac allows navigating through the different commits made on the plugin.

Navigating to https://plugins.trac.wordpress.org/log/elementor/trunk allows you to view the history of different changes pushed to the plugin.

![Trac Changes](@images/trac-changes.png)

Selecting two different commits and clicking on "View changes" displays all the changes within the plugin files.

![Elementor Changelog](@images/elementor-changelog.png)

The code changes in a newly released version can be seen through this method. Again, this can be used to check if there have been any security issues patched/introduced in the newly released version of the plugin.

## Mass-hunting Code Patterns

Let's assume that you found a code pattern that leads to a certain vulnerability that exists across multiple plugins/themes. How do you mass-scan the vulnerability across the WordPress repository?

There is a site called [WPdirectory](https://wpdirectory.net) that allows you to search for regex patterns across the plugins/themes.

For example, we want to look for the `unserialize()` function being used in the plugin that takes in user input from the GET parameter potentially leading to PHP object injection. This would be the regex to achieve that goal: `unserialize\(\$_GET.*\)`

![Regex Scan Result](@images/wpdirectory-scan-result.png)

Similarly, we can create our regex pattern as per our requirements and mass-search for the pattern using WPdirectory.


