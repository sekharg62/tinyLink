import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/links/route";
import sql from "@/lib/db";

// Mock the database
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockSql = sql as jest.MockedFunction<typeof sql>;

describe("/api/links", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should create a new link with generated code", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ url: "https://example.com" }),
      } as unknown as NextRequest;

      const mockLink = {
        id: 1,
        code: "ABC123",
        url: "https://example.com",
        created_at: "2025-11-21T11:40:42.481Z",
        clicks: 0,
        last_clicked_at: null,
      };

      mockSql.mockResolvedValueOnce([]); // No existing code
      mockSql.mockResolvedValueOnce([mockLink]);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockLink);
    });

    it("should create a new link with provided code", async () => {
      const mockRequest = {
        json: jest
          .fn()
          .mockResolvedValue({ url: "https://example.com", code: "CUSTOM" }),
      } as unknown as NextRequest;

      const mockLink = {
        id: 1,
        code: "CUSTOM",
        url: "https://example.com",
        created_at: "2025-11-21T11:40:42.615Z",
        clicks: 0,
        last_clicked_at: null,
      };

      mockSql.mockResolvedValueOnce([]); // No existing code
      mockSql.mockResolvedValueOnce([mockLink]);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockLink);
    });

    it("should return 400 for invalid URL", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ url: "invalid" }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid URL");
    });

    it("should return 409 for existing code", async () => {
      const mockRequest = {
        json: jest
          .fn()
          .mockResolvedValue({ url: "https://example.com", code: "EXISTS1" }),
      } as unknown as NextRequest;

      mockSql.mockResolvedValueOnce([{ id: 1 }]); // Existing code

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("Code already exists");
    });

    it("should return 400 for invalid code length", async () => {
      const mockRequest = {
        json: jest
          .fn()
          .mockResolvedValue({ url: "https://example.com", code: "AB" }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Code must be 6-8 alphanumeric characters");
    });
  });

  describe("GET", () => {
    it("should return list of links", async () => {
      const mockLinks = [
        {
          id: 1,
          code: "ABC123",
          url: "https://example.com",
          created_at: "2025-11-21T11:40:42.647Z",
          clicks: 0,
          last_clicked_at: null,
        },
      ];

      mockSql.mockResolvedValueOnce(mockLinks);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLinks);
    });
  });
});
