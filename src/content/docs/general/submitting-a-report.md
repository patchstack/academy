---
title: How to submit a proper report?
sidebar:
  order: 2
contributors:
    - dhakalananda
---

Finding a security vulnerability is very cool. However, properly reporting and communicating that vulnerability is equally important. In this section, we go through a detailed overview of how to properly submit a security vulnerability to Patchstack.

Reporting a security issue can be divided into three parts:

- Details of the affected component
- Details of the vulnerability
- Details of the researcher

### Component Details

In this section, we go through all the fields of the component details.

**Component type**

You need to select whether the issue was found in a plugin, theme or the WP core itself.

Example:

![Component Type](../../../assets/images/submitting-report/component-type.png)

**Component Name**

This field is self-explanatory. The name of the affected component needs to entered in this field.

**Vulnerable version**

This field needs to be filled with the vulnerable version of the plugin/theme. For an example, if the vulnerable version is `13.37`, the field value should be `<= 13.37`. While the `<= ` is optional, we recommend setting it up since the vulnerable version is not `13.37` only but upto `13.37`.

**Component Slug**

This field needs to have the slug of the affected component. You can access the plugin slug through the plugin repository in WordPress. The format looks like this: `https://wordpress.org/plugins/SLUG` where SLUG is the plugin slug. It is the same for themes.

**Component Link**

A link to the component repository where one can download/access the plugin/theme. For an example: `https://wordpress.org/plugins/elementor`

Example:

![Component Type](../../../assets/images/submitting-report/component-details.png)


### Vulnerability Details

After the component information is completed, it's time to enter the vulnerability details. This is the most crucial part of the report and plays a huge role in how quickly the report is processed.

#### OWASP 2017: TOP 10

**Vulnerability class**

You need to select the proper OWASP Top 10 vulnerability class from the drop-down menu. If you cannot find the exact match for the issue you've found, try to select the closet bug class that resembles the vulnerability.

**Vulnerability type**

This field offers a wider range of vulnerability types. Select the proper class from the list. If you cannot find the match here too, you can select the Unknown option.

Example:

![Component Type](../../../assets/images/submitting-report/vuln-class.png)


#### Pre-requisite

You need to select what's the least privileged required to exploit the vulnerability.

Example:

![Component Type](../../../assets/images/submitting-report/prerequisite.png)

#### Vulnerability details

**Short description**

This fields requires the brief information about the vulnerability. It can be a short description of what the vulnerability is, what is affected and what's the impact of the issue.

**How to reproduce**

A clear step-by-step reproduction steps for the issue is the most important part of reporting. This fields needs to be filled with that data. You may include HTTP requests, PoC scripts, prerequisite steps, and all the necessary details for reproducing the vulnerability in this field.

**Additional information**

This is an optional field that can be used to provide additional information that might be a help for triagers and vendors. Code tracing of the vulnerability, and mitigating suggestions are some of the examples of such information.

**Attach files**

This is also an optional field if you wish to attach video PoC or scripts. A full report in a PDF or a text file with all the necessary information is also accepted.

Example:

![Component Type](../../../assets/images/submitting-report/vuln-information.png)


#### Submitter details

This is left as a task for the researchers.

### How not to report?

- Wrong component information
- Attaching a video PoC only
- Description of the vulnerability without a proper PoC
