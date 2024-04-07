---
title: Set the Login Window Text
description:
date: 2018-04-07
tags:
  - Old Post
  - Mac Admin
disclaimer:
  text: This is an old post. Content may be out of date.
---

You can perform a `defaults write` on the macOS loginwindow preferences to set the Login Window text from the command line:

```bash
defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "Property of John Doe - (555) 555-5555"
```

[Gist on GitHub](https://gist.github.com/lucascantor/322c7507a23b4f2a423c281519e30342)
