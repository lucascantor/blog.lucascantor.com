---
title: Safely Wipe a Mac's SSD
description:
date: 2018-01-27
disclaimer:
  text: This is an old post. Contant may be out of date.
---

Overwrite the macOS disk partition table and re-partition over encrypted data without causing excessive wear by explicitly erasing the full SSD:

```bash
# Replace N in diskN with the disk number of your choice
# Use "diskutil list" to confirm, and ALWAYS back up your data

dd if=/dev/zero of=/dev/diskN bs=512 count=1
diskutil partitionDisk /dev/diskN 1 GPT APFS "Macintosh HD" 100%
```

[Gist on GitHub](https://gist.github.com/lucascantor/5316443b3e791c8301196a11b85adf66)
