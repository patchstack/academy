---
title: Local File Inclusion (LFI)
---

## Introduction

This article covers cases of possible LFI on WordPress. This includes improper file inclusion inside of the plugin/theme which can be used to gain RCE on the server.

## Useful Functions

Several functions could be useful to identify a possible LFI vulnerability:

- [`include`](https://www.php.net/manual/en/function.include.php)
- [`include_once`](https://www.php.net/manual/en/function.include-once.php)
- [`require`](https://www.php.net/manual/en/function.require.php)
- [`require_once`](https://www.php.net/manual/en/function.require-once.php)