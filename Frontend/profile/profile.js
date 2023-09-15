function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/Frontend/auth/login.html";
}

// Check if the user is authenticated on page load
const token = localStorage.getItem("token");
const userid = localStorage.getItem("user");

if (!token) {
  window.location.href = "/Frontend/auth/login.html";
}

// Creating the profile

document.addEventListener("DOMContentLoaded", function () {
  const profileForm = document.getElementById("profileForm");
  const profileImageInput = document.getElementById("fileInput"); // Change the variable name to avoid conflict
  const bioTextarea = document.getElementById("bioTextarea");
  const profileImage = document.querySelector(".profile-image");
  const bioParagraph = document.querySelector(".bio-paragraph");
  

  // Function to retrieve the user ID from the authentication token (JWT)
  function getUserIdFromToken(token) {
    try {
      // Parse the JWT token (assuming it's in the format "header.payload.signature")
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));

      // Assuming the user ID is stored in the payload with a key like "userId"
      return payload.userId;
    } catch (error) {
      console.error("Failed to extract user ID from token:", error);
      return null; // Handle the error gracefully in your code
    }
  }

  // Function to fetch user profile data from the API
  async function fetchUserProfile(userid, token) {
    // Pass the token as a parameter
    try {
      // Make an HTTP GET request to your API endpoint
      const response = await fetch(
        `http://localhost:4505/users/profile/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`, 
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        profileImage.src = userData.profilePicture;
        // Update bio paragraph text
        bioParagraph.textContent = userData.bio;
      } else {
        console.error("Failed to fetch user profile data.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching user profile data:",
        error
      );
    }
  }



  function getAuthToken() {
    return localStorage.getItem("token"); 
  }

  if (userid) {
    fetchUserProfile(userid, token); // Pass the token
  } else {
    console.error("User ID is undefined. Unable to fetch user profile.");
  }
 
  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from actually submitting

    const imgObj = profileImageInput.files[0]; 

    // upload the picture to cloudinary

    const cloudinary_url =
      "https://api.cloudinary.com/v1_1/dgtjsiwow/image/upload";

    const cloudinary_preset = "anonyverse";

    const cloudinary_form_data = new FormData();

    cloudinary_form_data.append("file", imgObj);

    cloudinary_form_data.append("upload_preset", cloudinary_preset);

    const cloudinary_response = fetch(cloudinary_url, {
      method: "POST",

      body: cloudinary_form_data,
    });

    // Get the picture_url from the Cloudinary response
    const picture_url = await cloudinary_response.then((data) => {
      return data.json();
    });

    // console.log(picture_url);

    // Fetch data from form inputs
    const updatedData = new FormData(); // Use FormData to handle file uploads
    updatedData.append("bio", bioTextarea.value);
    updatedData.append("profilePicture", picture_url.secure_url); // Use profileImageInput for file upload

    try {
      // Make an HTTP POST request to update the user profile
      const response = await fetch(
        `http://localhost:4505/users/updateprofile/${userid}`,
        {
          method: "PUT",
          headers: {
            token: `${token}`, // Include authorization token
          },
          body: updatedData, // Use FormData as the body
        }
      );

      if (response.status === 200) {
        console.log("User profile updated successfully.");
        // Fetch and update user profile data again
        fetchUserProfile(userid, token); // Pass the token as a parameter
      } else {
        console.error("Failed to update user profile.");
      }
    } catch (error) {
      console.error("An error occurred while updating user profile:", error);
      // Handle errors accordingly, but remove 'res.status(500)' from the client-side code
    }
  });
});
