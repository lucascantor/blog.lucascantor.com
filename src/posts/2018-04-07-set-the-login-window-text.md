---
title: Set the Login Window Text
excerpt: 'Set custom login window text on macOS using defaults write on loginwindow preferences.'
date: 2018-04-07
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-04-07-set-the-login-window-text.png'
featured: false
tags:
  - Old Post
  - Mac Admin
disclaimer:
  text: This is an old post. Content may be out of date.
---

> ⚠️ This is an old post.
>
> Content may be out of date.

You can perform a `defaults write` on the macOS loginwindow preferences to set the Login Window text from the command line:

```bash
defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "Property of John Doe - (555) 555-5555"
```

[Gist on GitHub](https://gist.github.com/lucascantor/322c7507a23b4f2a423c281519e30342)
