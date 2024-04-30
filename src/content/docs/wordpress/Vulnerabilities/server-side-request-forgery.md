---
title: Server Side Request Forgery (SSRF)
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible SSRF on WordPress. This includes improper URL fetch handling inside of the plugin/theme which can be used to perform unauthorized actions or access to data within the organization. This can be in the vulnerable application, or on other back-end systems that the application can communicate with.

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


## Example Cases

Below is an example of vulnerable code:

```php
add_action("wp_ajax_nopriv_fetch_image_url", "fetch_image_url");

function fetch_image_url(){
    $response = wp_remote_get($_GET["image_url"]);
    $image_data = wp_remote_retrieve_body($response);
    echo $image_data;
    die();
}
```

To exploit this, any unauthenticated user just needs to perform a POST request to the `/wp-admin/admin-ajax.php` endpoint specifying the needed parameter to trigger the `wp_remote_get` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=fetch_image_url&image_url=<LOCAL_SERVICE_ON_THE_SERVER_OR_NETWORK>
```

Below are some of the findings related to SSRF:

- [Critical Vulnerabilities Patched in WordPress Automatic Plugin](https://patchstack.com/articles/critical-vulnerabilities-patched-in-wordpress-automatic-plugin/)
- [Multiple High and Critical Vulnerabilities in Avada Theme and Plugin](https://patchstack.com/articles/multiple-high-and-critical-vulnerabilities-in-avada-theme-and-plugin/)
- [Multiple Vulnerabilities In Shortcodes Ultimate Plugin Versions <=5.12.6](https://patchstack.com/articles/authenticated-ssrf-arbitrary-file-read-in-shortcodes-ultimate-plugin-unsafe-features/)