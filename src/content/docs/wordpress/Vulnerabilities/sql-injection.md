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