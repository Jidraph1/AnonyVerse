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
      return null; 
    }
  }

  // Function to fetch user profile data from the API
  async function fetchUserProfile(userid, token) {
    try {
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
    fetchUserProfile(userid, token); 
  } else {
    console.error("User ID is undefined. Unable to fetch user profile.");
  }


    // Call the renderUserPosts function with the user's ID when loading the profile page
    if (userid) {
      renderUserPosts(userid); // Pass the user ID
    } else {
      console.error("User ID is undefined. Unable to render user posts.");
    }
  

 
  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault(); 

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

    const picture_url = await cloudinary_response.then((data) => {
      return data.json();
    });



    // Fetch data from form inputs
    const updatedData = new FormData(); 
    updatedData.append("bio", bioTextarea.value);
    updatedData.append("profilePicture", picture_url.secure_url);

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



  // Function to format the time as needed
  function formatTime(time) {
    // Implement your own logic to format the time, e.g., using the Date object
    return new Date(time).toLocaleString();
  }


// Function to render user-specific posts
async function renderUserPosts(userId) {
  try {
    const data = await fetch(`http://localhost:4505/posts/postsbyuser/${userId}`, {
      method: "GET",
    });

    const posts = await data.json();
    const userPostsContainer = document.getElementById("userPostsContainer");

    // Clear existing posts in the userPostsContainer, if any
    userPostsContainer.innerHTML = "";

    // Loop through the posts and create HTML for each post
    posts.data.forEach((post, index) => {
      const modalId = `imageModal${post.postid}`;
      const postCard = document.createElement("div");
      postCard.classList.add("col-md-4");

      postCard.innerHTML = `
        <div class="card post-card">
          <div class="card-body" style="height: 200px">
            <img
              src="${post.postImage}"
              class="card-img-top mx-auto img-fluid clickable-image"
              data-toggle="modal"
              data-target="#${modalId}" <!-- Use the unique modalId here -->
         
          </div>
        </div>

        <!-- Modal Image -->
        <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="${modalId}Label"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-body text-sm-start">
                <img src="${post.postImage}" class="img-fluid" alt="dog post" />
                <!-- Populate modal content based on post data here -->
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      userPostsContainer.appendChild(postCard);

      // Add an event listener to open the modal and populate its content
      postCard.querySelector(`.clickable-image`).addEventListener("click", () => {
        const imageModal = document.getElementById(`${modalId}`);
        const modalImage = imageModal.querySelector(".modal-body img");
        const modalCaption = imageModal.querySelector(".modal-title");
        const modalTime = imageModal.querySelector(".modal-time");

        // Get data attributes from the clicked image
        const caption = post.caption;
        const src = post.postImage;
        const time = post.timestamp;

        // Set the modal content based on the clicked image
        modalImage.src = src;
        modalCaption.textContent = `"${caption}"`;
        modalTime.textContent = formatTime(time); // Format the time as needed

        // Open the modal
        $(imageModal).modal("show");
      });
    });
  } catch (e) {
    console.error(e);
  }
}


