// Post page specific JavaScript

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    window.location.href = '../index.html';
}

// Load post data
async function loadPost() {
    try {
        const response = await fetch(`data/${postId}.json`);
        const post = await response.json();
        
        // Set page title
        document.getElementById('page-title').textContent = post.title;
        document.getElementById('post-title').textContent = post.title;
        
        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
        document.getElementById('post-date').textContent = formattedDate;
        document.getElementById('post-author').textContent = post.author;
        
        // Render content
        const contentContainer = document.getElementById('post-content');
        contentContainer.innerHTML = '';
        
        post.content.forEach((block) => {
            switch (block.type) {
                case 'text':
                    const p = document.createElement('p');
                    p.textContent = block.value;
                    contentContainer.appendChild(p);
                    break;
                    
                case 'heading':
                    const h2 = document.createElement('h2');
                    h2.textContent = block.value;
                    contentContainer.appendChild(h2);
                    break;
                    
                case 'list':
                    const ul = document.createElement('ul');
                    block.items.forEach(item => {
                        const li = document.createElement('li');
                        
                        if (typeof item === 'object' && item.link) {
                            // Item has affiliate link
                            const link = document.createElement('a');
                            link.href = item.link;
                            link.target = '_blank';
                            link.textContent = item.text;
                            link.className = 'affiliate-link';
                            li.appendChild(link);
                        } else {
                            // Plain text item
                            li.textContent = typeof item === 'object' ? item.text : item;
                        }
                        
                        ul.appendChild(li);
                    });
                    contentContainer.appendChild(ul);
                    break;
                    
                case 'code':
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    
                    if (block.file) {
                        // Load code from file
                        fetch(block.file)
                            .then(response => response.text())
                            .then(text => {
                                code.textContent = text;
                            })
                            .catch(error => {
                                code.textContent = '// Error loading code file';
                                console.error('Error loading code:', error);
                            });
                    } else {
                        // Support both string and array format
                        code.textContent = Array.isArray(block.value) 
                            ? block.value.join('\n') 
                            : block.value;
                    }
                    
                    pre.appendChild(code);
                    contentContainer.appendChild(pre);
                    break;
                    
                case 'image':
                    const figure = document.createElement('figure');
                    figure.className = 'post-image-container';
                    
                    // Support both single image and array of images
                    const images = Array.isArray(block.src) ? block.src : [block.src];
                    const captions = Array.isArray(block.caption) ? block.caption : [block.caption];
                    
                    if (images.length > 1) {
                        const imagesGrid = document.createElement('div');
                        imagesGrid.className = 'images-grid';
                        
                        images.forEach((imgSrc, index) => {
                            const imgWrapper = document.createElement('div');
                            imgWrapper.className = 'image-wrapper';
                            
                            const img = document.createElement('img');
                            // Handle image path - if relative path, add ../ prefix
                            let imgPath = imgSrc;
                            if (!imgPath.startsWith('http') && !imgPath.startsWith('../')) {
                                imgPath = '../' + imgPath;
                            }
                            img.src = imgPath;
                            img.alt = captions[index] || '';
                            img.className = 'post-content-image';
                            
                            imgWrapper.appendChild(img);
                            
                            // Add caption for each image if exists
                            if (captions[index]) {
                                const caption = document.createElement('div');
                                caption.className = 'image-caption';
                                caption.textContent = captions[index];
                                imgWrapper.appendChild(caption);
                            }
                            
                            imagesGrid.appendChild(imgWrapper);
                        });
                        
                        figure.appendChild(imagesGrid);
                    } else {
                        const img = document.createElement('img');
                        // Handle image path - if relative path, add ../ prefix
                        let imgPath = images[0];
                        if (!imgPath.startsWith('http') && !imgPath.startsWith('../')) {
                            imgPath = '../' + imgPath;
                        }
                        img.src = imgPath;
                        img.alt = captions[0] || '';
                        img.className = 'post-content-image';
                        
                        figure.appendChild(img);
                    }
                    
                    // Only add common caption for single image
                    if (block.caption && images.length === 1) {
                        const figcaption = document.createElement('figcaption');
                        figcaption.textContent = block.caption;
                        figure.appendChild(figcaption);
                    }
                    
                    contentContainer.appendChild(figure);
                    break;
            }
        });
        
    } catch (error) {
        console.error('Error loading post:', error);
        contentContainer.innerHTML = '<p>Không tìm thấy bài viết.</p>';
    }
}

loadPost();
