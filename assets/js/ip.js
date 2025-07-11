
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('ip-address').textContent = `Your IP address is: ${data.ip}`;
  })
  .catch(error => {
    console.error('Error fetching IP address:', error);
    document.getElementById('ip-address').textContent = 'Could not fetch IP address.';
  });
