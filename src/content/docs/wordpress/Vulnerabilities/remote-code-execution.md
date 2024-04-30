---
title: Remote Code Execution (RCE)
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible direct RCE on WordPress. This includes improper usage of functions inside of the plugin/theme which can be used to directly execute code or command on the server.

## Useful Functions

Several functions could be useful to identify a possible RCE vulnerability:

- [`system`](https://www.php.net/manual/en/function.system.php)
- [`exec`](https://www.php.net/manual/en/function.exec.php)
- [`shell_exec`](https://www.php.net/manual/en/function.shell-exec.php)
- [`passthru`](https://www.php.net/manual/en/function.passthru.php)
- [`proc_open`](https://www.php.net/manual/en/function.proc-open.php)
- [`eval`](https://www.php.net/manual/en/function.eval.php)
- [`call_user_func`](https://www.php.net/manual/en/function.call-user-func.php)
- [`call_user_func_array`](https://www.php.net/manual/en/function.call-user-func-array.php)
- [`create_function`](https://www.php.net/manual/en/function.create-function.php) *DEPRECATED as of PHP 7.2.0, and REMOVED as of PHP 8.0.0*

## Dynamic Function Call

PHP also supports a dynamic function call where we can execute a function from a string or variable. For example :

```php
$action_type = $_GET["action"];
$input = $_GET["input"];

echo $action_type($input);
```

We can just simply supply the `action` parameter with arbitrary function such as `system` and put our shell command on the `input` parameter.

## Example Cases

Below is an example of vulnerable code:

```php
function image_render_callback($atts) {
	$atts = shortcode_atts( array(
		'sanitize' => 'esc_attr',
		'src'=>'',
        'text'=>''
	), $atts);

    $chosen_callback = "esc_attr";
    $sanitize_callback = array("trim", "esc_attr", "esc_html", "sanitize_text_field");
    if(!in_array($atts["sanitize"], $sanitize_callback)){
        $chosen_callback = $atts["sanitize"];
    }

    if ( ! empty( $chosen_callback ) && is_callable( $chosen_callback ) ) {
        $text = call_user_func( $chosen_callback, $atts["text"] );
    }
    
    return sprintf("<img src='%s'>%s</img>", esc_attr($atts["src"]), $text);

}

add_shortcode("imagerender", "image_render_callback");
```

To exploit this, the Contributor+ role user simply needs to create a drafted post with the below content to trigger RCE via `call_user_func` function:

```json
[imagerender src="https://patchstack.com" sanitize="system" text="touch /tmp/pwned"]
```

Below are some of the findings related to RCE:

- [Authenticated RCE in JetElements For Elementor Plugin](https://patchstack.com/articles/authenticated-rce-in-jetelements-for-elementor-plugin/)
- [Critical RCE Patched in Bricks Builder Theme](https://patchstack.com/articles/critical-rce-patched-in-bricks-builder-theme/)
- [Critical Vulnerability Found in GOTMLS Plugin](https://patchstack.com/articles/critical-vulnerability-found-in-gotmls-plugin/)
- [Unpatched Authenticated RCE in Oxygen and Breakdance Builder](https://patchstack.com/articles/unpatched-authenticated-rce-in-oxygen-and-breakdance-builder/)