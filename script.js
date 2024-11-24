const API_KEY = '37f2f75af38e4d99a7142c87894f69ff';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const newsContainer = document.getElementById('newsContainer');

async function fetchNews(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

function displayNews(articles, container) {
    container.innerHTML = ''; // Clear existing content
    articles.forEach((article, index) => {
        if (article.title && article.title.toLowerCase() !== 'removed') {
            const articleElement = document.createElement('article');
            articleElement.classList.add('news-card');
            articleElement.style.animationDelay = `${index * 0.1}s`;
            
            const title = article.title || 'No title available';
            const description = article.description || 'No description available';
            const truncatedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
            const imageUrl = article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image';
            const sourceName = article.source.name || 'Unknown Source';

            articleElement.innerHTML = `
                <img src="${imageUrl}" alt="${title}" class="news-card-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Available';">
                <div class="news-card-content">
                    <span class="category-tag">${sourceName}</span>
                    <h3>${title}</h3>
                    <p>${truncatedDescription}</p>
                    <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                </div>
            `;
            container.appendChild(articleElement);
        }
    });

    if (container.children.length === 0) {
        container.innerHTML = '<p class="no-results">No news articles available at the moment. Please try again later.</p>';
    }
}

async function fetchTopStories() {
    const articles = await fetchNews(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    displayNews(articles, newsContainer);
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        const articles = await fetchNews(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`);
        searchResults.innerHTML = '<h2 class="section-title">Search Results</h2>';
        displayNews(articles, searchResults);
    }
});

fetchTopStories();

