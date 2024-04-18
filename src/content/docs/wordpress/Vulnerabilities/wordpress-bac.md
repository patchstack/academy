---
title: Broken Access Control
---

## Introduction

This section covers cases of possible Broken Access Control on WordPress. This includes improper hook/function/code usage inside of the plugin/theme which can be used to access or update sensitive information.

## [`init`](https://developer.wordpress.org/reference/hooks/init/) hook

The `init` hook runs after the WordPress environment is loaded but before the current request is processed. This hook also allows developers to register custom post types, taxonomies, or perform other tasks that need to be executed early in the WordPress loading process. 

A lot of the time, developers attach a function to this hook to view or process sensitive data without proper permission and nonce check.

This hook itself is accessible by unauthenticated users by default (also depends if the hook is registered outside from an additional permission check). Visiting the front page of a WordPress site should trigger the `init` hook.

Example of vulnerable code :

```php
add_action("init", "check_if_update");

function check_if_update(){
    if isset($_GET["update"]){
        update_option("user_data", sanitize_text_field($_GET_["data"]));
    }
}
```

In order to exploit this, unauthenticated user just need to visit the front page of a WordPress site and specify the parameter to trigger the `update_option` function which in this case will modify sensitive information.

```bash
curl <WORDPRESS_BASE_URL>/?update=1&data=test
```

## [`admin_init`](https://developer.wordpress.org/reference/hooks/admin_init/) hook

The `admin_init` hook is commonly used by developers to perform various tasks when the WordPress admin panel is loaded. These tasks can include adding custom menus, registering custom post types or taxonomies, initializing settings, and performing security checks or authentication for admin-specific actions.

This hook is similar to the `init` hook but it only fires as an admin screen or script is being initialized. This hook does not just run on user-facing admin screens, it also runs on `admin-ajax.php` and `admin-post.php` endpoint as well.

Since this hook also runs on `admin-ajax.php` and `admin-post.php` endpoint, an unauthenticated user is able to trigger this hook.

Example of vulnerable code :

```php
add_action("admin_init", "delete_admin_menu");

function delete_admin_menu(){
    if isset($_POST_["delete"]){
        delete_option("custom_admin_menu");
    }
}
```

In order to exploit this, the unauthenticated user just needs to perform a POST request to the `admin-ajax.php` and `admin-post.php` endpoint specifying the needed parameter to trigger the `delete_option` function to remove sensitive data.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=heartbeat -d "delete=1"
```

## [`wp_ajax_{$action}`](https://developer.wordpress.org/reference/hooks/wp_ajax_action/) hook

This hook allows developers to handle custom AJAX endpoints. The `wp_ajax_` hooks follow the format `wp_ajax_$action`, where `$action` variable comes from `action` GET/POST parameter submitted to the `admin-ajax.php` endpoint.

This hook only fires for **logged-in** users, so by default, only users with **Subscriber+** role can access the attached function on the hook. A proper permission and nonce check is still needed to secure the function attached to this hook.

Example of vulnerable code :

```php
add_action("wp_ajax_update_post_data", "update_post_data");

function update_post_data(){
    if isset($_POST_["update"]){
        $post_id = get_post($_GET["id"]);
        update_post_meta($post_id, "data", sanitize_text_field($_POST["data"]));
    }
}
```

In order to exploit this, any authenticated user (**Subscriber+** role) just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `update_post_meta` function to update arbitrary WP Post meta data.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=update_post_data&update=1 -d "id=1&data=changed"
``` 

## [`wp_ajax_nopriv_{$action}`](https://developer.wordpress.org/reference/hooks/wp_ajax_nopriv_action/) hook

This hook is functionally the same as `wp_ajax_{$action}`, except the `nopriv` variant is used for handling AJAX requests from unauthenticated users, i.e. when `is_user_logged_in()` function returns false.

Example of vulnerable code :

```php
add_action("wp_ajax_nopriv_toggle_menu_bar", "toggle_menu_bar");

function toggle_menu_bar(){
    if ($_POST_["toggle"] === "1"){
        update_option("custom_toggle", 1);
    }
    else{
        update_option("custom_toggle", 0);
    }
}
```

In order to exploit this, any unauthenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `update_option` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=toggle_menu_bar -d "toggle=1"
``` 

## [`register_rest_route`](https://developer.wordpress.org/reference/functions/register_rest_route/) function

One of the functionalities or functions that are sometimes missed from a hacker's point of view. This function's purpose is to register a custom REST API route in the context of a plugin or theme. 

This function accepts `$args` as the third argument. The `$args` itself is either an array of options for the endpoint or an array of arrays for multiple methods. One of the `$args` parameter values is [`permission_callback`](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/#permissions-callback). 

The parameter should be attached with a function that checks if the user can perform the action (reading, updating, etc) before the real callback is called. This allows the API to tell the client what actions they can perform on a given URL without needing to attempt the request first.

Sometimes, developers don't implement a proper permission check on the custom REST API route and use `__return_true` string as the permission callback. This makes the custom REST API route to be publicly accessible.

```php
add_action( 'rest_api_init', function () {
  register_rest_route( 'myplugin/v1', '/delete/author', array(
    'methods' => 'POST',
    'callback' => 'delete_author_user',
    'permission_callback' => '__return_true',
  ) );
} );

function delete_author_user($request){
    $params = $request->get_params();
    wp_delete_user(intval($params["user_id]));
}
```

In order to exploit this, any unauthenticated user just needs to perform a POST request to the `/wp-json/myplugin/v1/delete/author` endpoint specifying the needed parameter to trigger the `wp_delete_user` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-json/myplugin/v1/delete/author -d "user_id=1"
``` 

Other cases could exist where developers already specify a proper function on the `permission_callback` parameter, however, the permission check implemented inside the function itself is not proper to what process can be done from the REST API route `callback` function.