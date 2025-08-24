import { describe, it, expect } from "vitest";
import {
  template,
  interpolate,
  padStart,
  padEnd,
  padBoth,
  truncate,
  wordWrap,
  escapeHtml,
  unescapeHtml,
  escapeRegExp,
  formatNumber,
  createTable,
  formatBytes,
} from "./formatting";

describe("formatting utilities", () => {
  describe("template", () => {
    it("should replace placeholders with values", () => {
      const result = template("Hello {{name}}, you are {{age}} years old", {
        name: "John",
        age: 25,
      });
      expect(result).toBe("Hello John, you are 25 years old");
    });

    it("should leave placeholder unchanged if value is missing", () => {
      const result = template("Hello {{name}}, you are {{age}} years old", {
        name: "John",
      });
      expect(result).toBe("Hello John, you are {{age}} years old");
    });

    it("should handle null and undefined values", () => {
      const result = template("Value: {{value}}, Null: {{nullValue}}", {
        value: "test",
        nullValue: null,
      });
      expect(result).toBe("Value: test, Null: {{nullValue}}");
    });

    it("should use custom placeholder pattern", () => {
      const result = template(
        "Hello ${name}!",
        { name: "World" },
        {
          placeholder: /\$\{(\w+)\}/g,
        }
      );
      expect(result).toBe("Hello World!");
    });

    it("should escape HTML when escape option is true", () => {
      const result = template(
        "Message: {{msg}}",
        { msg: "<script>alert()</script>" },
        {
          escape: true,
        }
      );
      expect(result).toBe("Message: &lt;script&gt;alert()&lt;&#x2F;script&gt;");
    });
  });

  describe("interpolate", () => {
    it("should interpolate simple variables", () => {
      const result = interpolate("Hello ${name}!", { name: "World" });
      expect(result).toBe("Hello World!");
    });

    it("should interpolate nested properties", () => {
      const result = interpolate("User: ${user.name}, Age: ${user.age}", {
        user: { name: "John", age: 30 },
      });
      expect(result).toBe("User: John, Age: 30");
    });

    it("should leave expression unchanged if property not found", () => {
      const result = interpolate("Hello ${missing}!", { name: "World" });
      expect(result).toBe("Hello ${missing}!");
    });

    it("should handle deeply nested properties", () => {
      const result = interpolate("Value: ${a.b.c}", {
        a: { b: { c: "deep" } },
      });
      expect(result).toBe("Value: deep");
    });

    it("should handle invalid expressions gracefully", () => {
      const result = interpolate("Value: ${a.b.c}", { a: null });
      expect(result).toBe("Value: ${a.b.c}");
    });
  });

  describe("padStart", () => {
    it("should pad string at start with spaces by default", () => {
      expect(padStart("hello", 10)).toBe("     hello");
    });

    it("should pad with custom fill string", () => {
      expect(padStart("123", 6, "0")).toBe("000123");
    });

    it("should handle multi-character fill string", () => {
      expect(padStart("test", 10, "ab")).toBe("abababtest");
    });

    it("should return original string if already at target length", () => {
      expect(padStart("hello", 5)).toBe("hello");
    });

    it("should return original string if longer than target", () => {
      expect(padStart("hello world", 5)).toBe("hello world");
    });
  });

  describe("padEnd", () => {
    it("should pad string at end with spaces by default", () => {
      expect(padEnd("hello", 10)).toBe("hello     ");
    });

    it("should pad with custom fill string", () => {
      expect(padEnd("123", 6, "0")).toBe("123000");
    });

    it("should handle multi-character fill string", () => {
      expect(padEnd("test", 10, "ab")).toBe("testababab");
    });
  });

  describe("padBoth", () => {
    it("should pad string on both sides with spaces", () => {
      expect(padBoth("hi", 6)).toBe("  hi  ");
    });

    it("should pad with custom fill string", () => {
      expect(padBoth("test", 8, "*")).toBe("**test**");
    });

    it("should handle odd padding", () => {
      expect(padBoth("hi", 7)).toBe("  hi   ");
    });

    it("should handle multi-character fill string", () => {
      expect(padBoth("x", 7, "ab")).toBe("abaxaba");
    });
  });

  describe("truncate", () => {
    it("should truncate string to specified length", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
    });

    it("should return original string if shorter than limit", () => {
      expect(truncate("Short", 10)).toBe("Short");
    });

    it("should use custom omission string", () => {
      expect(truncate("Hello World", 8, { omission: "***" })).toBe("Hello***");
    });

    it("should truncate at separator when provided", () => {
      expect(truncate("Hello World Test", 10, { separator: /\s/ })).toBe(
        "Hello..."
      );
    });

    it("should handle omission longer than length", () => {
      expect(truncate("Hello", 3, { omission: "...." })).toBe("....");
    });
  });

  describe("wordWrap", () => {
    it("should wrap text at specified width", () => {
      const result = wordWrap("The quick brown fox jumps", 10);
      expect(result).toBe("The quick\nbrown fox\njumps");
    });

    it("should handle long words without breaking by default", () => {
      const result = wordWrap("Supercalifragilisticexpialidocious word", 10);
      expect(result).toBe("Supercalifragilisticexpialidocious\nword");
    });

    it("should break long words when breakLongWords is true", () => {
      const result = wordWrap("Supercalifragilisticexpialidocious", 10, {
        break: true,
      });
      expect(result).toBe("Supercalif\nragilistic\nexpialidoc\nious");
    });

    it("should handle empty string", () => {
      expect(wordWrap("", 10)).toBe("");
    });

    it("should cut words when cut option is true", () => {
      const result = wordWrap("Verylongwordhere", 5, { cut: true });
      expect(result).toBe("Veryl\nongwo\nrdher\ne");
    });
  });

  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      const input = '<div>Hello & "World"</div>';
      const expected =
        "&lt;div&gt;Hello &amp; &quot;World&quot;&lt;&#x2F;div&gt;";
      expect(escapeHtml(input)).toBe(expected);
    });

    it("should escape single quotes", () => {
      expect(escapeHtml("It's working")).toBe("It&#x27;s working");
    });

    it("should handle empty string", () => {
      expect(escapeHtml("")).toBe("");
    });
  });

  describe("unescapeHtml", () => {
    it("should unescape HTML entities", () => {
      const input = "&lt;div&gt;Hello &amp; &quot;World&quot;&lt;&#x2F;div&gt;";
      const expected = '<div>Hello & "World"</div>';
      expect(unescapeHtml(input)).toBe(expected);
    });

    it("should unescape single quotes", () => {
      expect(unescapeHtml("It&#x27;s working")).toBe("It's working");
      expect(unescapeHtml("It&#39;s working")).toBe("It's working");
    });

    it("should handle empty string", () => {
      expect(unescapeHtml("")).toBe("");
    });
  });

  describe("escapeRegExp", () => {
    it("should escape regex special characters", () => {
      const input = ".*+?^${}()|[]\\";
      const expected = "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\";
      expect(escapeRegExp(input)).toBe(expected);
    });

    it("should handle normal strings", () => {
      expect(escapeRegExp("hello world")).toBe("hello world");
    });
  });

  describe("formatNumber", () => {
    it("should format number with default options", () => {
      expect(formatNumber(1234.567)).toBe("1,234.57");
    });

    it("should format with custom decimals", () => {
      expect(formatNumber(1234.567, { decimals: 1 })).toBe("1,234.6");
    });

    it("should format with custom separators", () => {
      expect(
        formatNumber(1234.567, {
          decimalSeparator: ",",
          thousandsSeparator: ".",
        })
      ).toBe("1.234,57");
    });

    it("should handle large numbers", () => {
      expect(formatNumber(1234567.89)).toBe("1,234,567.89");
    });

    it("should handle zero decimals", () => {
      expect(formatNumber(1234.567, { decimals: 0 })).toBe("1,235");
    });
  });

  describe("createTable", () => {
    it("should create ASCII table from data", () => {
      const data = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      const result = createTable(data);
      const lines = result.split("\n");

      expect(lines).toHaveLength(6);
      expect(lines[0]).toBe("+------+-----+");
      expect(lines[1]).toBe("| name | age |");
      expect(lines[2]).toBe("+------+-----+");
      expect(lines[3]).toBe("| John | 30  |");
      expect(lines[4]).toBe("| Jane | 25  |");
      expect(lines[5]).toBe("+------+-----+");
    });

    it("should handle custom headers", () => {
      const data = [{ name: "John", age: 30, city: "NYC" }];
      const result = createTable(data, { headers: ["name", "city"] });

      expect(result).toContain("name");
      expect(result).toContain("city");
      expect(result).not.toContain("age");
    });

    it("should handle custom padding", () => {
      const data = [{ a: "1", b: "2" }];
      const result = createTable(data, { padding: 2 });

      expect(result).toContain("|  a  |  b  |");
    });

    it("should handle empty data", () => {
      expect(createTable([])).toBe("");
    });

    it("should handle missing values", () => {
      const data = [
        { name: "John", age: 30 },
        { name: "Jane" }, // missing age
      ];

      const result = createTable(data);
      expect(result).toContain("| Jane |     |");
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1073741824)).toBe("1 GB");
    });

    it("should handle decimal places", () => {
      expect(formatBytes(1536, 1)).toBe("1.5 KB");
      expect(formatBytes(1536, 0)).toBe("2 KB");
    });

    it("should handle large numbers", () => {
      expect(formatBytes(1024 ** 4)).toBe("1 TB");
      expect(formatBytes(1024 ** 5)).toBe("1 PB");
    });

    it("should handle fractional bytes", () => {
      expect(formatBytes(512)).toBe("512 Bytes");
      expect(formatBytes(1536)).toBe("1.5 KB");
    });
  });
});
