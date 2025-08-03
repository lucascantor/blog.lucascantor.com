const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Copy assets
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // Date filter
  eleventyConfig.addFilter("dateFormat", function(date, format = "LLLL dd, yyyy") {
    return DateTime.fromJSDate(date).toFormat(format);
  });

  // ISO date filter for <time> elements
  eleventyConfig.addFilter("dateISO", function(date) {
    return DateTime.fromJSDate(date).toISO();
  });

  // Body class filter
  eleventyConfig.addFilter("bodyClass", function(page) {
    let classes = [];
    
    if (page.url === '/') {
      classes.push('home-template');
    } else if (page.url.startsWith('/posts/')) {
      classes.push('post-template');
    } else if (page.url.startsWith('/tags/')) {
      classes.push('tag-template');
    } else if (page.url.startsWith('/authors/')) {
      classes.push('author-template');
    } else {
      classes.push('page-template');
    }
    
    if (page.fileSlug) {
      classes.push(`${page.fileSlug}-template`);
    }
    
    return classes.join(' ');
  });

  // Excerpt filter
  eleventyConfig.addFilter("excerpt", function(content, limit = 150) {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  });

  // URL filter for proper link generation
  eleventyConfig.addFilter("url", function(url) {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  });

  // Slug filter
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return '';
    return str.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  // Slice filter
  eleventyConfig.addFilter("slice", function(array, start, end) {
    if (!Array.isArray(array)) return [];
    return array.slice(start, end);
  });

  // Where filter
  eleventyConfig.addFilter("where", function(array, key, value) {
    if (!Array.isArray(array)) return [];
    return array.filter(item => {
      const keys = key.split('.');
      let obj = item;
      for (const k of keys) {
        if (obj && obj[k] !== undefined) {
          obj = obj[k];
        } else {
          return false;
        }
      }
      return Array.isArray(obj) ? obj.includes(value) : obj === value;
    });
  });

  // Related posts filter (basic implementation)
  eleventyConfig.addFilter("relatedPosts", function(posts, currentPage) {
    if (!Array.isArray(posts)) return [];
    if (!currentPage || !currentPage.data || !currentPage.data.tags) return [];
    const currentTags = currentPage.data.tags || [];
    return posts
      .filter(post => post.url !== currentPage.url)
      .filter(post => {
        if (!post.data || !post.data.tags) return false;
        return post.data.tags.some(tag => currentTags.includes(tag));
      })
      .sort((a, b) => b.date - a.date);
  });

  // Split filter
  eleventyConfig.addFilter("split", function(str, separator) {
    if (!str) return [];
    return str.toString().split(separator || ' ');
  });

  // Title case filter
  eleventyConfig.addFilter("title", function(str) {
    if (!str) return '';
    return str.toString().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  });

  // Translation filter (basic implementation)
  eleventyConfig.addFilter("t", function(key, locale = 'en') {
    const translations = {
      'en': {
        'meta-page': 'Page',
        'newer-posts': 'Newer Posts',
        'older-posts': 'Older Posts',
        'read-more': 'Read More',
        'subscribe': 'Subscribe',
        'by': 'By',
        'on': 'on',
        'in': 'in'
      }
    };
    return translations[locale]?.[key] || key;
  });

  // Current year shortcode
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Navigation shortcode
  eleventyConfig.addShortcode("navigation", function() {
    const nav = this.ctx.site.navigation || [];
    return nav.map(item => 
      `<li><a href="${item.url}">${item.label}</a></li>`
    ).join('');
  });

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => post.data.featured)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tags", function(collectionApi) {
    const tags = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  });

  // Template formats
  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "html",
    "liquid"
  ]);

  // Markdown configuration
  eleventyConfig.setLibrary("md", require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true
  }));

  return {
    templateFormats: ["md", "njk", "html"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};