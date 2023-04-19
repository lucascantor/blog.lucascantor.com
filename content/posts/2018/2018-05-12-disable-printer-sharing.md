---
title: Disable Printer Sharing
description:
date: 2018-05-11
tags:
  - mac
  - printer
  - disable
  - sharing
---

You can disable macOS printer sharing for all printers using the `lpstat` and `lpadmin` tools:

```
lpstat -p | grep printer | awk '{print $2}'| xargs -I{} lpadmin -p {} -o printer-is-shared=false
```

[Gist on GitHub](https://gist.github.com/lucascantor/6ac2dba3e5535ffb69cbda357ab6d85e)
