// const checkLikeEndpoint = 'http://localhost:4505/likes/checklikes';
// const unlikePostEndpoint = 'http://localhost:4505/likes/unlikepost'

// const postID = "2d32e81b-6acc-4f13-8a50-55daa8cc568f"; // Replace with the actual post ID
//         const userID = "b91c2d2a-4235-4c97-9767-7a574bd95ec0"; // Replace with the actual user ID

//         const likeButton = document.getElementById('likeButton');
//         const likeCount = document.getElementById('likeCount');
//         let isLiked = false;

//         // Function to check if the post is liked by the user
//         async function checkLikeStatus() {
//             try {
//                 const response = await fetch(checkLikeEndpoint, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ userid: userID, postid: postID }),
//                 });
        
//                 const data = await response.json();
        
//                 if (response.status === 200) {
//                     isLiked = data.isLiked;
//                     updateLikeButton();
//                 } else {
//                     console.error(data.Error);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }
        
//         // Function to update the like button text based on like status
//         function updateLikeButton() {
//             if (isLiked) {
//                 likeButton.textContent = 'Unlike';
//             } else {
//                 likeButton.textContent = 'Like';
//             }
//         }

//         // Function to handle liking/unliking a post
//         async function toggleLikePost() {
//             try {
//                 const action = isLiked ? 'unlike' : 'like';
//                 const response = await fetch(`http://localhost:4505/likes/unlikepost`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ userid: userID, postid: postID }),
//                 });

//                 const data = await response.json();

//                 if (response.status === 200) {
//                     isLiked = !isLiked;
//                     updateLikeButton();
//                     likeCount.textContent = `${parseInt(likeCount.textContent) + (isLiked ? 1 : -1)} Likes`;
//                 } else {
//                     console.error(data.Error);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }

//         // Add a click event listener to the like button
//         likeButton.addEventListener('click', toggleLikePost);

//         // Initialize like status when the page loads
//         checkLikeStatus();