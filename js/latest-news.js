// Your API key for TheNewsAPI
const API_KEY = 'SItYUVwBezXe0LWH0KA3FGYJqKzH1uXDCE0CxCZd'

// Function to fetch the latest news
async function fetchLatestNews() {
  try {
    const response = await fetch(`https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=us&limit=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data); // Debug: Log the API response
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

// Function to display the latest 3 news articles
async function displayLatestNews() {
  const loadingElement = document.getElementById('news-loading');
  const newsContainer = document.getElementById('news-container');

  if (!loadingElement || !newsContainer) {
    console.error('Required DOM elements not found');
    return;
  }

  try {
    loadingElement.style.display = 'block';
    loadingElement.textContent = 'Loading latest news...';

    const data = await fetchLatestNews();
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No news data available');
    }

    const latestThreeArticles = data.data;
    
    loadingElement.style.display = 'none';
    
    // Clear previous news items
    newsContainer.innerHTML = '';
    
    latestThreeArticles.forEach((article) => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      
      const title = document.createElement('h3');
      title.textContent = article.title || 'No title available';
      
      const description = document.createElement('p');
      description.textContent = article.description || 'No description available.';
      
      const link = document.createElement('a');
      link.href = article.url || '#';
      link.textContent = 'Read more';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      const publishedDate = document.createElement('p');
      publishedDate.className = 'news-date';
      const date = article.published_at ? new Date(article.published_at) : new Date();
      publishedDate.textContent = `Published: ${date.toLocaleDateString()}`;
      
      newsItem.appendChild(title);
      newsItem.appendChild(description);
      newsItem.appendChild(publishedDate);
      newsItem.appendChild(link);
      newsContainer.appendChild(newsItem);
    });
    
  } catch (error) {
    handleError(`Error: ${error.message}. Please try again later.`);
  }
}

// Function to handle errors and update UI accordingly
function handleError(message) {
  const loadingElement = document.getElementById('news-loading');
  if (loadingElement) {
    loadingElement.textContent = message;
    loadingElement.classList.add('error');
    loadingElement.style.display = 'block';
  }
  console.error(message);
}

// Run the function when the page loads
window.addEventListener('load', displayLatestNews);

// Refresh news every 5 minutes
setInterval(displayLatestNews, 300000);