// Multi-line typing animation for bio
fetch('bio.md')
  .then(response => response.text())
  .then(text => {
    const bioContentElement = document.getElementById('bio-content');
    const bioHTML = marked.parse(text);
    
    // Split text into lines
    const lines = text.split('\n\n').filter(line => line.trim() !== '');
    
    // Clear content
    bioContentElement.innerHTML = '';
    
    // Create typing lines
    lines.forEach((line, lineIndex) => {
        const lineDiv = document.createElement('p');
        lineDiv.style.margin = '0 0 15px 0';
        lineDiv.style.color = 'green';
        lineDiv.style.fontFamily = 'Courier New, monospace';
        bioContentElement.appendChild(lineDiv);
        
        let charIndex = 0;
        const speed = 20; // Typing speed
        
        function typeLine() {
            if (charIndex < line.length) {
                lineDiv.textContent += line.charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, speed);
            } else {
                // Add cursor to last line
                if (lineIndex === lines.length - 1) {
                    const cursor = document.createElement('span');
                    cursor.className = 'typing-cursor';
                    cursor.textContent = '|';
                    lineDiv.appendChild(cursor);
                    
                    // Remove cursor after 3 seconds
                    setTimeout(() => {
                        cursor.remove();
                    }, 3000);
                }
            }
        }
        
        // Start each line with a slight delay
        setTimeout(typeLine, lineIndex * 200);
    });
  });
