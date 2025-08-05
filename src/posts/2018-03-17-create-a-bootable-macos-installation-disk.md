---
title: Create a Bootable macOS Installation Disk
excerpt: 'Create bootable macOS installation disks using createinstallmedia for installing macOS on multiple computers.'
date: 2018-03-17
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-03-17-create-a-bootable-macos-installation-disk.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

The `createinstallmedia` utility can be used to create a bootable macOS installation disk, which is useful for installing macOS on multiple Macs without downloading the installer over the Internet each time:

```bash
/path/to/macOS/installer.app/Contents/Resources/createinstallmedia --volume /path/to/installation/media/volume --applicationpath /path/to/macOS/installer.app --nointeraction
```

For example, to use an external drive named `myDrive` to create an installation disk for `macOS High Sierra` the following command can be used:

```bash
sudo /Applications/Install\ macOS\ High\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/myDrive --applicationpath /Applications/Install\ macOS\ High\ Sierra.app --nointeraction
```

[Gist on GitHub](https://gist.github.com/lucascantor/709ceb0d31e84cd42c46400f7c7f0fb4)
