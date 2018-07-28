---
layout: post
title:  "Safely Wipe a Mac's SSD"
date:   2018-01-27 15:51:00 -0800
categories: mac ssd erase diskutil
---
Overwrite the macOS disk partition table and re-partition over encrypted data without causing excessive wear by explicitly erasing the full SSD:

```
# Replace N in diskN with the disk number of your choice
# Use "diskutil list" to confirm, and ALWAYS back up your data

dd if=/dev/zero of=/dev/diskN bs=512 count=1
diskutil partitionDisk /dev/diskN 1 GPT APFS "Macintosh HD" 100%
```

[Gist on GitHub](https://gist.github.com/lucascantor/5316443b3e791c8301196a11b85adf66)
