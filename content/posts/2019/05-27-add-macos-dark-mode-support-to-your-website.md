---
title: Add macOS Dark Mode Support to Your Website
description:
date: 2019-05-27
tags:
  - Old Post
  - Web Dev
  - CSS
disclaimer:
  text: This is an old post. Content may be out of date.
---

I finally got around to adding support for macOS dark mode in my site's CSS while working on consolidating the style between my main site and my blog.

It's surprisingly easy to do via the `prefers-color-scheme` query, which supports the following values:

- `dark`
- `light`
- `no-preference`

For example, the CSS I've added for my site:

```css
@media (prefers-color-scheme: dark) {
  body {
    color: #ddd;
    background-color: #222;
  }
}
```

[Gist on GitHub](https://gist.github.com/lucascantor/6560b43b6f3da94eb75319040c032132)
