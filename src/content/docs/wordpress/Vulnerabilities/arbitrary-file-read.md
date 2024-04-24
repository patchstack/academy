---
title: Arbitrary File Read
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible Arbitrary File Read on WordPress. This includes improper file fetch handling inside of the plugin/theme which can be used to read arbitrary local files inside of the server.

## Useful Functions

Several functions could be useful to identify a possible Arbitrary File Read vulnerability:

- PHP related
    - [`file_get_contents`](https://www.php.net/manual/en/function.file-get-contents.php)
    - [`readfile`](https://www.php.net/manual/en/function.readfile.php)
    - [`fopen`](https://www.php.net/manual/en/function.fopen.php)
    - [`fread`](https://www.php.net/manual/en/function.fread.php)
    - [`fgets`](https://www.php.net/manual/en/function.fgets.php)
    - [`fgetcsv`](https://www.php.net/manual/en/function.fgetcsv.php)
    - [`fgetss`](https://www.php.net/manual/en/function.fgetss.php) *deprecated from PHP 7.3*
    - [`file`](https://www.php.net/manual/en/function.file.php)
    - [`cURL`](https://www.php.net/manual/en/book.curl.php)

- WordPress related
    - [`WP_Filesystem_Direct::get_contents`](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/get_contents/)
    - [`WP_Filesystem_Direct::get_contents_array`](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/get_contents_array/)