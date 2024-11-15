// Define the structure of the kaanon.json data
interface KaanonData {
    [key: string]: string[];
}

/**
 * Creates and returns an iterator that yields random items from the kaanon
 * @param categories - Optional array of categories to filter items by
 * @returns A Generator iterator that yields strings
 */
export function getIterator(categories?: string[]): Generator<string, void, unknown>;

/**
 * Returns an array of random items from the kaanon
 * @param count - Number of items to return
 * @param categories - Optional array of categories to filter items by
 * @returns Array of random items
 */
export function getRandom(count: number, categories?: string[]): string[];

/**
 * Creates fake email addresses from items with "nimi" category
 * @param count Number of email addresses to generate (default: Infinity)
 * @param server Optional email server domain (default: "example.com")
 * @returns Array of email addresses in format name@server
 */
export function getEmailAddresses(count?: number, server?: string): string[];

/**
 * Gets names from the "nimi" category and formats them as "Frontname Lastname"
 * @param count Number of names to get (default: Infinity)
 * @returns Array of formatted names
 */
export function getNames(count?: number): string[];
  