---
layout: post
title:  "Enable Remote Management"
date:   2018-02-03 08:03:00 -0800
categories: mac remote management
---
Apple Remote Desktop can be enabled and configured via the command line:

Grant all remote control privileges to user johnsmith:
```
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -access -on -users johnsmith -privs -all -restart -agent -menu
```

Revoke all remote control privileges for all users, to clear unwanted settings:
```
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -configure -access -off
```

Grant ability to request screen sharing only, with explicit confirmation from the current user:
```
/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -allowAccessFor -specifiedUsers -clientopts -setreqperm -reqperm yes -setvnclegacy -vnclegacy no -setmenuextra -menuextra no
```

[Gist on GitHub](https://gist.github.com/lucascantor/45440c528d31b52729be35f014d6e7c5)
