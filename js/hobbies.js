// Fetch posts index and render as clickable cards
async function loadPosts() {
  const list = document.getElementById('posts-list');
  list.innerHTML = '<div class="loading">Loading posts…</div>';

  try {
    const res = await fetch('data/posts.json');
    const posts = await res.json();

    if (!posts || posts.length === 0) {
      list.innerHTML = '<p>No posts yet.</p>';
      return;
    }

    const html = posts.map(p => `
      <article class="card post-card">
        ${p.image ? `<img class="card-image" src="${p.image}" alt="${p.title}">` : ''}
        <h3>${p.title}</h3>
        <div class="meta">${p.date}</div>
        <p class="post-excerpt">${p.excerpt}</p>
        <a class="card-link" href="post-detail.html?slug=${encodeURIComponent(p.slug)}">Read →</a>
      </article>
    `).join('');

    list.innerHTML = html;
  } catch (err) {
    console.error('Failed to load posts', err);
    list.innerHTML = '<p>Error loading posts.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
