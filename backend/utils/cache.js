import NodeCache from "node-cache";

// Create a new cache instance with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

export { cache };
