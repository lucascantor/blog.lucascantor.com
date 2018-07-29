---
layout: post
title:  "Disable Printer Sharing"
date:   2018-05-11 08:44:00 -0700
categories: mac printer disable sharing
---
You can disable macOS printer sharing for all printers using the `lpstat` and `lpadmin` tools:

```
lpstat -p | grep printer | awk '{print $2}'| xargs -I{} lpadmin -p {} -o printer-is-shared=false
```

[Gist on GitHub](https://gist.github.com/lucascantor/6ac2dba3e5535ffb69cbda357ab6d85e)
