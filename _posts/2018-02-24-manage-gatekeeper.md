---
layout: post
title:  "Manage Gatekeeper"
date:   2018-02-24 11:17:00 -0800
categories: mac security Gatekeeper
---
The `spctl` utility can be used to manage the configuraton of macOS' [Gatekeeper security system](https://support.apple.com/en-us/HT202491).

Check current Gatekeeper configuration status:

```
spctl --status
```

Disable Gatekeeper entirely:

```
spctl --master-disable
```

Enable Gatekeeper again:

```
spctl --master-disable
```

Reset all user-defined Gatekeeper rules:

```
spctl --reset-default
```

[Gist on GitHub](https://gist.github.com/lucascantor/466560f7c2f604be53a09b9be8a7d915)
