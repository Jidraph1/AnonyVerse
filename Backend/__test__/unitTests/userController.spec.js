import { registerUser, loginUser } from "../../Controllers/usersController";
import bcrypt from 'bcrypt'
import { jwt } from "jsonwebtoken";
import {mssql} from 'mssql';
import { sqlConfig } from "../../Config/config.js";
import {pool} from "../../Config/config";

jest.mock('mssql');
jest.mock('../../Config/config.js');

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

  
    describe("Login User Test", () => {
      it("should successfully log in a user with valid credentials", async () => {
        // Mock request object with valid credentials
        const req = {
          body: {
            email: "test@example.com",
            password: "validPassword",
          },
        };
    
        // Mock response object
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Mock bcrypt.compare to always return true (valid password)
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    
        // Execute the login function
        await loginUser(req, res);
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Login success",
          token: expect.any(String), // Assuming you generate a token
          user: { id: expect.any(Number) }, // Assuming user ID is a number
        });
      });
    
      // You can add more test cases for other scenarios here...
    });it("should successfully log in a user with valid credentials", async () => {
      // Mock request object with valid credentials
      const req = {
        body: {
          email: "test@example.com",
          password: "validPassword",
        },
      };
  
      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the connected property of the pool object
      pool.connected = true; // Set it to true for a successful connection
  
      // Mock bcrypt.compare to always return true (valid password)
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
  
      // Execute the login function
      await loginUser(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login success",
        token: expect.any(String), // Assuming you generate a token
        user: { id: expect.any(Number) }, // Assuming user ID is a number
      });
    });
  
    // You can add more test cases for other scenarios here...
  });