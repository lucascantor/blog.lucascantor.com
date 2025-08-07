---
title: Extract Saved WiFi Passwords from the macOS Keychain
excerpt: 'Extract saved WiFi network passwords from the macOS Keychain using the security command.'
date: 2018-04-28
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/getty-images-OWyivWiF7pU-unsplash.jpg'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

You can extract saved wifi passwords from the macOS Keychain using the `security` command:

```bash
security find-generic-password -ga "<SSID HERE>" | grep password:
```

Simply replace `<SSID HERE>` with the name of the WiFi network in question:

```bash
security find-generic-password -ga "Smith Home WiFi" | grep password:
```

You'll be prompted for an administrator's username and password, and then the WiFi network password will be revealed:

```bash
password: "ForgetM3N0t"
```

[Gist on GitHub](https://gist.github.com/lucascantor/fa0ab626d8bacba2556c1b77ba10b0bd)
