---
title: Cross-Site Request Forgery (CSRF)
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible ways to secure the code from CSRF vulnerability on WordPress. This includes applying a proper function to check for an anti-CSRF token, or in this case, a nonce value to prevent a malicious actor from tricking other users to perform unwanted actions.

By default, processes on hooks or functions that are used on plugins or themes don't have a permission and nonce value check, that's why the developer needs to manually perform a permission check and also a nonce check.

## Affected Hooks

Below are some of the hooks and actions that are used to handle sensitive actions and are potentially vulnerable to a CSRF attack if there is no nonce check applied:

- `wp_ajax_nopriv_{$action}`
- `wp_ajax_{$action}`
- `admin_init`
- `init`
- `admin_post_nopriv_{$action}`
- `admin_post_{$action}`
- `load-{$pagenow}`
- `admin_notices`

Other hooks also can be affected by a CSRF attack if not properly implemented a nonce check. 

In some cases, CSRF can also exist outside of the above hooks. This kind of CSRF usually exists on a normal function or hook that is not expected to have a sensitive action process.

## Nonce Check

Nonce check for an authenticated context, should always be paired with a permission check. To properly check a user's nonce value, WordPress Core provides users with a couple of functions that can be easily used:

### [`wp_verify_nonce`](https://developer.wordpress.org/reference/functions/wp_verify_nonce/)

This function verifies that a correct security nonce was used with a time limit (by default, 24 hours). This function accepts two parameters:
- the nonce value supplied by the user
- an action value that will be checked. 

The implementation of this function should be performed with permission check using the `current_user_can()` function or other permission check process:

```php
add_action("init", "check_if_update_3");

function check_if_update_3(){
    if(isset($_GET["update"])){
        if(current_user_can("manage_options")){
            if(wp_verify_nonce($_POST["sec_nonce"], "update-user-data")){
                update_option("user_data", sanitize_text_field($_GET_["data"]));
            }
        }
    }
}
```

### [`check_admin_referer`](https://developer.wordpress.org/reference/functions/check_admin_referer/)

Similar to the `wp_verify_nonce` function, this function's main purpose is also to check the validity of a nonce value. The only difference is that this function is intended for requests that come from the admin panel. This function accepts two parameters:
- the action value that will be checked 
- the key to check for the nonce in the `$_REQUEST` global variable (Default key value is `_wpnonce`)

The implementation of this function should be performed with permission check using the `current_user_can()` function or other permission check process:

```php
add_action("admin_init", "delete_admin_menu_3");

function delete_admin_menu_3(){
    if(isset($_POST["delete"])){
        if(current_user_can("manage_options") && check_admin_referer("delete-admin-menu")){
            delete_option("custom_admin_menu");
        }
    }
}
```

### [`check_ajax_referer`](https://developer.wordpress.org/reference/functions/check_ajax_referer/)

This function is very similar to the `check_admin_referer` function. The main difference is that this function is intended for AJAX requests. Another difference is that this function accepts a third parameter called `$stop` with a boolean value that will determine whether to stop early when the nonce cannot be verified (default value is `true`).

Supplying a `false` value to this function will make the nonce check useless. With that condition, we don't need to set the third parameter for most possible actions. The implementation of this function should be performed with permission check using the `current_user_can()` function or other permission check process:

```php
add_action("wp_ajax_update_post_data", "update_post_data_3");

function update_post_data_3(){
    if(!current_user_can("manage_options")){
        die("No permission");
    }

    check_ajax_referer("update-post-data", "security");
    
    if(isset($_POST["update"])){
        $post_id = get_post($_POST["id"]);
        update_post_meta($post_id, "data", sanitize_text_field($_POST["data"]));
    }
}
```