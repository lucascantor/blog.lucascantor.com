---
title: Re-Run the macOS Setup Assistant
description:
date: 2018-04-14
tags:
  - mac
  - macos
  - setup
---

You can re-run the macOS Setup Assistant on the next boot by removing the `.AppleSetupDone` file:

```
rm /var/db/.AppleSetupDone
```

[Gist on GitHub](https://gist.github.com/lucascantor/b009c765d9ddc8439b60568228089a41)
