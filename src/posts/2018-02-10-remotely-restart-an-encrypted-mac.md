---
title: Remotely Restart an Encrypted Mac
excerpt: 'Use fdesetup authrestart to remotely restart FileVault-encrypted Macs without requiring physical keyboard access.'
date: 2018-02-10
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

The `fdesetup` utility can be used to remotely restart a Mac without needing physical in-person keyboard access to unlock FileVault on the next boot only:

```bash
fdesetup authrestart
```

You will be prompted for the password of a FileVault-enabled user account, or the FileVault recovery key.

After restarting, macOS will allow remote access via SSH immediately, without the usual need to unlock FileVault by logging in as a FileVault-enabled user sitting in front of the Mac in question. This is particularly useful for headless Mac mini servers, so you don't need to connect a monitor, keyboard, and mouse every single time they restart due to a software update, for example.

[Gist on GitHub](https://gist.github.com/lucascantor/d9a181515d39e3038ccf534ee76ae315)

Bonus - you can do this on Windows as well, with PowerShell:

```powershell
PowerShell -Command "Suspend-BitLocker -MountPoint "C:" -RebootCount 1"
shutdown /r /f
```

[Gist on GitHub](https://gist.github.com/lucascantor/80867e88f7996a38e23b02f5b4638c96)
