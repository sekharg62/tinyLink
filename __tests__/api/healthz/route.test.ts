import { GET } from "@/app/healthz/route";

describe("/healthz", () => {
  describe("GET", () => {
    it("should return 200 status", async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });

    it("should return ok: true", async () => {
      const response = await GET();
      const data = await response.json();
      expect(data.ok).toBe(true);
    });

    it("should return version", async () => {
      const response = await GET();
      const data = await response.json();
      expect(data.version).toBe("1.0");
    });

    it("should have proper response structure", async () => {
      const response = await GET();
      const data = await response.json();
      expect(data).toHaveProperty("ok");
      expect(data).toHaveProperty("version");
    });
  });
});
