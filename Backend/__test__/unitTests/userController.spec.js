import {
  registerUser,
  loginUser,
  getProfile,
} from "../../Controllers/usersController.js";
import bcrypt from "bcrypt";

import { jwt } from "jsonwebtoken";
import { mssql } from "mssql";
import { sqlConfig } from "../../Config/config.js";
import { pool } from "../../Config/config.js";

jest.mock("mssql");
jest.mock("../../Config/config.js", () => ({
  pool: {
    request: jest.fn().mockReturnThis(),
  },
}));

jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

describe("Register User Test", () => {
  it("should fail when the request body is empty", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Object)])
    );
  });

  it("should throw an error if the email is already in use", async () => {
    const req = {
      body: {
        username: "tesnewt",
        email: "testest@gmail.com",
        password: "Test1234",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the entire mssql module to control the behavior of mssql.connect
    jest.mock("mssql", () => ({
      connect: jest.fn().mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({
          rowsAffected: [0], // Simulate zero rows affected (email already in use)
        }),
      }),
    }));

    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    // Add expectations for the error response body
  });
  it("should throw an error if the username is already in use", async () => {
    const req = {
      body: {
        username: "existingUser", // Use a username that is already registered
        email: "newuser@example.com",
        password: "Test1234",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock database connection and execution to simulate a username already in use
    jest.mock("mssql", () => ({
      connect: jest.fn().mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({
          rowsAffected: [0], // Simulate zero rows affected (username already in use)
        }),
      }),
    }));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    // Add expectations for the error response body
  });
});

describe("Login User Test", () => {
  it("should fail when the request body is empty", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Object)])
    );
  });

  // it('should return "Login success" when the password is correct', async () => {
  //   // Mock request object with valid credentials and correct password
  //   const req = {
  //     body: {
  //       email: 'test@example.com',
  //       password: 'correctPassword',
  //     },
  //   };

  //   // Mock response object
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   // Mock database query to return a user record
  //   const mockUserRecord = {
  //     rowsAffected: [1],
  //     recordset: [
  //       {
  //         username: 'testUser',
  //         password: 'hashedPassword', // Mock hashed password
  //         email: 'test@example.com',
  //         userid: 1,
  //       },
  //     ],
  //   };
  //   jest.spyOn(pool, 'request').mockResolvedValue(mockUserRecord);

  //   // Mock bcrypt.compare to return true (correct password)
  //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

  //   // Execute the login function
  //   await loginUser(req, res);

  //   // Assertions
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({ message: 'Login success', /* ...other assertions... */ });
  // })
});

describe("GetProfile Controller Test", () => {
  it("should fail if profile is not found", async () => {
    const req = {
      params: { userid: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock database queries for the first test case
    const mockRequest = jest.fn();
    const mockExecute = jest.fn();
    pool.request.mockReturnValueOnce({
      input: mockRequest,
      execute: mockExecute,
    });
    mockRequest.mockReturnValueOnce({ input: mockRequest });
    mockRequest.mockResolvedValueOnce({ execute: mockExecute });
    mockExecute.mockResolvedValueOnce({
      recordset: [
        {
          /* Mock user profile data */
        },
      ],
    });

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should handle a database connection error", async () => {
    const req = {
      params: { userid: 3 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock database queries for the third test case
    const mockRequest = jest.fn();
    pool.request.mockReturnValueOnce({ input: mockRequest });
    mockRequest.mockRejectedValueOnce(new Error("Database connection error"));

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error connecting to the database" });
  });
});
