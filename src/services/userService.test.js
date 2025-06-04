const { createUser } = require("./userService");
const db = require("../database");
const { hashPassword } = require("../utils/security");
const { validateUserInput } = require("../utils/validation");

jest.mock("../database");
jest.mock("../utils/security");
jest.mock("../utils/validation");

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    const mockUserData = {
      username: "testuser",
      password: "password123",
      email: "testuser@example.com"
    };

    const mockHashedPassword = "hashedpassword123";
    const mockCreatedUser = {
      id: 1,
      username: "testuser",
      email: "testuser@example.com",
      createdAt: new Date()
    };

    validateUserInput.mockReturnValue([]);
    hashPassword.mockResolvedValue(mockHashedPassword);
    db.users.create.mockResolvedValue({
      ...mockCreatedUser,
      password: mockHashedPassword
    });

    const result = await createUser(mockUserData);

    expect(validateUserInput).toHaveBeenCalledWith(mockUserData);
    expect(hashPassword).toHaveBeenCalledWith(mockUserData.password);
    expect(db.users.create).toHaveBeenCalledWith({
      username: mockUserData.username,
      email: mockUserData.email,
      password: mockHashedPassword,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
    expect(result).toEqual({
      id: mockCreatedUser.id,
      username: mockCreatedUser.username,
      email: mockCreatedUser.email,
      createdAt: mockCreatedUser.createdAt
    });
  });

  it("should throw an error if validation fails", async () => {
    const mockUserData = {
      username: "",
      password: "password123",
      email: "invalidemail"
    };

    const mockValidationErrors = ["Username is required", "Email is invalid"];

    validateUserInput.mockReturnValue(mockValidationErrors);

    await expect(createUser(mockUserData)).rejects.toThrow(
      `Validation failed: ${mockValidationErrors.join(", ")}`
    );

    expect(validateUserInput).toHaveBeenCalledWith(mockUserData);
    expect(hashPassword).not.toHaveBeenCalled();
    expect(db.users.create).not.toHaveBeenCalled();
  });

  it("should throw an error if database operation fails", async () => {
    const mockUserData = {
      username: "testuser",
      password: "password123",
      email: "testuser@example.com"
    };

    const mockHashedPassword = "hashedpassword123";

    validateUserInput.mockReturnValue([]);
    hashPassword.mockResolvedValue(mockHashedPassword);
    db.users.create.mockRejectedValue(new Error("Database error"));

    await expect(createUser(mockUserData)).rejects.toThrow(
      "Failed to create user. Please try again later."
    );

    expect(validateUserInput).toHaveBeenCalledWith(mockUserData);
    expect(hashPassword).toHaveBeenCalledWith(mockUserData.password);
    expect(db.users.create).toHaveBeenCalledWith({
      username: mockUserData.username,
      email: mockUserData.email,
      password: mockHashedPassword,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });
});