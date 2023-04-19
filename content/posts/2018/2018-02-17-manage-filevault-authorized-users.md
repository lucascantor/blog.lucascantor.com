---
title: Manage FileVault-Authorized Users
description:
date: 2018-02-17
tags:
  - mac
  - encryption
  - filevault
  - users
---

The `fdesetup` utility can be used to manage which users are authorized to unlock FileVault encrypted boot volumes:

```
fdesetup add -usertoadd <username>
```

You will be prompted for the password of an existing FileVault-authorized user account, or the FileVault recovery key, and the password of the user account in question to be added.

[Gist on GitHub](https://gist.github.com/lucascantor/235b3254bdef2b78bfe8536ff6da6124)

Similarly, you can remove users from being authorized to unlock FileVault encrypted boot volumes as well:

```
fdesetup remove -user <username>
```

[Gist on GitHub](https://gist.github.com/lucascantor/5c89e45d2b0f18288a27fa9e204abf68)
