---
title: View Available Software Updates in the Mac App Store
excerpt: 'Open the Mac App Store updates page from the command line using the macappstore:// URL scheme.'
date: 2018-05-05
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-05-05-view-available-software-updates.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

You can use the `macappstore://` scheme to open the Mac App Store to view the currently available software updates:

```bash
/usr/bin/open macappstore://showUpdatesPage
```

To do this on behalf of the currently logged in user account:

```bash
su - `stat -f '%Su' /dev/console` -c "/usr/bin/open macappstore://showUpdatesPage"
```

[Gist on GitHub](https://gist.github.com/lucascantor/0e3bc44a0ec64b6edc96440fecf644c6)
