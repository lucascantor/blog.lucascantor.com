---
title: Install Vendor-Hosted Software via curl
excerpt: 'Automate installation of current software versions from vendor URLs using custom bash scripts and Jamf Pro policies.'
date: 2018-10-24
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2018-10-24-install-vendor-hosted-software-via-curl.png'
featured: false
tags:
  - Old Post
  - Mac Admin
---

> ⚠️ This is an old post.
>
> Content may be out of date.

## Background

One of the highest-leverage jobs an IT department can automate is providing employees with a one-click installation method for their company's commonly used software. This eliminates confusion and delays to productivity while new hires are getting acclimated, or when existing employees replace their computers. On Macs, the de-facto standard is [Jamf Pro](https://www.jamf.com/products/jamf-pro/) and its Self Service app, which effectively acts as a company-specific App Store where employees can click to run Jamf policies, automating the installation of whatever software they need to perform their jobs.

Jamf policies install software via macOS `pkg` installer files, which install a specific version of software that you as a Jamf admin must bundle yourself or download from a software vendor. This is by design, and a safety feature, but it can become tedious as new software updates are released over time, requiring a constant cycle of manual curation to update the respective Jamf policies to prevent employees from installing out-of-date software. There is also certain software that you can be confident you always want users to install the current version of, such as Google Chrome in my case.

In the past, I've had great results installing and running [homebrew](https://brew.sh) on behalf of the currently logged in user in order to install a current version via `brew cask install google-chrome` for example. Since macOS 10.14 Mojave, however, this is unfortunately no longer practical, as users are prompted by pop-ups to decide whether they want to allow my homebrew automations to "manage" their Mac. In addition, as both macOS and homebrew evolve, and my user-base grows, I want a more boring and stable solution that I can comfortably forget about for a while, so I decided to write my own using cURL.

## Code

Since Jamf Pro itself is already trusted automatically by the new macOS `Privacy Preferences Policy Control` system, I decided to break this down into two parts:

1. Run a script to stage a URL (passed in as a command-line argument from Jamf) on disk in a text file
1. Bundle a "post-install" script in a [payload-free .pkg](https://derflounder.wordpress.com/2012/08/15/creating-payload-free-packages-with-pkgbuild/) to download and install the software from the staged URL

The staging script is very simple, with the desired vendor-hosted installer file's URL being passed in by a given Jamf policy as `$4` (since $1, $2, and $3 are reserved by Jamf):

```bash
#!/bin/bash

# Stage a txt file containing a URL for a vendor-hosted software installer file

# Stage URL passed in as $4
/bin/echo "$4" > /Library/Application\ Support/JAMF/.installFromURL.txt

exit 0
```

The installation script is a little more complex, but here it is in its entirely before we break it down:

```bash
#!/bin/bash

# Install software from vendor-hosted software installer file

# -------------------------------------------------------------------------------------------------
# Definitions

# if staged .installFromURL.txt file exists
if [ -e /Library/Application\ Support/JAMF/.installFromURL.txt ]; then
  # define vendor-hosted installer file url we want to download and install
  url=$(/bin/cat /Library/Application\ Support/JAMF/.installFromURL.txt)
  /bin/echo "Staged URL file found at /Library/Application\ Support/JAMF/.installFromURL.txt"
  /bin/echo "Staged URL is $url"
  # un-stage the .installFromURL.txt file to avoid future collisions
  /bin/rm /Library/Application\ Support/JAMF/.installFromURL.txt
# otherwise report error and exit
else
  echo "No staged file at /Library/Application\ Support/JAMF/.installFromURL.txt"
  echo "Aborting..."
  exit 1
fi

# get the full filename from a remote server via curl
getUriFilename() {
  header="$(curl -sIL "$1" | tr -d '\r')"

  filename="$(echo "$header" | grep -o -i -E 'filename=.*$')"
  if [[ -n "$filename" ]]; then
    echo "${filename#filename=}"
    return
  fi

  filename="$(echo "$header" | grep -o -i -E 'location:.*$')"
  if [[ -n "$filename" ]]; then
    basename "${filename#location\:}"
    return
  fi

  return 1
}

# install an app directly from its vendor-hosted installer file
installFromURL() {

  # define the vendor-hosted installer file url (passed in as $1) and a local downloadPath to store it
  url="$1"
  downloadPath=$(/usr/bin/mktemp -d /tmp/downloadPath.XXXX)

  # find the remote fileName if applicable
  fileName=$(getUriFilename "$url")
  # download the remote file to the to $downloadPath/$fileName if $fileName is known
  if [ -n "$fileName" ]; then
    /usr/bin/curl -o "$downloadPath/$fileName" -L "$url"
  # otherwise use the end of the supplied $url in place of a known remote $fileName
  else
    /usr/bin/curl -o "$downloadPath/${url##*/}" -L "$url"
  fi

  # if the downloaded file is a dmg, mount it as a disk image at mountPoint
  if [ -e "$downloadPath"/*.dmg ]; then
    mountPoint=$(/usr/bin/mktemp -d /tmp/mountPoint.XXXX)
    /usr/bin/hdiutil attach "$downloadPath"/*.dmg -mountpoint "$mountPoint" -noverify -nobrowse -noautoopen

    # overwrite downloadPath with mountPoint to process contents of mounted disk image
    originalDownloadPath="$downloadPath"
    downloadPath="$mountPoint"
  fi

  # install the downloaded app, zip, or pkg
  if [ -e "$downloadPath"/*.app ]; then
    /bin/cp -R "$downloadPath"/*.app /Applications 2>/dev/null
  elif [ -e "$downloadPath"/*.zip ]; then
    /usr/bin/unzip "$downloadPath"/*.zip -d /Applications
  elif [ -e "$downloadPath"/*.pkg ]; then
    /usr/sbin/installer -pkg "$downloadPath"/*.pkg -target / 2>/dev/null
  fi

  # clean up, including mounted disk image if applicable
  if [ -e "$originalDownloadPath" ]; then
    /bin/rm -rf "$originalDownloadPath"
    /usr/bin/hdiutil detach "$mountPoint"
    /bin/rm -rf "$mountPoint"
  fi
  /bin/rm -rf "$downloadPath"

}

# -------------------------------------------------------------------------------------------------
# Software Installation

# install app via vendor-hosted installer file
installFromURL "$url"

exit 0
```

We start with a sanity check to make sure the staging script has run successfully, echoing out details to the log, and removing the staged text file entirely after reading it, in order to avoid accidentally re-using it in the future:

```bash
# if staged .installFromURL.txt file exists
if [ -e /Library/Application\ Support/JAMF/.installFromURL.txt ]; then
  # define vendor-hosted installer file url we want to download and install
  url=$(/bin/cat /Library/Application\ Support/JAMF/.installFromURL.txt)
  /bin/echo "Staged URL file found at /Library/Application\ Support/JAMF/.installFromURL.txt"
  /bin/echo "Staged URL is $url"
  # un-stage the .installFromURL.txt file to avoid future collisions
  /bin/rm /Library/Application\ Support/JAMF/.installFromURL.txt
# otherwise report error and exit
else
  echo "No staged file at /Library/Application\ Support/JAMF/.installFromURL.txt"
  echo "Aborting..."
  exit 1
fi
```

Next we build the `getUriFilename()` function, which is needed to obtain the full filename from the remote server for scenarios where our vendor-supplied URL redirects, rather than linking directly to a specific file. Unfortunately the cURL version included with macOS is not (yet) capable of doing this natively via the `--remote-header-name` / `-J` flag.

We first check for `filename=` and then if needed `location:` in the returned header:

```bash
# get the full filename from a remote server via curl
getUriFilename() {
  header="$(curl -sIL "$1" | tr -d '\r')"

  filename="$(echo "$header" | grep -o -i -E 'filename=.*$')"
  if [[ -n "$filename" ]]; then
    echo "${filename#filename=}"
    return
  fi

  filename="$(echo "$header" | grep -o -i -E 'location:.*$')"
  if [[ -n "$filename" ]]; then
    basename "${filename#location\:}"
    return
  fi

  return 1
}
```

Now we have the `installFromURL()` function, which we can break down further.

First we define our URL as passed in, and create a corresponding download path randomly via `mktemp`:

```bash
# define the vendor-hosted installer file url (passed in as $1) and a local downloadPath to store it
url="$1"
downloadPath=$(/usr/bin/mktemp -d /tmp/downloadPath.XXXX)
```

Next we find the remote filename (if needed) using the `getUriFilename()` function from above. If `getUriFilename()` doesn't return a filename, we just use the end of the supplied URL:

```bash
# find the remote fileName if applicable
fileName=$(getUriFilename "$url")
# download the remote file to the to $downloadPath/$fileName if $fileName is known
if [ -n "$fileName" ]; then
  /usr/bin/curl -o "$downloadPath/$fileName" -L "$url"
# otherwise use the end of the supplied $url in place of a known remote $fileName
else
  /usr/bin/curl -o "$downloadPath/${url##*/}" -L "$url"
fi
```

Next we check if the downloaded file is a disk image, and if so, we mount it at a random mount point using `mktemp` again. Once the disk image is mounted, we backup the download path and then overwrite it with the new mount point, allowing subsequent logic to continue, without needing to worry about whether the downloaded files to install are in a regular directory or a mounted disk image:

```bash
# if the downloaded file is a dmg, mount it as a disk image at mountPoint
if [ -e "$downloadPath"/*.dmg ]; then
  mountPoint=$(/usr/bin/mktemp -d /tmp/mountPoint.XXXX)
  /usr/bin/hdiutil attach "$downloadPath"/*.dmg -mountpoint "$mountPoint" -noverify -nobrowse -noautoopen

  # overwrite downloadPath with mountPoint to process contents of mounted disk image
  originalDownloadPath="$downloadPath"
  downloadPath="$mountPoint"
fi
```

Now we can actually install the downloaded files, supporting `.app`, `.zip`, and `.pkg` formats. `.app`s are simply copied directly to the `/Applications` directory, `.zip`s are unzipped to the `/Applications` directory, and `.pkg`s are installed using the `installer` utility:

```bash
# install the downloaded app, zip, or pkg
if [ -e "$downloadPath"/*.app ]; then
  /bin/cp -R "$downloadPath"/*.app /Applications 2>/dev/null
elif [ -e "$downloadPath"/*.zip ]; then
  /usr/bin/unzip "$downloadPath"/*.zip -d /Applications
elif [ -e "$downloadPath"/*.pkg ]; then
  /usr/sbin/installer -pkg "$downloadPath"/*.pkg -target / 2>/dev/null
fi
```

Now that an up-to-date version of the desired software is installed, we can clean up:

```bash
# clean up, including mounted disk image if applicable
if [ -e "$originalDownloadPath" ]; then
  /bin/rm -rf "$originalDownloadPath"
  /usr/bin/hdiutil detach "$mountPoint"
  /bin/rm -rf "$mountPoint"
fi
/bin/rm -rf "$downloadPath"
```

[Repo on GitHub](https://github.com/lucascantor/install-from-url)
