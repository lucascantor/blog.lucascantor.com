---
title: Schedule Repeating Reboots
excerpt: "Schedule automatic repeating system reboots on specific days and times using the pmset utility."
date: 2018-03-10
author:
  name: "Lucas Cantor"
  image: "/assets/images/lucas-cantor.jpg"
featured: false
tags:
  - Old Post
  - Mac Admin
disclaimer:
  text: This is an old post. Content may be out of date.
---

The `pmset` utility can be used to schedule repeating reboots, replacing `MTWRFSU 04:00:00` with your desired day(s) of the week and time of day:

```bash
pmset repeat restart MTWRFSU 04:00:00
```

[Gist on GitHub](https://gist.github.com/lucascantor/a93f60eef9ee71bddb529af072d47b10)
