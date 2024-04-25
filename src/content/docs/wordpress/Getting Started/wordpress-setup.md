---
title: Setting up WordPress for Hacking
sidebar:
  order: 3
contributors:
    - dhakalananda
---

## Introduction

Now that we know WordPress and its ecosystem, it is finally time to set up WordPress locally and dive into it. In this section, we will be discussing various ways of setting up a WordPress instance.

Since the local setup is widely covered on the internet, a Google search can provide a ton of articles. We will not be re-inventing the wheel from scratch here either. Instead, we will reference some articles that provide a detailed guideline for setting up.

#### Apache/MySQL method

The first and the most common method of setting up WordPress is through the traditional LAMP, WAMP, or XAMPP stack. A locally running Apache and MySQL server is required to set this up.

References:

- [WordPress XAMPP Windows Setup](https://themeisle.com/blog/install-xampp-and-wordpress-locally)
- [WordPress Ubuntu Setup](https://ubuntu.com/tutorials/install-and-configure-wordpress#1-overview)
- [Laragon](https://laragon.org/index.html)

#### Docker Setup

An official WordPress docker image can be used to set up everything as well. Due to the simplicity of the setup and cross-platform compatibility, it's the preferred way to use it.

[WordPress Official Docker Image](https://hub.docker.com/_/wordpress)

References:

- [Digital Ocean Blog on WP Docker](https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-with-docker-compose)
- [Hostinger Blog on WP Docker](https://www.hostinger.com/tutorials/run-docker-wordpress)
- [DDEV](https://ddev.readthedocs.io/en/stable/users/quickstart/#wordpress)

## Debugging WordPress

A plain WordPress setup installation is good enough for most users, but not optimal for hackers to uncover vulnerabilities deep within the code. We need to be able to step through each line of code, trace it backward/forward, and find those hidden vulnerabilities.

For that purpose, we have XDebug; a tool that is primarily used for debugging and profiling PHP applications. We can set real-time breakpoints in the code and step through it using the tool.

Below are some references to get started with XDebug:

- [Debugging WordPress Using Xdebug, Local, and VS Code](https://webdevstudios.com/2022/10/06/debugging-wordpress/)
- [XDebug for Developers](https://kinsta.com/blog/xdebug)

Fortunately, you won't have to go through everything from scratch on setting up XDebug with WordPress. We already have created a docker image that comes up with everything pre-installed.

The [WP XDebug Docker](https://github.com/patchstack/wp-xdebug-docker) GitHub repository comes with:

- WordPress Docker instance
- XDebug Configured
- File upload limit increased

More information on installation and setup is provided on the GitHub repository. The repo can be used to instantly set up WordPress instances and get started with debugging right away.