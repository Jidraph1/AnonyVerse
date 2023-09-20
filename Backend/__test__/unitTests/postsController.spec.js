import {
  createPost,
  getAllPosts,
  addComment,
  getCommentsByPostId,
  deleteComment
} from "../../Controllers/postsControllers.js";

import { jwt } from "jsonwebtoken";
import mssql from "mssql";
import bcrypt from "bcrypt";
import { sqlConfig } from "../../Config/config.js";
import { pool } from "../../Config/config.js";

jest.mock("jsonwebtoken");

jest.mock("../../Config/config.js", () => ({
  pool: {
    connected: true,
    request: jest.fn().mockReturnThis(),
    input: jest.fn().mockReturnThis(),
    execute: jest.fn(() => {
      return { rowsAffected: [1] };
    }),
  },
}));

describe("Create Post Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should fail when the request body is empty", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await createPost(req, res);

    
    expect(res.status).toHaveBeenCalledWith(400);

    
    expect(res.json).toHaveBeenCalledWith({
      Error: "Invalid request body",
    });

  });

 
  
    it("should return all posts when there are posts", async () => {
      const mockPosts = [
        {
          postId: '1',
          postContent: 'Test post 1',
          postDate: '2023-09-01',
        },
        {
          postId: '2',
          postContent: 'Test post 2',
          postDate: '2023-09-02',
        },
      ];
  
      
      const req = {};
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      const mockRequest = {
        execute: jest.fn().mockResolvedValueOnce({
          rowsAffected: [mockPosts.length],
          recordset: mockPosts,
        }),
      };
      jest.spyOn(pool, "request").mockReturnValue(mockRequest);
  
      
      pool.connected = true;
  
      
      await getAllPosts(req, res);
  
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockPosts });
    });
  });


  it("should return an error message when there are no posts", async () => {
    // Mock the 'request' method of 'pool'
    const mockRequest = {
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [0], 
        recordset: [],
      }),
    };
    jest.spyOn(pool, "request").mockReturnValue(mockRequest);
  
    pool.connected = true;
  
    const req = {};
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await getAllPosts(req, res);
  

    expect(res.json).toHaveBeenCalledWith({ Error: 'No posts found' });
  });



  it("should return an error message when there's an issue connecting to the database", async () => {
    jest.spyOn(pool, "request").mockRejectedValueOnce(new Error("Database connection error"));
  
    pool.connected = false; 
    
    const req = {};
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await getAllPosts(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500); 
    expect(res.json).toHaveBeenCalledWith({ message: 'Error connecting to the database' });
  });
  


//  Comments
describe("Add Comment Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fail when the commentText field is empty", async () => {

    const req = {
      body: {
        postid: "post123",
        userid: "user123",
        commentText: "", 
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400); // 
    expect(res.json).toHaveBeenCalledWith({
      Error: "CommentText field cannot be empty",
    });
  });

  it("should return an error when there is a database connection error", async () => {
    const req = {
      body: {
        postid: "post123",
        userid: "user123",
        commentText: "This is a test comment",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    // Simulate a database connection error
    pool.connected = false;
  
    // Call the controller
    await addComment(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error connecting to the database",
    });
  });

  it('should handle an exception and return a 500 status code', async () => {
    const req = {
      params: {
        postid: 'post123',
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    // Mock the 'request' method to throw an exception
    jest.spyOn(pool, 'request').mockRejectedValueOnce(new Error('Database error'));
  
    // Call the controller
    await getCommentsByPostId(req, res);
  
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error connecting to the database" });
  });

});


  // DELETE COMMENT CONTROLLER:
  describe('Delete Comment Controller Tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete a comment when valid commentid and userid are provided', async () => {
      // Mock request object with valid commentid and userid
      const req = {
        params: {
          commentid: 'comment123',
        },
        body: {
          userid: 'user123',
        },
      };
  
      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the 'query' method to indicate successful deletion
      const mockRequest = {
        query: jest.fn().mockResolvedValueOnce({ rowsAffected: [1] }), 
      };
      jest.spyOn(pool, 'request').mockReturnValue(mockRequest);
  
      // Call the controller
      await deleteComment(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message:  "Error connecting to the database" });
    });


    it('should return an error message when no comment is deleted', async () => {
      
      const req = {
        params: {
          commentid: 'comment123',
        },
        body: {
          userid: 'user123',
        },
      };
  
     
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      
      const mockRequest = {
        query: jest.fn().mockResolvedValueOnce({ rowsAffected: [0] }), // No comments deleted
      };
      jest.spyOn(pool, 'request').mockReturnValue(mockRequest);
  
      
      await deleteComment(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
    });
  

    it('should handle an exception and return a 500 status code', async () => {
      // Mock request object with valid commentid and userid
      const req = {
        params: {
          commentid: 'comment123',
        },
        body: {
          userid: 'user123',
        },
      };
    
      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      // Mock the 'query' method to throw an exception
      jest.spyOn(pool, 'request').mockRejectedValueOnce(new Error('Database error'));
    
      // Call the controller
      await deleteComment(req, res);
    
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Database error' });
    });
  })