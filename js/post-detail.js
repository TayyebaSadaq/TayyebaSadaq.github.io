// Post detail page is no longer used for local markdown posts. Show message directing users to Substack.
function renderPostFromSlug() {
  const container = document.getElementById('post-container');
  container.innerHTML = `
    <div class="section">
      <h2>Posts are hosted on Substack</h2>
      <p>I now publish on Substack. Please read posts on my Substack page: <a href="https://codedbytea.substack.com" target="_blank" rel="noopener noreferrer">https://codedbytea.substack.com</a></p>
      <p><a href="hobbies.html">← Back to Posts</a></p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderPostFromSlug);
