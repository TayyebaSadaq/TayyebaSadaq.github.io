// Render a markdown post specified by ?slug=post-slug
async function renderPostFromSlug() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const container = document.getElementById('post-container');

  if (!slug) {
    container.innerHTML = `<div class="section"><h2>Missing post</h2><p>No post specified.</p></div>`;
    return;
  }

  container.innerHTML = '<div class="loading">Loading post…</div>';

  try {
    // load index to get metadata
    const idxRes = await fetch('data/posts.json');
    const posts = await idxRes.json();
    const meta = posts.find(p => p.slug === slug) || {};

    // fetch markdown
    const mdRes = await fetch(`data/posts/${slug}.md`);
    if (!mdRes.ok) throw new Error('Post not found');
    let md = await mdRes.text();

    // Extract simple YAML frontmatter (--- key: value ---)
    let fm = {};
    const fmMatch = md.match(/^---\s*([\s\S]*?)\s*---\s*/);
    if (fmMatch) {
      const fmRaw = fmMatch[1];
      md = md.slice(fmMatch[0].length);
      fmRaw.split(/\r?\n/).forEach(line => {
        const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (m) fm[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
      });
    }

    // Convert markdown to HTML with marked (loaded via CDN) and sanitize with DOMPurify
    let rawHtml = md;
    if (typeof marked === 'object' && typeof marked.parse === 'function') {
      rawHtml = marked.parse(md);
    } else if (typeof marked === 'function') {
      rawHtml = marked(md);
    }
    const safe = (typeof DOMPurify === 'object' && DOMPurify.sanitize && typeof rawHtml === 'string') ? DOMPurify.sanitize(rawHtml) : (rawHtml || '');

    // Determine hero image: frontmatter `hero`, meta.image, or first image in markdown
    let hero = fm.hero || fm.image || meta.image || null;
    if (!hero) {
      const imgMatch = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
      if (imgMatch) hero = imgMatch[1];
    }

    // Build HTML. Add post-fullscreen class to body for layout
    document.body.classList.add('post-fullscreen');

    const titleHtml = fm.title || meta.title || '';
    const dateHtml = fm.date || meta.date || '';

    const heroHtml = hero ? `<div class="post-hero"><img src="${hero}" alt="${titleHtml}"></div>` : '';

    container.innerHTML = `
      ${heroHtml}
      <div class="section">
        <a href="hobbies.html" class="card-link" style="margin-bottom: 1rem; display:inline-block;">← Back to Posts</a>
        <div class="post-body">
          ${titleHtml ? `<h1>${titleHtml}</h1>` : ''}
          ${dateHtml ? `<p style="color: var(--soft-gold); font-style: italic;">${dateHtml}</p>` : ''}
          ${safe}
        </div>
      </div>
    `;

    // Make sure images inside markdown are responsive and use post-body styling
    const imgs = container.querySelectorAll('.post-body img');
    imgs.forEach(i => i.classList.add('card-image'));

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="section"><h2>Error</h2><p>Could not load post.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', renderPostFromSlug);
