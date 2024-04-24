---
title: Setting up WordPress for Hacking
sidebar:
  order: 3
contributors:
    - dhakalananda
---

## Introduction

Now that we have knowledge about WordPress and its ecosystem, it is finally the time to setup WordPress locally and dive into it. In this section, we will be discussing various ways of setting up a WordPress instance.

Since the local setup is widely covered on the internet, and just a google search can give a ton of articles, we will not be re-inventing the wheel from the scratch here too. Instead, we will reference some articles that provide a detailed guideline for setting up.

#### Apache/MySQL method

The first and the most common method of setting up WordPress is through the traditional LAMP, WAMP, or XAMPP stack. A locally running Apache and MySQL server is required in order to set this up.

References:

- [WordPress XAMPP Windows Setup](https://themeisle.com/blog/install-xampp-and-wordpress-locally)
- [WordPress Ubuntu Setup](https://ubuntu.com/tutorials/install-and-configure-wordpress#1-overview)

#### Docker Setup

A docker image is available of the official WordPress instance that can be used for setting up as well. Due to the simplicity for the setup and cross-platform compatibility, it is preferred to use a docker image for testing.

[WordPress Official Docker Image](https://hub.docker.com/_/wordpress)

References:

- [Digital Ocean Blog on WP Docker](https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-with-docker-compose)
- [Hostinger Blog on WP Docker](https://www.hostinger.com/tutorials/run-docker-wordpress)

## Debugging WordPress

Just a plain WordPress setup installation is good for users, but not optimal for hackers to uncover vulnerabilities deep within the code. We need to be able to step through each line of code, trace it backwards/forward, and find those hidden vulnerabilities.

For that purpose, we have XDebug; a tool that is primarily used for debugging and profiling PHP applications. We can set real-time breakpoints in the code and step through it using the tool.

Below are some references to get started with XDebug:

- [Debugging WordPress Using Xdebug, Local, and VS Code](https://webdevstudios.com/2022/10/06/debugging-wordpress/)
- [XDebug for Developers](https://kinsta.com/blog/xdebug)

Fortunately, you won't have to go through everything with the scratch on setting up XDebug with WordPress. We already have created a docker image that comes up with everything pre-installed.

The [WP XDebug Docker](https://github.com/patchstack/wp-xdebug-docker) GitHub repository comes with:

- WordPress Docker instance
- XDebug Configured
- File upload limit increased

More information on installation and setup is provided on the GitHub repository. The repo can be used to instantly setup WordPress instance and get started with debugging right away.