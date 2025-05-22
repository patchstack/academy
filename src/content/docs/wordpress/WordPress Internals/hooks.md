---
title: Hooks
contributors:
    - rafiem
---

## Introduction

This article covers descriptions and explanations about hooks in WordPress code. Hooks are a way for one piece of code to interact/modify another piece of code at specific, pre-defined spots. They make up the foundation for how plugins and themes interact with WordPress Core, but they’re also used extensively by Core itself.

There are two types of hooks: Actions and Filters. To use either, you need to write a custom function known as a Callback, and then register it with a WordPress hook for a specific action or filter.

## [`init`](https://developer.wordpress.org/reference/hooks/init/)

The `init` hook runs after the WordPress environment is loaded but before the current request is processed. This hook also allows developers to register custom post types, and taxonomies, or perform other tasks that need to be executed early in the WordPress loading process. 

A lot of the time, developers attach a function to this hook to view or process sensitive data without proper permission and nonce check.

This hook itself is accessible by unauthenticated users by default (also depends if the hook is registered outside from an additional permission check). Visiting the front page of a WordPress site should trigger the `init` hook.

An unauthenticated user can simply visit the front page of a WordPress instance and it will trigger any function that is attached to the `init` hook.

Example of hook implementation :

```php
add_action( 'init', 'process_post' );

function process_post() {
    if( isset( $_POST['unique_hidden_field'] ) ) {
    // process $_POST data here, possibly need to add permission and nonce check first
    }
}
```

## [`admin_init`](https://developer.wordpress.org/reference/hooks/admin_init/)

The `admin_init` hook is commonly used by developers to perform various tasks when the WordPress admin panel is loaded. These tasks can include adding custom menus, registering custom post types or taxonomies, initializing settings, and performing security checks or authentication for admin-specific actions.

This hook is similar to the `init` hook but it only fires as an admin screen or script is being initialized. This hook does not just run on user-facing admin screens, it also runs on the `admin-ajax.php` and `admin-post.php` endpoint as well.

Example of hook implementation :

```php
function myplugin_settings() {
    register_setting( 'myplugin', 'myplugin_setting_1', 'intval' );
    register_setting( 'myplugin', 'myplugin_setting_2', 'intval' );
}
add_action( 'admin_init', 'myplugin_settings' );
```

Since this hook also runs on the `admin-ajax.php` and `admin-post.php` endpoint, an unauthenticated user can trigger this hook by simply visiting the URL below:

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=heartbeat
```

## [`wp_ajax_{$action}`](https://developer.wordpress.org/reference/hooks/wp_ajax_action/)

This hook allows developers to handle custom AJAX endpoints. The `wp_ajax_` hooks follow the format `wp_ajax_$action`, where `$action` variable comes from the `action` GET/POST parameter submitted to the `admin-ajax.php` endpoint.

This hook only fires for **logged-in** users, so by default, only users with the **Subscriber+** role can access the attached function on the hook. A proper permission and nonce check is still needed to secure the function attached to this hook.

Example of hook implementation :

```php
add_action( 'wp_ajax_foobar', 'my_ajax_foobar_handler' );

function my_ajax_foobar_handler() {
    // Make your response and echo it.

    // Don't forget to stop execution afterward.
    wp_die();
}
```

## [`wp_ajax_nopriv_{$action}`](https://developer.wordpress.org/reference/hooks/wp_ajax_nopriv_action/)

This hook is functionally the same as `wp_ajax_{$action}`, except the `nopriv` variant is used for handling AJAX requests from unauthenticated users, i.e. when the `is_user_logged_in()` function returns false.

## [`admin_action_{$action}`](https://developer.wordpress.org/reference/hooks/admin_action_action/)

This hook is equivalent to `wp_ajax_` hook but on a different endpoint. Similar to `wp_ajax_`, the `admin_action` hooks follow the format `admin_action_$action`, where `$action` variable comes from the `action` GET/POST parameter. The only difference is that the URL to hit the request must be to `/wp-admin/admin.php` endpoint.

This hook only fires for **logged-in** users, so by default, only users with the **Subscriber+** role can access the attached function on the hook. A proper permission and nonce check is still needed to secure the function attached to this hook.

Example of hook implementation :

```php
add_action( 'admin_action_foobar', 'my_ajax_foobar_handler' );

function my_ajax_foobar_handler() {
    echo "Execution successful";
    wp_die();
}
```

A logged-in user can send the below request adding their cookies to execute the hook.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin.php?action=foobar
```

## [`template_redirect`](https://developer.wordpress.org/reference/hooks/template_redirect/)

The `template_redirect` is used for cases when a feature needs to be implemented right after querying WP site, but before determining which template to load.

This hook fires after loading the homepage of the WordPress site.

Example of hook implementation :

```php
add_action( 'template_redirect', 'my_ajax_foobar_handler' );

function my_ajax_foobar_handler() {
    if ( isset( $_GET['unique_hidden_field'] ) ) {
        echo "Execution successful";
        wp_die();    
    }
}
```

An unauthenticated user can send the below request to execute the hook.

```bash
curl <WORDPRESS_BASE_URL>/?unique_hidden_field=1
```

Below are some of the vulnerabilities that acted as a starting point from `template_redirect` hook:

- [Critical LFI to RCE Vulnerability in WP Ghost Plugin Affecting 200k+ Sites](https://patchstack.com/articles/critical-lfi-to-rce-vulnerability-in-wp-ghost-plugin-affecting-200k-sites/)


## [`admin_notices`](https://developer.wordpress.org/reference/hooks/admin_notices/)

The `admin_notices` hook is used to add custom notices in the WordPress admin dashboard. These notices can serve various purposes, such as warning users about missing settings, confirming successful actions, or promoting premium features. This hook fires on loading the WordPress admin dashboard `/wp-admin` page.

Example of hook implementation :

```php
add_action( 'admin_notices', 'admin_notice_handler' );

function admin_notice_handler() {
    echo '<div class="notice notice-success"><p>' . $_GET['notice'] . '</p></div>';
    wp_die();
}
```

An unauthenticated user can send the below request to execute the hook.

```bash
curl <WORDPRESS_BASE_URL>/?notice=XSS_PAYLOAD
```