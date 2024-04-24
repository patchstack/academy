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

