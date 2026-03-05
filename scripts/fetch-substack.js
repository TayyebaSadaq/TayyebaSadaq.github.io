#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();

// Update this with your Substack feed URL or set the SUBSTACK_RSS secret in GitHub Actions
const SUBSTACK_RSS = process.env.SUBSTACK_RSS || 'https://codedbytea.substack.com/feed';

(async () => {
  try {
    const feed = await parser.parseURL(SUBSTACK_RSS);
    const posts = feed.items.map(item => ({
      slug: (item.link && item.link.split('/').pop()) || item.guid || item.id,
      title: item.title || '',
      date: item.pubDate || item.isoDate || '',
      excerpt: item.contentSnippet || (item.content || '').slice(0, 200).replace(/\n/g, ' '),
      image: (item.enclosure && item.enclosure.url) || '' ,
      link: item.link || ''
    }));

    const outDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'posts.json');

    fs.writeFileSync(outPath, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`Wrote ${posts.length} posts to ${outPath}`);
  } catch (err) {
    console.error('Failed to fetch or write posts:', err);
    process.exitCode = 1;
  }
})();
