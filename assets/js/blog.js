const mediumContainer = document.getElementById('medium-posts');

async function loadMediumPosts() {
  const rssUrl = 'https://medium.com/feed/@zobla';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  try {
    const response = await fetch(apiUrl);
    const posts = await response.json();

    const filteredPosts = filterPosts(posts.items);

    renderSuccessLayout(filteredPosts);
  } catch (err) {
    console.error('Error fetching Medium posts:', err);
    renderErrorLayout();
  }
}

function filterPosts(posts) {
  // Identify the ng-aos post
  const ngAosPost = posts.find((post) =>
    post.title
      .toLowerCase()
      .includes('animate elements on scroll in angular v20')
  );

  // Filter out the old v15 post
  const filtered = posts.filter((post) => {
    const title = post.title.toLowerCase();
    return !(
      title.includes('animate elements on scroll with intersection observer') &&
      !title.includes('v20')
    );
  });

  // Sort remaining posts by oldest
  const sorted = filtered.sort(
    (a, b) => new Date(a.pubDate) - new Date(b.pubDate)
  );

  // Move v20 post to the front if it exists
  if (ngAosPost) {
    const withoutNew = sorted.filter((p) => p !== ngAosPost);
    return [ngAosPost, ...withoutNew];
  }

  return sorted;
}

function renderSuccessLayout(posts) {
  mediumContainer.innerHTML = ''; // clear "Loading..."

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('blog-post-item');

    // Try to extract first image from the post content
    const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
    const imgSrc = imgMatch ? imgMatch[1] : './assets/images/default.jpg';

    li.innerHTML = `
        <a href="${post.link}" target="_blank">
          <figure class="blog-banner-box">
            <img src="${imgSrc}" alt="${post.title}" loading="lazy" />
          </figure>

          <div class="blog-content">
            <div class="blog-meta">
              <p class="blog-category">Medium</p>
              <span class="dot"></span>
              <time datetime="${new Date(post.pubDate).toISOString()}">
                ${new Date(post.pubDate).toDateString()}
              </time>
            </div>

            <h3 class="h3 blog-item-title">${post.title}</h3>
          </div>
        </a>
      `;

    mediumContainer.appendChild(li);
  });
}

function renderErrorLayout() {
  mediumContainer.innerHTML = '';

  const span = document.createElement('span');
  span.classList.add('blog-state');

  span.innerHTML = '<span class="blog-state">Failed to load posts.</span>';

  mediumContainer.appendChild(span);
}

loadMediumPosts();
