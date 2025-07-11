// Load and display bio text immediately
fetch('bio.md')
  .then(response => response.text())
  .then(text => {
    const bioContentElement = document.getElementById('bio-content');
    const bioHTML = marked.parse(text);
    
    // Display the bio content immediately without animation
    bioContentElement.innerHTML = bioHTML;
  });
