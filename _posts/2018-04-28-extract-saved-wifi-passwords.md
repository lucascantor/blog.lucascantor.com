---
layout: post
title:  "Extract Saved WiFi Passwords from the macOS Keychain"
date:   2018-04-28 08:55:00 -0700
categories: mac wifi password keychain
---
You can extract saved wifi passwords from the macOS Keychain using the `security` command:

```
security find-generic-password -ga "<SSID HERE>" | grep password:
```

Simply replace `<SSID HERE>` with the name of the WiFi network in question:

```
security find-generic-password -ga "Smith Home WiFi" | grep password:
```

You'll be prompted for an administrator's username and password, and then the WiFi network password will be revealed:

```
password: "ForgetM3N0t"
```

[Gist on GitHub](https://gist.github.com/lucascantor/fa0ab626d8bacba2556c1b77ba10b0bd)
