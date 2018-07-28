---
layout: post
title:  "View Available Software Updates in the Mac App Store"
date:   2018-05-05 10:29:00 -0700
categories: mac app software updates
---
You can use the `macappstore://` scheme to open the Mac App Store to view the currently available software updates:

```
/usr/bin/open macappstore://showUpdatesPage
```

To do this on behalf of the currently logged in user account:

```
su - `stat -f '%Su' /dev/console` -c "/usr/bin/open macappstore://showUpdatesPage"
```

[Gist on GitHub](https://gist.github.com/lucascantor/0e3bc44a0ec64b6edc96440fecf644c6)
