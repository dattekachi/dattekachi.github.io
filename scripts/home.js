// Home page specific JavaScript
function openLink(url) {
    window.open(url, "_blank");
}

// Load products from data.json
async function loadProducts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const productsContainer = document.getElementById('products-container');
        
        data.products.forEach(product => {
            const productCard = document.createElement('a');
            productCard.href = product.link;
            productCard.target = '_blank';
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/150x150?text=${encodeURIComponent(product.name)}'">
                <h3 class="product-name">${product.name}</h3>
            `;
            
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load posts from individual post data files
async function loadPosts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const postsContainer = document.getElementById('posts-container');
        
        // Load each post's metadata
        for (const postId of data.posts) {
            try {
                const postResponse = await fetch(`posts/data/${postId}.json`);
                const post = await postResponse.json();
                
                const postCard = document.createElement('a');
                postCard.href = `posts/post.html?id=${post.id}`;
                postCard.className = 'post-card';
                
                postCard.innerHTML = `
                    <img src="${post.image}" alt="${post.title}" class="post-image">
                    <h3 class="post-title">${post.title}</h3>
                `;
                
                postsContainer.appendChild(postCard);
            } catch (error) {
                console.error(`Error loading post ${postId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Load products and posts when page loads
loadProducts();
loadPosts();
