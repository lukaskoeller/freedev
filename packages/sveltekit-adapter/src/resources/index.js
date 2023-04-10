

const serverPath = process.env.SERVER_PATH;
const projectPath = process.env.PROJECT_PATH;
const staticPath = process.env.STATIC_PATH;
const prerenderedPath = process.env.PRERENDERED_PATH;
const memorySize = parseInt(process.env.MEMORY_SIZE) || 128;
const [_, zoneName, ...MLDs] = process.env.FQDN?.split('.') || [];
const domainName = [zoneName, ...MLDs].join('.');
const routes = process.env.ROUTES?.split(',') || [];
const serverHeaders = process.env.SERVER_HEADERS?.split(',') || [];
const staticHeaders = process.env.STATIC_HEADERS?.split(',') || [];