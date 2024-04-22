---
title: Functions
contributors:
    - rafiem
---

## Introduction

This article covers descriptions and explanations about functions in WordPress code.

## [`current_user_can`](https://developer.wordpress.org/reference/functions/current_user_can/)

This function basically will check whether the current user has the specified capability. This function also accepts an ID of an object to check against if the capability is a meta capability. Meta capabilities such as `edit_post` and `edit_user` are capabilities used by the `map_meta_cap` function to map to primitive capabilities that a user or role has, such as `edit_posts` and `edit_others_posts`.

For details regarding the default WordPress Role and Capabilities, please refer to the official documentation [here](https://wordpress.org/documentation/article/roles-and-capabilities/).

Example of function implementation :

```php
current_user_can( 'edit_posts' );
current_user_can( 'edit_post', $post->ID );
current_user_can( 'manage_options' );
```

## [`wp_verify_nonce`]()

One of the functions to check for nonce value. This function will verify that a correct security nonce was used with a time limit. A nonce is valid for 24 hours (by default).

The function is used to verify the nonce sent in the current request usually accessed by the `$_REQUEST` PHP variable. 

Nonces should never be relied on for authentication authorization, or access control. Protect your functions using the `current_user_can` function, always assume the nonce value can be compromised.

Example of function implementation :

```php
$nonce = $_REQUEST['_wpnonce'];
if ( ! wp_verify_nonce( $nonce, 'my-nonce' ) || ! current_user_can("manage_options")) {
  die( __( 'Security check', 'textdomain' ) ); 
} else {
  // Do stuff here.
}
```


## [`check_admin_referer`]()

One of the functions available to check for nonce value. This function ensures intent by verifying that a user was referred from another admin page with the correct security nonce.

Nonces should never be relied on for authentication authorization, or access control. Protect your functions using the `current_user_can` function, always assume the nonce value can be compromised.

Example of function implementation :

```php
<?php
// if this fails, check_admin_referer() will automatically print a "failed" page and die.
if ( ! empty( $_POST ) && check_admin_referer( 'name_of_my_action', 'name_of_nonce_field' ) && current_user_can("manage_options") ) {
  // process form data, e.g. update fields
}

// Display the form
```

## [`check_ajax_referer`]()

One of the functions to check for nonce value. This function verifies the Ajax request to prevent processing requests external to the blog by checking the nonce value.

Nonces should never be relied on for authentication authorization, or access control. Protect your functions using the `current_user_can` function, always assume the nonce value can be compromised.

Example of function implementation :

```php
/**
 * Check the referrer for the AJAX call.
 */
function wpdocs_action_function() {
  if(!current_user_can("manage_options")){
    die;
  }

  check_ajax_referer( 'wpdocs-special-string', 'security' );
  echo sanitize_text_field( $_POST['wpdocs_string'] );
  die;
}
add_action( 'wp_ajax_wpdocs_action', 'wpdocs_action_function' );
```


## [`register_rest_route`](https://developer.wordpress.org/reference/functions/register_rest_route/)

One of the functionalities or functions that are sometimes missed from a hacker's point of view. This function's purpose is to register a custom REST API route in the context of a plugin or theme. 

This function accepts `$args` as the third argument. The `$args` itself is either an array of options for the endpoint or an array of arrays for multiple methods. One of the `$args` parameter values is [`permission_callback`](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/#permissions-callback). 

The parameter should be attached with a function that checks if the user can perform the action (reading, updating, etc) before the real callback is called. This allows the API to tell the client what actions they can perform on a given URL without needing to attempt the request first.