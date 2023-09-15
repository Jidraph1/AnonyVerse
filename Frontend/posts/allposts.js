function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/Frontend/auth/login.html";
}
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/Frontend/auth/login.html";
}

document.addEventListener("DOMContentLoaded", async function () {
  // Attach event listeners for modal interactions
  const postImageInput = document.getElementById("postImageInput");
  const postCaptionTextarea = document.getElementById("postCaptionTextarea");
  const createPostButton = document.getElementById("shareButton");

  // IDs for displaying the posted content
  const postedImage = document.getElementById("postedImage");
  const postedCaption = document.getElementById("postedCaption");
  const postedDate = document.getElementById("postedDate");
  const postContent = document.getElementById("postContent");

  // Function to retrieve the user ID from the JWT token
  function getUserIdFromToken(token) {
    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      return payload.userid;
    } catch (error) {
      console.error("Failed to extract user ID from token:", error);
      return null;
    }
  }

  // Function to get the authentication token from local storage
  function getAuthToken() {
    return localStorage.getItem("token");
  }

  async function createPost(token) {
    const postCaption = postCaptionTextarea.value;
    const postImage = postImageInput.files[0];
    // Get the user ID from the token
    const userid = getUserIdFromToken(token);

    if (!userid) {
      console.error("User ID not found in the token.");
      return;
    }

    // Upload the picture to Cloudinary
    const cloudinary_url =
      "https://api.cloudinary.com/v1_1/dgtjsiwow/image/upload";
    const cloudinary_preset = "anonyverse";
    const cloudinary_form_data = new FormData();
    cloudinary_form_data.append("file", postImage);
    cloudinary_form_data.append("upload_preset", cloudinary_preset);

    const cloudinary_response = await fetch(cloudinary_url, {
      method: "POST",
      body: cloudinary_form_data,
    });

    const picture_url = await cloudinary_response.json();

    try {
      // Make an HTTP POST request to create a new post
      const response = await fetch("http://localhost:4505/posts/new-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({
          userid: getUserIdFromToken(token), // Add user ID to the request body
          postCaption,
          postImage: picture_url.secure_url,
        }),
      });

      if (response.status === 200) {
        console.log("Post created successfully.");
        // Clear form inputs after successful post creation
        postCaptionTextarea.value = "";
        postImageInput.value = "";

        // Display the posted content in the modal
        postedImage.src = picture_url.secure_url;
        postedCaption.textContent = postCaption;
        const currentDate = new Date().toLocaleDateString();
        postedDate.textContent = `${currentDate}`;
        //   postContent.style.display = "block"; // Show the posted content
      } else {
        console.error("Failed to create a new post.");
      }
    } catch (error) {
      console.error("An error occurred while creating a new post:", error);
    }
  }

  createPostButton.addEventListener("click", async function (event) {
    event.preventDefault();
    const token = getAuthToken();
    if (token) {
      createPost(token);
    } else {
      console.error("Authentication token not found. Unable to create a post.");
    }
  });

  // Call renderAllPosts to load posts
  await renderAllPosts();

  // Other initialization code or event listeners can go here

//   on modal click
document.getElementById("modal-img").addEventListener("click",()=>{
    const postId = document.getElementById("modal-img").classList[4]
    displayCommentsForPost(postId)
    
})
});

async function renderAllPosts() {
  try {
    const data = await fetch("http://localhost:4505/posts/posts", {
      method: "GET",
    });

    const posts = await data.json();
    //   console.log(posts.data, "Posts");
    const postsHTML = posts.data.map(function (post, index) {
      const modalId = `imageModal${index}`;
      return `
          <div class="card shadow shadow-right m-3" style="width: 40rem; background-color: #e3e9ed;">
          <small><img src="../statics/images/paul.png"  class="rounded-circle mt-2 align-self-start" style="width: 40px; height: 40px;" id="userProfilepicture">
          Stranger</small> 
              <img id="modal-img" src="${post.postImage}" class="card-img-top mx-auto mt-3 clickable-image ${post.postid}" alt="newPost" style="max-width: 80%; max-height: 80%; padding: 10px;" data-toggle="modal" data-target="#${modalId}">

            <small class="text-muted">${post.postDate}</small>
            <div class="card-body">
              <p class="card-text">"${post.postCaption}"</p>
            </div>
            <div class="card-footer">
              <div class="post">
                <button id="likeButton">Like</button>
                <span id="likeCount">0 Likes</span>
              </div>
              <small class="ml-auto"><iconify-icon icon="mdi:heart-outline"></iconify-icon> 228</small> 
              <div class="input-group input-group-sm mb-3">
              <input type="text" class="form-control" id="comment-input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Comment"> 
            </div>
            <button class="btn btn-primary comment-button"  onclick="addComment('${post.postid}')">Comment</button>
            </div>
          </div>
  
  
          <!-- Modal Image -->
          <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="${modalId}Label" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body text-sm-start" >
                    <!-- Display the image -->
                    <img
                        src="${post.postImage}"
                        class="img-fluid"
                        alt=""
                    >
  
                    <!-- Display comments from previous posts -->
                    <p class="text-center mt-3">“${post.postCaption}”</p>

                    <p class="mt-3">Likes: 123</p>
                    <div class="container mt-5" id="comments-container">
                      <div class="comment-card">
                        <h6 class="mt-3" id="commentUsername">Jidraph Kimachia</h6>
                        <p id="commentGoesHere" >This saying is often used to motivate and uplift individuals who are facing hardships or struggling with adversity.</p>
                        <div class="action-buttons">
                            <button class="btn btn-outline-primary btn-sm">Edit</button>
                            <button class="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </div>
                      
                      <!-- Child comment with greater left margin -->
                      <div class="comment-card child-comment">
                        <h6 class="mt-3">Daniel Karanja</h6>
                        <p>Behind every successful person, there is a lot of coffee."</p>
                        <div class="action-buttons">
                          <button class="btn btn-outline-primary btn-sm">Edit</button>
                          <button class="btn btn-danger btn-sm">Delete</button>
                        </div>
                          <!-- Add more child comments as needed -->
                      </div>
                  </div>
                   
                   
                </div>
                <div class="modal-footer">
                    <!-- Close button -->
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
        `;
    });

    document.getElementById("maincontent").innerHTML = postsHTML.join("");
  } catch (e) {
    console.error(e);
  }
}

// ...

const commentButton = document.querySelector(".comment-button");


function getAuthToken() {
  return localStorage.getItem("token");
}

async function addComment(postid) {
  const token = getAuthToken();

  const commentText = document.querySelector("#comment-input").value;
  try {
    const response = await fetch("http://localhost:4505/comments/addcomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token, 
      },
      body: JSON.stringify({
        postid: postid,
        userid: getUserIdFromToken(token),
        commentText: commentText,
      }),
    });

    if (response.status === 200) {
      console.log("Comment added successfully.");

      // Clear the comment input field
      const commentInput = document.querySelector("#comment-input");
      commentInput.value = "";

      displayCommentsForPost(postid);


    } else {
      console.error("Failed to add a comment.");
    }
  } catch (error) {
    console.error("An error occurred while adding a comment:", error);
  }
}
async function displayCommentsForPost(postid) {
    try {
      const response = await fetch(`http://localhost:4505/comments/getcommentsbyid/${postid}`, {
        method: "GET",
      });
  
      if (response.status === 200) {
        const commentsData = await response.json();
        const commentsContainer = document.getElementById("comments-container");
  
        // Clear any existing comments
        commentsContainer.innerHTML = "";
        console.log('========>',commentsData.comments);
        // Check if commentsData.comments is an array and not empty
        if (Array.isArray(commentsData.comments) && commentsData.comments.length > 0) {
          commentsData.comments.forEach((comment) => {
            const commentElement = document.createElement("div");
            commentElement.className = "comment-card";
  
            // Construct the comment HTML with username and text
            commentElement.innerHTML = `
              <h6 class="mt-3" id="commentUsername">${comment.username || 'Anonymous'}</h6>
              <p id="commentGoesHere">${comment.commentText}</p>
              <div class="action-buttons">
                  <button class="btn btn-outline-primary btn-sm">Edit</button>
                  <button class="btn btn-danger btn-sm">Delete</button>
              </div>
            `;
            // console.log(comment.commentText)
  
            // Append the comment to the comments container
            commentsContainer.appendChild(commentElement);
          });
        } else {
          // Handle the case where no comments were returned
          commentsContainer.innerHTML = "No comments available.";
        }
      } else {
        console.error("Failed to fetch comments for the post.");
      }
    } catch (error) {
      console.error("An error occurred while fetching comments:", error);
    }
  }

// Get user Id From Token Function
function getUserIdFromToken(token) {
  try {
    if (!token) {
      console.error("Token is null or undefined.");
      return null;
    }

    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) {
      console.error("Payload is missing in the token.");
      return null;
    }

    const payload = JSON.parse(atob(payloadBase64));
    const userid = payload.userid; // Ensure that this key matches your token structure

    if (!userid) {
      console.error("User ID not found in the token payload.");
      return null;
    }

    return userid;
  } catch (error) {
    console.error("Failed to extract user ID from token:", error);
    return null;
  }
}


