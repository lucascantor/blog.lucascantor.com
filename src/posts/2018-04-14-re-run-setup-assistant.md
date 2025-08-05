---
title: Re-Run the macOS Setup Assistant
excerpt: 'Force macOS Setup Assistant to run again on next boot by removing the .AppleSetupDone file.'
date: 2018-04-14
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-04-14-re-run-setup-assistant.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

You can re-run the macOS Setup Assistant on the next boot by removing the `.AppleSetupDone` file:

```bash
rm /var/db/.AppleSetupDone
```

[Gist on GitHub](https://gist.github.com/lucascantor/b009c765d9ddc8439b60568228089a41)
