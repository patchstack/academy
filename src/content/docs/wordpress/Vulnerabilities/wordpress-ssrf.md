---
title: Server Side Request Forgery (SSRF)
---

## Introduction

This section covers cases of possible SSRF on WordPress. This includes improper URL fetch handling inside of the plugin/theme which can be used to perform unauthorized actions or access to data within the organization. This can be in the vulnerable application, or on other back-end systems that the application can communicate with.

## Useful Functions

Several functions could be useful to identify a possible SSRF vulnerability:

- PHP related
    - [`file_get_contents`](https://www.php.net/manual/en/function.file-get-contents.php)
    - [`readfile`](https://www.php.net/manual/en/function.readfile.php)
    - [`fopen`](https://www.php.net/manual/en/function.fopen.php)
    - [`stream_get_contents`](https://www.php.net/manual/en/function.stream-get-contents.php)
    - [`file`](https://www.php.net/manual/en/function.file.php)
    - [`cURL`](https://www.php.net/manual/en/book.curl.php)

- WordPress related
    - [`wp_remote_head`](https://developer.wordpress.org/reference/functions/wp_remote_head/)
    - [`wp_remote_get`](https://developer.wordpress.org/reference/functions/wp_remote_get/)
    - [`wp_remote_post`](https://developer.wordpress.org/reference/functions/wp_remote_post/)
    - [`wp_remote_request`](https://developer.wordpress.org/reference/functions/wp_remote_request/)