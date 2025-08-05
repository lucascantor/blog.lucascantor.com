---
title: Safely Wipe a Mac's SSD
excerpt: 'Safely overwrite macOS disk partition tables and re-partition over encrypted data without excessive SSD wear.'
date: 2018-01-27
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-01-27-safely-wipe-a-macs-ssd.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

Overwrite the macOS disk partition table and re-partition over encrypted data without causing excessive wear by explicitly erasing the full SSD:

```bash
# Replace N in diskN with the disk number of your choice
# Use "diskutil list" to confirm, and ALWAYS back up your data

dd if=/dev/zero of=/dev/diskN bs=512 count=1
diskutil partitionDisk /dev/diskN 1 GPT APFS "Macintosh HD" 100%
```

[Gist on GitHub](https://gist.github.com/lucascantor/5316443b3e791c8301196a11b85adf66)
