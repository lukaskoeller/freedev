import * as fs from "fs";

/**
 * crawlDirectory recursive crawls the provided directory, applying the provided function to every file it contains. Doesn't handle cycles from symlinks.
 * @param dir Directory to crawl through
 * @param f Function to execute for each file crawled
 */
export function crawlDirectory(dir: string, f: (_: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
      const filePath = `${dir}/${file}`;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
          crawlDirectory(filePath, f);
      }
      if (stat.isFile()) {
          f(filePath);
      }
  }
}

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
export function getDomainAndSubdomain(domain: string): { subdomain: string, parentDomain: string } {
    const parts = domain.split(".");
    if (parts.length < 2) {
        throw new Error(`No TLD found on ${domain}`);
    }
    // No subdomain, e.g. awesome-website.com.
    if (parts.length === 2) {
        return { subdomain: "", parentDomain: domain };
    }

    const subdomain = parts[0];
    parts.shift();  // Drop first element.
    return {
        subdomain,
        // Trailing "." to canonicalize domain.
        parentDomain: parts.join(".") + ".",
    };
}