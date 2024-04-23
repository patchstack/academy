---
title: Arbitrary File Deletion
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible Arbitrary File Deletion on WordPress. This includes improper file or directory deletion handling inside of the plugin/theme which can be used to delete arbitrary local files and directories inside of the server.

## Useful Functions

Several functions could be useful to identify a possible Arbitrary File Deletion vulnerability:

- PHP related
    - [`unlink`](https://www.php.net/manual/en/function.unlink.php)
    - [`rmdir`](https://www.php.net/manual/en/function.rmdir.php)

- WordPress related
    - [`WP_Filesystem_Direct::delete`](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/delete/)
    - [`WP_Filesystem_Direct::rmdir`](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/rmdir/)