---
title: PHP Object Injection
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible PHP Object Injection on WordPress. This includes improper usage of the unserialization process inside of the plugin/theme which can be used to inject an arbitrary PHP object which in the worst case could turn into RCE depending on the available gadget chain.

## Useful Functions

Several functions could be useful to identify a possible PHP Object Injection vulnerability:

- [`unserialize`](https://www.php.net/manual/en/function.unserialize.php)
- [`maybe_unserialize`](https://developer.wordpress.org/reference/functions/maybe_unserialize/)

## Gadget Chain

To achieve a maximum impact from a PHP Object Injection, we need to have a proper gadget chain. A gadget chain, also known as a POP chain, is a string that is provided as the first parameter (in one way or another) to the function `unserialize` or `maybe_unserialize` in the WordPress context. The string representing the gadget chain is specially crafted to instantiate one or multiple objects that will take advantage of the execution flow of a PHP script by either taking benefit of the application logic or leveraging one of the magic methods that will be presented.

At Patchstack and most of the other companies that act as CNA in the WordPress ecosystem, we still accept a PHP Object Injection report without a proper gadget chain and will assign a maximum possible impact to the report.

We can search for a gadget chain inside of the affected plugin or theme that is vulnerable to a PHP Object Injection. Generally, we can also search for a gadget chain inside of the WordPress Core itself. This [PHPGGC](https://github.com/ambionics/phpggc/tree/master/gadgetchains/WordPress) tool by Ambionics is a great resource for a known gadget chain for WordPress Core.

To create an example PoC for PHP Object Injection vulnerability, we recommend adding an example class to the `wp-config.php` like this one:

```php
// Example class for PHP Object Injection PoC
class ObjectInjection
{
   public $test;

   function __destruct(){
        die("PHP Object Injection: " . $this->test);
   }
}
```


The above example class will be serialized to this string:

```json
O:15:"ObjectInjection":1:{s:4:"test";N;}
```

## Example Cases

Below is an example of vulnerable code:

```php
function load_ig_data() {
	$data = isset( $_GET['data'] ) ? (string) $_GET['data'] : '';

	list( $hash, $value ) = explode( ':', $data, 2 );

	if ( empty( $value ) || empty( $hash ) ) {
		wp_send_json_error( 'Invalid data' );
	}

	$atts     = maybe_unserialize( base64_decode( $value ) );
	$tick     = ceil( time() / MONTH_IN_SECONDS );
	$expected = substr( wp_hash( $tick . $value ), -12, 10 );

	if ( ! hash_equals( $expected, $hash ) ) {
		wp_send_json_error( 'Invalid hash' );
	}


	wp_send_json_success( "testing success" );
}

add_action( 'wp_ajax_nopriv_load_ig_data', 'load_ig_data' );
```

To exploit this, any unauthenticated user just needs to perform a POST request to the `/wp-admin/admin-ajax.php` endpoint specifying the needed parameter to trigger the `maybe_unserialize` function.

```bash
curl "<WORDPRESS_BASE_URL>/wp-admin/admin-ajax.php?action=load_ig_data&data=x:<BASE64_ENCODEDED_OF_GENERATED_PHP_OBJECT_INJECTION_PAYLOAD"
```

Below are some of the findings related to PHP Object Injection:

- [Unauthenticated PHP Object Injection in Flatsome Theme <= 3.17.5](https://patchstack.com/articles/unauthenticated-php-object-injection-in-flatsome-theme-3-17-5/)
- [Unauthenticated PHP Object Injection in Gravity Forms Plugin <= 2.7.3](https://patchstack.com/articles/unauthenticated-php-object-injection-in-gravity-forms-plugin/)
- [User Registration Plugin Vulnerability](https://patchstack.com/articles/authenticated-php-object-injection-in-user-registration-plugin/)
- [Critical Vulnerabilities Patched in REHub Theme and Plugin](https://patchstack.com/articles/critical-vulnerabilities-patched-in-rehub-theme-and-plugin/)
- [Multiple Vulnerabilities Patched in Themify Ultra Theme](https://patchstack.com/articles/multiple-vulnerabilities-patched-in-themify-ultra-theme/)