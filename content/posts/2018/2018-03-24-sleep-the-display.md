---
title: Sleep the Display
description:
date: 2018-03-24
tags:
  - mac
  - macos
  - sleep
  - display
  - lock
  - security
---

The `pmset` utility can be used to sleep the display of a Mac from the command line. This can be useful for locking a Mac remotely if its security settings are configured to require a password after waking, but without needing to put the Mac fully to sleep:

```
pmset displaysleepnow
```

If you do want to put the Mac to sleep, rather than just sleeping the display, just use `sleepnow` instead:

```
pmset sleepnow
```

[Gist on GitHub](https://gist.github.com/lucascantor/a8f827e9b32450a23f5d72e1aca16947)
