import { NextRequest } from "next/server";
import { GET, DELETE, PATCH } from "@/app/api/links/[code]/route";
import sql from "@/lib/db";

// Mock the database
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockSql = sql as jest.MockedFunction<typeof sql>;

describe("/api/links/[code]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return link data for valid code", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      const mockLink = {
        id: 1,
        code: "ABC123",
        url: "https://example.com",
        created_at: "2025-11-21T11:40:42.481Z",
        clicks: 0,
        last_clicked_at: null,
      };

      mockSql.mockResolvedValueOnce([mockLink]);

      const response = await GET(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLink);
    });

    it("should return 404 for non-existent code", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "NONEXIST" };

      mockSql.mockResolvedValueOnce([]);

      const response = await GET(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Link not found");
    });
  });

  describe("DELETE", () => {
    it("should delete link successfully", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "ABC123" };

      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      const response = await DELETE(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Link deleted successfully");
    });

    it("should return 404 for non-existent code", async () => {
      const mockRequest = {} as NextRequest;
      const params = { code: "NONEXIST" };

      mockSql.mockResolvedValueOnce([]);

      const response = await DELETE(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Link not found");
    });
  });

  describe("PATCH", () => {
    it("should record click successfully", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ action: "click" }),
      } as unknown as NextRequest;
      const params = { code: "ABC123" };

      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      const response = await PATCH(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Click recorded");
    });

    it("should return 404 for non-existent code", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ action: "click" }),
      } as unknown as NextRequest;
      const params = { code: "NONEXIST" };

      mockSql.mockResolvedValueOnce([]);

      const response = await PATCH(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Link not found");
    });

    it("should return 400 for invalid action", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ action: "invalid" }),
      } as unknown as NextRequest;
      const params = { code: "ABC123" };

      const response = await PATCH(mockRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid action");
    });

    it("should handle database errors gracefully", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ action: "click" }),
      } as unknown as NextRequest;
      const params = { code: "ABC123" };

      mockSql.mockRejectedValueOnce(new Error("Database error"));

      const response = await PATCH(mockRequest, { params });

      expect(response.status).toBe(500);
    });
  });
});
