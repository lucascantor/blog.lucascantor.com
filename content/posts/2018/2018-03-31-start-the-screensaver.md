---
title: Start the Screensaver
description:
date: 2018-03-31
tags:
  - Old Post
  - Mac Admin
disclaimer:
  text: This is an old post. Content may be out of date.
---

The screensaver engine on a Mac can be invoked from the command line. This can be useful for locking a Mac remotely if its security settings are configured to require a password after waking, but without needing to put the Mac fully to sleep:

```bash
open -a /System/Library/Frameworks/ScreenSaver.framework/Versions/A/Resources/ScreenSaverEngine.app
```

[Gist on GitHub](https://gist.github.com/lucascantor/98098174c5c0df6eea2f2d8625f5ebe9)
