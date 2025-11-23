import { NextRequest } from "next/server";
import { GET } from "@/app/[code]/route";
import sql from "@/lib/db";

// Mock the database
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockSql = sql as jest.MockedFunction<typeof sql>;

describe("/[code] redirect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 404 for invalid code format", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "AB" }; // Too short

      const response = await GET(mockRequest, { params });

      expect(response.status).toBe(404);
    });

    it("should return 404 for code with invalid characters", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC@#$" }; // Invalid characters

      const response = await GET(mockRequest, { params });

      expect(response.status).toBe(404);
    });

    it("should return 404 for non-existent code", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABCDEF" };

      mockSql.mockResolvedValueOnce([]); // No link found

      const response = await GET(mockRequest, { params });

      expect(response.status).toBe(404);
    });

    it("should redirect to original URL with 302 status", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      const mockLink = {
        id: 1,
        url: "https://example.com",
      };

      mockSql
        .mockResolvedValueOnce([mockLink]) // SELECT query
        .mockResolvedValueOnce([]); // UPDATE query

      const response = await GET(mockRequest, { params });

      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toContain("example.com");
    });

    it("should increment click count", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      const mockLink = {
        id: 1,
        url: "https://example.com",
      };

      mockSql
        .mockResolvedValueOnce([mockLink]) // SELECT query
        .mockResolvedValueOnce([]); // UPDATE query

      await GET(mockRequest, { params });

      // Check that UPDATE was called
      expect(mockSql).toHaveBeenCalledTimes(2);
    });

    it("should update last_clicked_at", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      const mockLink = {
        id: 1,
        url: "https://example.com",
      };

      mockSql
        .mockResolvedValueOnce([mockLink]) // SELECT query
        .mockResolvedValueOnce([]); // UPDATE query

      await GET(mockRequest, { params });

      // Verify UPDATE was called with the correct ID
      expect(mockSql).toHaveBeenCalledTimes(2);
    });

    it("should handle database errors gracefully", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      mockSql.mockRejectedValueOnce(new Error("Database error"));

      const response = await GET(mockRequest, { params });

      expect(response.status).toBe(500);
    });
  });
});
