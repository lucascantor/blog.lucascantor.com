---
title: Start the Screensaver
excerpt: 'Start the macOS screensaver from the command line to remotely lock systems that require passwords after wake.'
date: 2018-03-31
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/rodion-kutsaiev-havydp8g2DU-unsplash.jpg'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

The screensaver engine on a Mac can be invoked from the command line. This can be useful for locking a Mac remotely if its security settings are configured to require a password after waking, but without needing to put the Mac fully to sleep:

```bash
open -a /System/Library/Frameworks/ScreenSaver.framework/Versions/A/Resources/ScreenSaverEngine.app
```

[Gist on GitHub](https://gist.github.com/lucascantor/98098174c5c0df6eea2f2d8625f5ebe9)
