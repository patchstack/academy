---
title: Broken Access Control
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible ways to secure the code from a common Broken Access Conrol vulnerability on WordPress. This includes applying a proper function to check for users permission.

By default, processes on hooks or functions that are used on plugins or themes don't have a permission and nonce value check, that's why the developer needs to manually perform a permission check and also a nonce check.

## Affected Hooks

Below are some of the hooks and actions that are mostly used to handle sensitive actions and potentially vulnerable to a Broken Access Control attack if there is no permission and nonce check applied:

- `wp_ajax_nopriv_{$action}`
- `wp_ajax_{$action}`
- `admin_init`
- `init`
- `admin_post_nopriv_{$action}`
- `admin_post_{$action}`
- `load-{$pagenow}`
- `admin_notices`

Above lists are only an example of hooks that are commonly used to handle sensitive actions on the plugin or theme. There are others hooks that are also could be affected by a Broken Access Control attack if not properly implement a permission check. 

For some cases, Broken Access Control can also exist outside of the above hooks that are implemented. This kind of Broken Access Control usually exist on a normal function or hook that are not expected to have a sensitive action process.

## Permission Check

Permission check for an authenticated context, should always be paired with a nonce check. To properly check user's permission, WordPress Core provide users with a couple of function that can be easily used:

### [`current_user_can`](https://developer.wordpress.org/reference/functions/current_user_can/)

This function should be the main function to check for users permission in the WordPress context. This function will check whether the current user has the specified capability.

This function also accepts an ID of an object to check against if the capability is a meta capability. Meta capabilities such as `edit_post` and `edit_user` are capabilities used by the `map_meta_cap()` function to map to primitive capabilities that a user or role has, such as `edit_posts` and `edit_others_posts`. The implementation of this function for most cases should be performed with nonce check using `wp_verify_nonce()` function or other nonce check function.

For detailed list of default roles and capabilities in WordPress, please refer to [`this`](https://wordpress.org/documentation/article/roles-and-capabilities/) official documentation.

One of the example implementation of the function is when developer when to check if certain users has a `manage_options` capability which is by default is attached to the administrator+ role users. The example implementation for such case:

```php
add_action("init", "check_if_update_4");

function check_if_update_4(){
    if(isset($_GET["update"])){
        if(current_user_can("manage_options")){
            if(wp_verify_nonce($_POST["sec_nonce"], "update-user-data")){
                update_option("user_data", sanitize_text_field($_GET_["data"]));
            }
        }
    }
}
```

Another example of case is where the developer when to check if the current user has a capability or permission to edit a specific post object. The example implementation for such case:

```php
add_action("wp_ajax_update_post_data", "update_post_data_4");

function update_post_data_4(){
    if(!current_user_can("edit_post", $_POST["id"])){
        die("No permission");
    }

    check_ajax_referer("update-post-data", "security");
    
    if(isset($_POST["update"])){
        $post_id = get_post($_POST["id"]);
        update_post_meta($post_id, "data", sanitize_text_field($_POST["data"]));
    }
}
```

### [`wp_get_current_user`](https://developer.wordpress.org/reference/functions/wp_get_current_user/)

Other alternative to check for user permission is by utilizing this function. The function itself is not a direct process for checking user permission. This function only retrieves the current user object and developer able to then check for user permission by checking their role, for example. The implementation of this function for most cases should be performed with nonce check using `wp_verify_nonce()` function or other nonce check function.

Example implementation:

```php

add_action("admin_init", "delete_admin_menu_4");

function delete_admin_menu_4(){
    if(isset($_POST["delete"])){
        check_admin_referer("delete-admin-menu");
        $user = wp_get_current_user();

        if ( in_array( 'administrator', (array) $user->roles ) ) {
            delete_option("custom_admin_menu");
        }
        
    }
}
```


## Common Misconception

It is known that in WordPress, there is a misconception for a certain function. The function naming can indicate that the function can be used to check for permission, while the real case scenario is that the function actually can't be used to check for user permission. 

One of the function is the [`is_admin`](https://developer.wordpress.org/reference/functions/is_admin/) function. Many developers use this function and assume that this function will check if the user is an administrator role user. However, this function actually only checks that the request is being sent to an admin related page such as `wp-admin` endpoint and this endpoint can be easily accessed by any authenticated users.