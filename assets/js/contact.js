// Contact form functionality with rate limiting using Formspree
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Formspree configuration
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkgbdyvl'; // Your actual Formspree endpoint
    
    // Rate limiting configuration
    const MAX_MESSAGES_PER_DAY = 2;
    const RATE_LIMIT_KEY = 'contactFormSubmissions';
    
    // Get user's IP address for rate limiting
    let userIP = null;
    
    // Function to get current date string
    function getCurrentDateString() {
        return new Date().toISOString().split('T')[0];
    }
    
    // Function to check rate limit
    function checkRateLimit(ip) {
        const today = getCurrentDateString();
        const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
        
        if (!submissions[ip]) {
            submissions[ip] = {};
        }
        
        if (!submissions[ip][today]) {
            submissions[ip][today] = 0;
        }
        
        return submissions[ip][today] < MAX_MESSAGES_PER_DAY;
    }
    
    // Function to increment rate limit counter
    function incrementRateLimit(ip) {
        const today = getCurrentDateString();
        const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
        
        if (!submissions[ip]) {
            submissions[ip] = {};
        }
        
        if (!submissions[ip][today]) {
            submissions[ip][today] = 0;
        }
        
        submissions[ip][today]++;
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    }
    
    // Function to show status message
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    // Function to reset form
    function resetForm() {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
    
    // Get user IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip;
        })
        .catch(error => {
            console.error('Error fetching IP:', error);
            // Fallback to a generic identifier
            userIP = 'unknown';
        });
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if we have the user's IP
        if (!userIP) {
            showStatus('Please wait a moment and try again.', 'error');
            return;
        }
        
        // Check rate limit
        if (!checkRateLimit(userIP)) {
            showStatus('You have reached the daily limit of 2 messages. Please try again tomorrow.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Validate form data
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        showStatus('Sending your message...', 'loading');
        
        // Prepare email data
        const emailData = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'daskibo@gmail.com', // This will be hidden in the backend
            user_ip: userIP
        };
        
        try {
            // Send email using Formspree
            const response = await sendEmail(emailData);
            
            if (response.success) {
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                incrementRateLimit(userIP);
                resetForm();
            } else {
                throw new Error(response.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showStatus('Failed to send message. Please try again later.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
    
    // Formspree implementation
    async function sendEmail(emailData) {
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: emailData.from_name,
                    email: emailData.from_email,
                    subject: emailData.subject,
                    message: emailData.message,
                    _replyto: emailData.from_email
                })
            });
            
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});
