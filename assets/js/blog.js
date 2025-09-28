const mediumContainer = document.getElementById('medium-posts');

async function loadMediumPosts() {
  const rssUrl = 'https://medium.com/feed/@nemanjablagojevic';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  try {
    const response = await fetch(apiUrl);
    const posts = await response.json();

    // sort by oldest
    const sortedPosts = posts.items.sort((a, b) => {
      return new Date(a.pubDate) - new Date(b.pubDate);
    });

    renderSuccessLayout(sortedPosts);
  } catch (err) {
    console.error('Error fetching Medium posts:', err);
    renderErrorLayout();
  }
}

function renderSuccessLayout(posts) {
  mediumContainer.innerHTML = ''; // clear "Loading..."

  // show 5
  posts.slice(0, 5).forEach((post) => {
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

  // const li = document.createElement('li');
  // li.classList.add('blog-post-item');
  // li.innerHTML = `
  //   <div class="blog-content">
  //     <p class="h3">Failed to load posts.</p>
  //   </div>
  // `;

  // mediumContainer.appendChild(li);
}

loadMediumPosts();
