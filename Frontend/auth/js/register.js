const errorContainer = document.getElementById('errorContainer');
const successContainer = document.getElementById('successContainer');

function displayError(message) {
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
}

function clearError() {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
}

function displaySuccess(message) {
    successContainer.style.display = 'block';
    successContainer.textContent = message;

    // Hide success message after 3 seconds
    setTimeout(() => {
        successContainer.style.display = 'none';
        successContainer.textContent = '';
    }, 3000);
}

async function checkUsernameAndEmail(username, email) {
    try {
        const response = await fetch('/check-username-and-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.usernameExists) {
                displayError('Username is already in use.');
                return false; // Return false to indicate error
            }
            if (data.emailExists) {
                displayError('Email is already in use.');
                return false; // Return false to indicate error
            }
        } else {
            displayError('Error checking username and email.');
            return false; // Return false to indicate error
        }
    } catch (error) {
        displayError('An error occurred while checking username and email.');
        return false; // Return false to indicate error
    }

    return true; // Return true to indicate success
}

async function registerUser() {
    clearError();
    successContainer.style.display = 'none';

    const email = document.getElementById('exampleInputEmail1').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('passwd').value;

    // Validate input
    if (!email || !username || !password) {
        displayError('Please fill in all fields.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayError('Invalid email format.');
        return;
    }

    // Check if username or email exists in the database
    const noErrors = await checkUsernameAndEmail(username, email);

    if (noErrors) {
        // If no errors, you can proceed to register the user
        // In a real application, you would send this data to your server for registration
        displaySuccess('User registered successfully!');
    }
}