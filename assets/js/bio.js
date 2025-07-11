
fetch('bio.md')
  .then(response => response.text())
  .then(text => {
    const bioContentElement = document.getElementById('bio-content');
    const bioHTML = marked.parse(text);
    
    // Extract plain text from HTML for typing effect
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bioHTML;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    // Clear the content first
    bioContentElement.innerHTML = '';
    
    let index = 0;
    const speed = 30; // Typing speed in milliseconds
    
    function typeWriter() {
        if (index < plainText.length) {
            bioContentElement.textContent = plainText.substring(0, index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            // After typing is complete, replace with properly formatted HTML
            bioContentElement.innerHTML = bioHTML;
            
            // Add blinking cursor after typing is complete
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            bioContentElement.appendChild(cursor);
            
            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.remove();
            }, 3000);
        }
    }
    
    // Start typing after a small delay
    setTimeout(typeWriter, 1000);
  });
