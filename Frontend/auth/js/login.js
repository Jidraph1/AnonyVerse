const errorContainer = document.getElementById('errorContainer');

        function displayError(message) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = message;
        }

        function clearError() {
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
        }

        async function checkUserInDatabase(email, password) {
            try {
                // Simulate server-side validation (replace with actual server code)
                const usersInDatabase = [
                    { email: 'john_doe', password: 'password123' },
                    { email: 'jane_smith', password: 'letmein' }
                ];

                const user = usersInDatabase.find(u => u.email === email);

                if (user && user.password === password) {
                    // User exists and password is correct
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('An error occurred while checking the user in the database:', error);
                return false;
            }
        }

        function loginUser() {
            clearError();

            const email = document.getElementById('email').value;
            const password = document.getElementById('passwd').value;

            // Validate input
            if (!email || !password) {
                displayError('Please fill in all fields.');
                return;
            }

            // Check if the user exists in the database
            const userExists = checkUserInDatabase(email, password);

            if (userExists) {
                // Redirect to the desired page (e.g., allposts.html)
                window.location.href = '/Frontend/posts/allposts.html';
            } else {
                // Display an error message and redirect to the registration page
                displayError('User not found. Please register first.');
                setTimeout(() => {
                    window.location.href = './register';
                }, 3000); // Redirect to the registration page after 3 seconds
            }
        }