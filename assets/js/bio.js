
fetch('bio.md')
  .then(response => response.text())
  .then(text => {
    document.getElementById('bio-content').innerHTML = marked.parse(text);
  });
