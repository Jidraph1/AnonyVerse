const errorContainer = document.getElementById('errorContainer');

function displayError(message) {
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
}

function clearError() {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
}

async function loginUser() {
    clearError();

    const email = document.getElementById('email').value;
    const password = document.getElementById('passwd').value;

    // Validate input
    if (!email || !password) {
        displayError('Please fill in all fields.');
        return;
    }

    try {
        // Make a POST request to your backend login endpoint
        const response = await fetch('http://localhost:4505/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200) {
            // Login successful, redirect to the desired page
            const data = await response.json();
            const token = data.token;
            // Store the token in localStorage or a cookie for future requests
            localStorage.setItem('token', token);
            localStorage.setItem('user', data.user.id);
            window.location.href = '/Frontend/posts/allposts.html';
        } else if (response.status === 403) {
            // Wrong password
            displayError('Wrong password. Please try again.');
        } else if (response.status === 404) {
            // User not found
            displayError('Please register first.');
        } else {
            // Other errors (server or network)
            displayError('An error occurred while logging in.');
        }
    } catch (error) {
        console.error('An error occurred while logging in:', error);
        displayError('An error occurred while logging in.');
    }
}

