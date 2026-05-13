const statusMessages = [
	'studying MS Cyber security and OU',
	'working as an analyst',
	'planning my roadmap',
	'playing games and reading',
];

const navItems = [
	{ page: 'about', href: 'about.html', label: 'about' },
	{ page: 'career', href: 'career.html', label: 'career' },
	{ page: 'education', href: 'education.html', label: 'education' },
	{ page: 'projects', href: 'projects.html', label: 'projects' },
];

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const starsLayer = document.querySelector('.stars');

let messageIndex = 0;

const createSparkle = (x, y) => {
	if (!starsLayer) {
		return;
	}

	const sparkle = document.createElement('span');
	sparkle.className = 'sparkle';
	sparkle.style.left = `${x}px`;
	sparkle.style.top = `${y}px`;
	sparkle.style.background = `hsl(${320 + Math.random() * 40} 100% ${82 + Math.random() * 10}%)`;
	sparkle.style.transform = `scale(${0.5 + Math.random() * 0.9})`;
	starsLayer.appendChild(sparkle);

	window.setTimeout(() => sparkle.remove(), 900);
};

window.addEventListener('pointermove', (event) => {
	if (Math.random() > 0.25) {
		return;
	}

	createSparkle(event.clientX, event.clientY);
});

const escapeHtml = (text) =>
	text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const renderInlineMarkdown = (text) => {
	const escaped = escapeHtml(text);
	return escaped
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-button">$1</a>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');
};

const splitMarkdownSections = (markdown) => {
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const sections = [];
	let current = null;

	for (const line of lines) {
		if (line.startsWith('## ')) {
			if (current) {
				sections.push(current);
			}

			current = {
				title: line.slice(3).trim(),
				lines: [],
			};
			continue;
		}

		if (!current && line.trim() && !line.startsWith('# ')) {
			current = {
				title: '',
				lines: [],
			};
		}

		if (current) {
			current.lines.push(line);
		}
	}

	if (current) {
		sections.push(current);
	}

	return sections;
};

const renderBlockLines = (lines) => {
	const chunks = [];
	let index = 0;

	while (index < lines.length) {
		const rawLine = lines[index] || '';
		const line = rawLine.trim();

		if (!line) {
			index += 1;
			continue;
		}

		if (line.startsWith('### ')) {
			chunks.push(`<h3>${renderInlineMarkdown(line.slice(4).trim())}</h3>`);
			index += 1;
			continue;
		}

		if (line.startsWith('- ')) {
			const items = [];
			while (index < lines.length && lines[index].trim().startsWith('- ')) {
				items.push(`<li>${renderInlineMarkdown(lines[index].trim().slice(2).trim())}</li>`);
				index += 1;
			}
			chunks.push(`<ul>${items.join('')}</ul>`);
			continue;
		}

		const paragraphLines = [];
		while (index < lines.length) {
			const maybeLine = (lines[index] || '').trim();
			if (!maybeLine || maybeLine.startsWith('- ') || maybeLine.startsWith('### ')) {
				break;
			}
			paragraphLines.push(maybeLine);
			index += 1;
		}

		if (paragraphLines.length > 0) {
			chunks.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`);
		}
	}

	return chunks.join('');
};

const renderDefaultMarkdown = (markdown) => {
	const sections = splitMarkdownSections(markdown);
	if (sections.length === 0) {
		return '<p class="markdown-note">No content found in markdown file.</p>';
	}

	const groups = sections
		.map((section) => {
			const header = section.title ? `<h2>${renderInlineMarkdown(section.title)}</h2>` : '';
			const body = renderBlockLines(section.lines);
			return `<article>${header}${body}</article>`;
		})
		.join('');

	return `<div class="markdown-group">${groups}</div>`;
};

const renderTimelineMarkdown = (markdown) => {
	const sections = splitMarkdownSections(markdown);
	if (sections.length === 0) {
		return '<p class="markdown-note">No timeline entries found in markdown file.</p>';
	}

	const timelineItems = [];
	const standardBlocks = [];

	for (const section of sections) {
		const contentLines = section.lines.map((line) => line.trim()).filter(Boolean);
		let meta = '';
		let contentStart = 0;

		if (contentLines[0] && /^\*.+\*$/.test(contentLines[0])) {
			meta = contentLines[0].slice(1, -1).trim();
			contentStart = 1;
		}

		const content = renderBlockLines(contentLines.slice(contentStart));

		if (meta) {
			timelineItems.push(`
				<article class="timeline-item">
					<div class="timeline-card">
						<h3>${renderInlineMarkdown(section.title)}</h3>
						<p class="meta">${renderInlineMarkdown(meta)}</p>
						${content}
					</div>
				</article>
			`);
			continue;
		}

		standardBlocks.push(`
			<article>
				<h2>${renderInlineMarkdown(section.title)}</h2>
				${content}
			</article>
		`);
	}

	const timeline = timelineItems.length > 0 ? `<div class="timeline">${timelineItems.join('')}</div>` : '';
	const extras = standardBlocks.length > 0 ? `<div class="markdown-group">${standardBlocks.join('')}</div>` : '';

	return `${timeline}${extras}`;
};

const renderMarkdownPanel = async (panel) => {
	const filePath = panel.dataset.mdFile;
	const view = panel.dataset.mdView || 'default';

	if (!filePath) {
		return;
	}

	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`Unable to load ${filePath}`);
		}

		const markdown = await response.text();
		panel.innerHTML =
			view === 'timeline' ? renderTimelineMarkdown(markdown) : renderDefaultMarkdown(markdown);
	} catch (error) {
		panel.innerHTML = `<p class="markdown-note">Could not load ${escapeHtml(filePath)}.</p>`;
		console.error(error);
	}
};

const loadMarkdownPanels = async () => {
	const panels = document.querySelectorAll('.markdown-panel[data-md-file]');
	if (panels.length === 0) {
		return;
	}

	await Promise.all([...panels].map((panel) => renderMarkdownPanel(panel)));
};

const renderSharedNavbar = () => {
	const topbar = document.querySelector('[data-nav]');
	if (!topbar) {
		return;
	}

	const pageName = document.body?.dataset?.page || 'home';
	const links = navItems
		.map((item) => {
			const activeClass = item.page === pageName ? 'is-active' : '';
			const currentPage = item.page === pageName ? ' aria-current="page"' : '';
			return `<a class="${activeClass}" href="${item.href}"${currentPage}>${item.label}</a>`;
		})
		.join('');

	const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
	const themeToggleLabel = currentTheme === 'light' ? '🌙' : '☀️';

	topbar.innerHTML = `
		<div class="navbar-wrapper">
			<div>
				<p class="eyebrow">welcome to tayyeba's tiny internet nook</p>
				<nav class="quick-links" aria-label="site navigation">
					${links}
				</nav>
			</div>
			<div class="navbar-controls">
				<button class="hamburger-menu" id="hamburger-menu" aria-label="Toggle menu" aria-expanded="false">
					<span></span>
					<span></span>
					<span></span>
				</button>
				<button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
					${themeToggleLabel}
				</button>
			</div>
		</div>

		<div class="mobile-menu" id="mobile-menu">
			<div class="mobile-menu-content">
				<h2>menu</h2>
				<nav class="mobile-menu-nav">
					${links}
				</nav>
				<div class="mobile-menu-contacts">
					<a href="https://www.linkedin.com/in/tayyeba-sadaq/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
					<a href="https://github.com/TayyebaSadaq" target="_blank" rel="noopener noreferrer">GitHub</a>
					<a href="https://substack.com/@codedbytea" target="_blank" rel="noopener noreferrer">Substack</a>
				</div>
			</div>
		</div>
	`;

	const hamburger = document.getElementById('hamburger-menu');
	const mobileMenu = document.getElementById('mobile-menu');
	const themeToggle = document.getElementById('theme-toggle');

	if (hamburger && mobileMenu) {
		hamburger.addEventListener('click', () => {
			const isActive = mobileMenu.classList.toggle('active');
			hamburger.classList.toggle('active', isActive);
			hamburger.setAttribute('aria-expanded', isActive);
		});

		mobileMenu.addEventListener('click', (e) => {
			if (e.target === mobileMenu) {
				mobileMenu.classList.remove('active');
				hamburger.classList.remove('active');
				hamburger.setAttribute('aria-expanded', false);
			}
		});

		const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-nav a');
		mobileLinks.forEach((link) => {
			link.addEventListener('click', () => {
				mobileMenu.classList.remove('active');
				hamburger.classList.remove('active');
				hamburger.setAttribute('aria-expanded', false);
			});
		});
	}

	if (themeToggle) {
		themeToggle.addEventListener('click', toggleTheme);
	}
};

const toggleTheme = () => {
	const root = document.documentElement;
	const currentTheme = root.getAttribute('data-theme') || 'light';
	const newTheme = currentTheme === 'light' ? 'dark' : 'light';
	
	root.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
	
	const themeToggle = document.getElementById('theme-toggle');
	if (themeToggle) {
		themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
	}
};

const renderProfileCard = () => {
	const siteGrid = document.querySelector('.site-grid');
	if (!siteGrid || siteGrid.querySelector('.profile-card')) {
		return;
	}

	const taglines = {
		about: 'Analytical and investigative by nature, wanting to get insights and answers with evidence!',
		career: 'analyst and DFI.',
		education: 'Computer Science, MS in Cyber Security.',
		projects: 'sustainability, automation, and investigation-focussed',
	};

	const pageName = document.body?.dataset?.page || 'home';
	const tagline = taglines[pageName] || 'sustainability, automation and investigation.';

	const profileHTML = `
		<aside class="profile-card">
			<div class="portrait-wrap">
				<img src="assets/images/me.jpg" alt="Portrait of Tayyeba" class="portrait">
				<img src="assets/images/leb.png" alt="Decorative sticker" class="sticker">
			</div>

			<h1>Hi, I&apos;m Tayyeba</h1>
			<p class="tagline">${tagline}</p>

			<div class="status-box">
				<span class="status-label">status</span>
				<p id="status-text">loading in...</p>
			</div>

			<div class="mini-facts">
				<span>UK-based</span>
				<span>CS grad</span>
				<span>cyber security MSc</span>
				<span>forensics era</span>
			</div>

			<div class="contact-links">
				<a href="https://www.linkedin.com/in/tayyeba-sadaq/" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>
				<a href="https://github.com/TayyebaSadaq" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>
				<a href="https://substack.com/@codedbytea" target="_blank" rel="noopener noreferrer" title="Substack">Substack</a>
			</div>
		</aside>
	`;

	siteGrid.insertAdjacentHTML('afterbegin', profileHTML);
};

window.addEventListener('load', () => {
	const pageName = document.body?.dataset?.page || 'home';
	const titleMap = {
		home: 'tiny internet nook',
		about: 'about',
		career: 'career',
		education: 'education',
		projects: 'projects',
	};

	const dateLabel = new Date().toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const pageTitle = titleMap[pageName] || 'tiny internet nook';
	renderSharedNavbar();
	renderProfileCard();
	
	const statusText = document.getElementById('status-text');
	if (statusText) {
		setInterval(() => {
			messageIndex = (messageIndex + 1) % statusMessages.length;
			statusText.textContent = statusMessages[messageIndex];
		}, 3600);
	}
	
	document.title = `Tayyeba Sadaq | ${pageTitle} (${dateLabel})`;
	loadMarkdownPanels();
});
