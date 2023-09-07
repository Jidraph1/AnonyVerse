document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const emailInput = document.getElementById('exampleInputEmail1');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('passwd');

    registrationForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearErrors();

      const email = emailInput.value.trim();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

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

      // Send registration data to the backend
      try {
        const response = await fetch('http://localhost:4505/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message === 'Register success') {
            displaySuccess('User registered successfully!');
          } else {
            displayError('Error registering user.');
          }
        } else {
          displayError('Error registering user.');
        }
      } catch (error) {
        displayError('An error occurred while registering user.');
      }
    });

    function displayError(message) {
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.style.display = 'block';
      errorContainer.textContent = message;
    }

    function clearErrors() {
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.style.display = 'none';
      errorContainer.textContent = '';
    }

    function displaySuccess(message) {
      const successContainer = document.getElementById('successContainer');
      successContainer.style.display = 'block';
      successContainer.textContent = message;

      setTimeout(() => {
        successContainer.style.display = 'none';
        successContainer.textContent = '';
      }, 3000);
    }
  });