---
title: Enable Ownership on External Disks
description:
date: 2018-06-02
disclaimer:
  text: This is an old post. Content may be out of date.
---

By default, macOS doesn't enable ownership, and thus access permissions, on external disks. If you have access to Mac with an external disk mounted, you have access to the full contents of that external disk as well.

If you do want to enable ownership on an external disk, it's easy to do using the `vsdbutil` tool:

```bash
vsdbutil -a /Volumes/ExternalDiskNameHere
```

[Gist on GitHub](https://gist.github.com/lucascantor/6d95be0a27307d7730b2b361653b7fa7)
