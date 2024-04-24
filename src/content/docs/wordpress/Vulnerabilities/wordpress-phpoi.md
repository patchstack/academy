---
title: PHP Object Injection
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible PHP Object Injection on WordPress. This includes improper usage of the unserialization process inside of the plugin/theme which can be used to inject an arbitrary PHP object which in the worst case could turn into RCE depending on the available gadget chain.

## Useful Functions

Several functions could be useful to identify a possible PHP Object Injection vulnerability:

- [`unserialize`](https://www.php.net/manual/en/function.unserialize.php)
- [`maybe_unserialize`](https://developer.wordpress.org/reference/functions/maybe_unserialize/)