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
  const likeButtons = document.querySelectorAll('.likeButton');

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

  attachLikeButtonListeners();

  //   on modal click
  document.querySelectorAll(".modal-img").forEach((modalImage) => {
    modalImage.addEventListener("click", () => {
      console.log("Modal Image Clicked:", modalImage); // Log the modalImage object
      const postId = modalImage.classList[5]; // Check the class list and index
      console.log("postId:", postId); // Log the postId
      displayCommentsForPost(postId);
    });
  });
});

function attachLikeButtonListeners() {
  const likeButtons = document.querySelectorAll(".likeButton");
  likeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const postId = button.getAttribute("data-postId"); // Get the post ID from a data attribute
      const userId = getUserIdFromToken(getAuthToken());
      if (userId) {
        likePost(postId, userId);
      } else {
        console.error("User ID not found. Unable to like the post.");
      }
    });
  });
}

async function renderAllPosts() {
  try {
    const data = await fetch("http://localhost:4505/posts/posts", {
      method: "GET",
    });

    const posts = await data.json();
      console.log(posts.data, "Posts");
    const postsHTML = posts.data.map(function (post, index) {
      const modalId = `imageModal${index}`;
      return `
          <div class="card shadow shadow-right m-3" style="width: 40rem; background-color: #e3e9ed;">
          <small><img src="../statics/images/paul.png"  class="rounded-circle mt-2 align-self-start" style="width: 40px; height: 40px;" class="profile-image" id="userProfilepicture">
          Stranger</small> 
              <img src="${post.postImage}" class="card-img-top mx-auto mt-3 clickable-image modal-img${post.postid}" alt="newPost" style="max-width: 80%; max-height: 80%; padding: 10px;" data-toggle="modal" data-target="#${modalId}">

            <small class="text-muted">${post.postDate}</small>
            <div class="card-body">
              <p class="card-text">"${post.postCaption}"</p>
            </div>
            <div class="card-footer">
            <div class="post">
  
            <!-- Post content here -->
            <small class="ml-auto likeButton" data-postId="${post.postid}">
              <iconify-icon style="font-size:24px;" icon="mdi:heart-outline"></iconify-icon>
            </small>
            <span id="likeCount-${post.postid}">${post.likesCount}</span>
  </div>
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

                    <small class="ml-auto likeButton" data-postId="${post.postid}"><iconify-icon style="font-size:24px;"icon="mdi:heart-outline"></iconify-icon></small> 
                    <span id="likeCount-${post.postid}"> ${post.likesCount} </span>

                    
                  </div>
                    <div class="container mt-5" id="comments-container">
                      <div class="comment-card">
                        <h6 class="mt-3" id="commentUsername">Anonymous</h6>
                        <p id="commentGoesHere" >This saying is often used to motivate and uplift individuals who are facing hardships or struggling with adversity.</p>
                        <div class="action-buttons">
                            <button class="btn btn-outline-primary btn-sm">Edit</button>
                            <button class="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </div>
                      
                      <!-- Child comment with greater left margin -->
                      <div class="comment-card child-comment">
                        <h6 class="mt-3">Anonymous</h6>
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
async function displayCommentsForPost(postid, commentsData) {
  try {
    const response = await fetch(
      `http://localhost:4505/comments/getcommentsbyid/${postid}`,
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      const commentsData = await response.json();
      const commentsContainer = document.getElementById("comments-container");

      // Clear any existing comments
      commentsContainer.innerHTML = "";
      console.log("========>", commentsData.comments);
      // Check if commentsData.comments is an array and not empty
      if (
        Array.isArray(commentsData.comments) &&
        commentsData.comments.length > 0
      ) {
        commentsData.comments.forEach((comment) => {
          const commentElement = document.createElement("div");
          commentElement.className = "comment-card";

          // Construct the comment HTML with username and text
          commentElement.innerHTML = `
              <h6 class="mt-3" class="text-start" id="commentUsername">${
                comment.username || "Anonymous"
              }</h6>
              <p id="commentGoesHere " class="text-start">${comment.commentText}</p>
              <div class="action-buttons">
                  <button class="btn btn-outline-primary btn-sm">Edit</button>
                  <button class="btn btn-danger btn-sm">Delete</button>
              </div>
            `;
          // console.log(comment.commentText)

          // Append the comment to the comments container
          commentsContainer.appendChild(commentElement);

          addDeleteCommentListener(
            commentElement,
            comment.commentid,
            postid,
            commentsData
          );
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

  function addDeleteCommentListener(
    commentElement,
    commentId,
    postid,
    commentsData
  ) {
    const deleteButton = commentElement.querySelector(".btn-danger");
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (confirmDelete) {
        await deleteComment(commentId, postid, commentsData);
      }
    });
  }
}

async function deleteComment(commentId, postid, commentsData) {
  const token = getAuthToken();
  const userid = getUserIdFromToken(token);

  try {
    const response = await fetch(
      `http://localhost:4505/comments/deletecomment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          userid: userid,
        }),
      }
    );

    if (response.status === 200) {
      console.log("Comment deleted successfully.");
      console.log("Comments data before filtering:", commentsData.comments);

      commentsData.comments = commentsData.comments.filter(
        (comment) => comment.commentid !== commentId
      );

      displayCommentsForPost(postid, commentsData); // Refresh comments after deletion
    } else if (response.status === 403) {
      console.error("You are not authorized to delete this comment.");
      console.error(await response.text()); // Log response body
      // Display a pop-up message to the user
      window.alert("You cannot delete this comment.");
    } else {
      console.error("Failed to delete the comment.");
      console.error(await response.text()); // Log response body
    }
  } catch (error) {
    console.error("An error occurred while deleting the comment:", error);
  }
}


function initializePosts() {
  const likeButtons = document.querySelectorAll(".likeButton");

  likeButtons.forEach((likeButton) => {
    const postId = likeButton.getAttribute("data-postId");
    likeButton.addEventListener("click", () => {
      toggleLikePost(postId, userId); // Replace userId with the actual user ID
    });
  });
}
// JavaScript function to handle post liking
async function likePost(postId, userId) {
  try {
    const response = await fetch("http://localhost:4505/likes/checklikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: postId,
        userid: userId,
      }),
    });

    if (response.status === 200) {
      // Post liked successfully, update the like count and icon color
      const likeCountElement = document.getElementById(`likeCount-${postId}`);
      const currentLikeCount = parseInt(likeCountElement.textContent, 10);
      likeCountElement.textContent = `${currentLikeCount + 1} Likes`;

      const likeButton = document.querySelector(`.likeButton[data-postId="${postId}"]`);
      likeButton.querySelector("iconify-icon").classList.remove("like-icon");
      likeButton.querySelector("iconify-icon").classList.add("like-icon-red");

      alert("Post liked successfully");
    } else if (response.status === 400) {
      // User has already liked this post, show a message
      alert("You have already liked this post.");
    } else {
      console.error("Failed to like the post.");
    }
  } catch (error) {
    console.error("An error occurred while liking the post:", error);
    alert("An error occurred while liking the post. Please try again later.");
  }
}



// Function to unlike a post
async function unlikePost(postId, userId) {
  try {
    const response = await fetch("http://localhost:4505/likes/unlikepost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: postId,
        userid: userId,
      }),
    });

    if (response.status === 200) {
      // Post unliked successfully, update the like count
      const likeCountElement = document.getElementById(`likeCount-${postId}`);
      const currentLikeCount = parseInt(likeCountElement.textContent, 10);
      likeCountElement.textContent = `${currentLikeCount - 1} Likes`;
      alert("Post unliked successfully");
    } else if (response.status === 400) {
      const data = await response.json();
      alert(data.message); // User hasn't liked this post
    } else {
      const data = await response.json();
      alert(data.message); // Handle other server errors
    }
  } catch (error) {
    console.error("An error occurred while unliking the post:", error);
    alert("An error occurred while unliking the post. Please try again later.");
  }
}

// Function to toggle like/unlike a post
async function toggleLikePost(postId, userId) {
  try {
    const response = await fetch("http://localhost:4505/likes/checklikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: postId,
        userid: userId,
      }),
    });

    if (response.status === 200) {
      // Post is liked, so unlike it
      unlikePost(postId, userId);
    } else if (response.status === 400) {
      // Post is not liked, so like it
      likePost(postId, userId);
    } else {
      const data = await response.json();
      alert(data.message); // Handle other server errors
    }
  } catch (error) {
    console.error("An error occurred while toggling like/unlike:", error);
    alert(
      "An error occurred while toggling like/unlike. Please try again later."
    );
  }
}


initializePosts();
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
