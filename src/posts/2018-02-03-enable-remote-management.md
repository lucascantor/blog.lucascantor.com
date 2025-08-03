---
title: Enable Remote Management
excerpt: 'Configure Apple Remote Desktop access and privileges from the command line using the kickstart utility.'
date: 2018-02-03
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
featured: false
tags:
  - Old Post
disclaimer:
  text: This is an old post. Content may be out of date.
---

Apple Remote Desktop can be enabled and configured via the command line:

Grant all remote control privileges to user johnsmith:

```bash
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -access -on -users johnsmith -privs -all -restart -agent -menu
```

Revoke all remote control privileges for all users, to clear unwanted settings:

```bash
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -configure -access -off
```

Grant ability to request screen sharing only, with explicit confirmation from the current user:

```bash
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -allowAccessFor -specifiedUsers -clientopts -setreqperm -reqperm yes -setvnclegacy -vnclegacy no -setmenuextra -menuextra no
```

[Gist on GitHub](https://gist.github.com/lucascantor/45440c528d31b52729be35f014d6e7c5)
