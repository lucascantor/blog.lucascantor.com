---
title: Manage Gatekeeper
description:
date: 2018-02-24
disclaimer:
  text: This is an old post. Content may be out of date.
---

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
