---
title: Manage Gatekeeper
excerpt: 'Manage macOS Gatekeeper security system configuration from the command line using the spctl utility.'
date: 2018-02-24
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-02-24-manage-gatekeeper.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

The `spctl` utility can be used to manage the configuraton of macOS' [Gatekeeper security system](https://support.apple.com/en-us/HT202491).

Check current Gatekeeper configuration status:

```bash
spctl --status
```

Disable Gatekeeper entirely:

```bash
spctl --master-disable
```

Enable Gatekeeper again:

```bash
spctl --master-disable
```

Reset all user-defined Gatekeeper rules:

```bash
spctl --reset-default
```

[Gist on GitHub](https://gist.github.com/lucascantor/466560f7c2f604be53a09b9be8a7d915)
