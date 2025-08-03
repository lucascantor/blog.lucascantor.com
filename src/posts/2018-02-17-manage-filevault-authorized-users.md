---
title: Manage FileVault-Authorized Users
excerpt: 'Add or remove users authorized to unlock FileVault encrypted boot volumes using the fdesetup command line utility.'
date: 2018-02-17
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
featured: false
tags:
  - Old Post
disclaimer:
  text: This is an old post. Content may be out of date.
---

The `fdesetup` utility can be used to manage which users are authorized to unlock FileVault encrypted boot volumes:

```bash
fdesetup add -usertoadd <username>
```

You will be prompted for the password of an existing FileVault-authorized user account, or the FileVault recovery key, and the password of the user account in question to be added.

[Gist on GitHub](https://gist.github.com/lucascantor/235b3254bdef2b78bfe8536ff6da6124)

Similarly, you can remove users from being authorized to unlock FileVault encrypted boot volumes as well:

```bash
fdesetup remove -user <username>
```

[Gist on GitHub](https://gist.github.com/lucascantor/5c89e45d2b0f18288a27fa9e204abf68)
