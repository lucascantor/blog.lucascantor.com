---
layout: post
title:  "Schedule Repeating Reboots"
date:   2018-03-10 09:38:00 -0800
categories: mac schedule reboot
---
The `pmset` utility can be used to schedule repeating reboots, replacing `MTWRFSU 04:00:00` with your desired day(s) of the week and time of day:

```
pmset repeat restart MTWRFSU 04:00:00
```

[Gist on GitHub](https://gist.github.com/lucascantor/a93f60eef9ee71bddb529af072d47b10)
