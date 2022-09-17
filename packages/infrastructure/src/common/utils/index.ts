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