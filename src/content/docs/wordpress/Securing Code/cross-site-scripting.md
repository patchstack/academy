---
title: Cross-Site Scripting (XSS)
contributors:
    - rafiem
---

## Introduction

This article covers possible ways to secure the code from XSS vulnerability on WordPress. This includes applying a proper function to sanitize and escape the user’s input value.

Depending on the context of the process, in most cases, the user’s input will not be escaped or sanitized by default, that’s why the developer needs to manually process the input.

## [`esc_attr`](https://developer.wordpress.org/reference/functions/esc_attr/)

This function should be the main function to use when the developer wants to escape a string inside of an HTML attribute. It works by encoding the <, >, &, " and ' (less than, greater than, ampersand, double quote, and single quote) characters and will never double encode entities.

Only use this function inside of the HTML attributes where the escaped value is wrapped inside of a single or double quotes:

```php
<!-- This is correct: -->
<div class="<?php echo esc_attr( $_GET['class'] ); ?>"></div>

<!-- This is not correct, since the escaped string is not wrapped inside of quotes, resulting user can still inject arbitrary JS code via JS event handler: -->
<img src=<?php echo esc_attr( $_GET['url'] ); ?> />

```

## [`esc_html`](https://developer.wordpress.org/reference/functions/esc_html/)

This function should be the main function to use when the developer wants to escape a string for HTML blocks. This function will simply perform a wide HTML escape process to the string and will convert <, >, &, ", ' characters to HTML entities.

Developers can use this function when trying to escape a user's input outside of the HTML tag context:

```php
$text = "<p><b> Message for you: " . $_GET["message"] . "</b></p>";
echo esc_html( $text );
```