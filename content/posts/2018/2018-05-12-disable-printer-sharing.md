---
title: Disable Printer Sharing
description:
date: 2018-05-11
disclaimer:
  text: This is an old post. Content may be out of date.
---

You can disable macOS printer sharing for all printers using the `lpstat` and `lpadmin` tools:

```bash
lpstat -p | grep printer | awk '{print $2}'| xargs -I{} lpadmin -p {} -o printer-is-shared=false
```

[Gist on GitHub](https://gist.github.com/lucascantor/6ac2dba3e5535ffb69cbda357ab6d85e)
