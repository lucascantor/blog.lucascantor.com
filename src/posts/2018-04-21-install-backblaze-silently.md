---
title: Install Backblaze Silently from the Command Line
excerpt: 'Install Backblaze backup software silently from the command line using bzinstall_mate with group credentials.'
date: 2018-04-21
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/philip-oroni-fcaNA1-nqM4-unsplash.jpg'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

You can install Backblaze silently from the command line by running the `bzinstall_mate` utility within the `Backblaze Installer.app`.

### Prerequisite Steps:

- Sign in to your group admin’s Backblaze account.
- Create a Backblaze group (or find an existing group).
- From the Invite & Approve page for that group, click on the "Advanced Deployment Instructions" button
  - Locate the `groupID` and `groupToken` for that group.

### Command to Execute on Each Mac:

```bash
/Volumes/Backblaze\ Installer/Backblaze\ Installer.app/Contents/MacOS/bzinstall_mate -nogui -createaccount <user@corp.com> <password> <groupID> <groupToken>
```

The `none` value can be passed in for the password parameter, so an automatically generated password will be used and the user can request a password reset on the Backblaze website, e.g.,

```bash
/Volumes/Backblaze\ Installer/Backblaze\ Installer.app/Contents/MacOS/bzinstall_mate -nogui -createaccount jsmith@acme.com none 19347619 974g9q7gtq9tgq0gg
```

[Gist on GitHub](https://gist.github.com/lucascantor/a9aaeaa7414523c36711a5adc5d19d05)

[More Details from BackBlaze](https://help.backblaze.com/hc/en-us/articles/115002549693-Backblaze-Mass-Silent-Install)
