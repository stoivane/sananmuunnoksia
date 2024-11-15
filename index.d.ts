// Define the structure of the kaanon.json data
interface KaanonData {
    [key: string]: string[];
}

interface KaanonIterator<T> {
    /** Returns the next item in the iterator, or mapper's default value if exhausted */
    next: () => T;
    /** Takes up to count items from the iterator */
    take: (count: number) => T[];
    /** Returns true if the iterator is exhausted */
    isDone: () => boolean;
}

/**
 * Creates an iterator for items in the kaanon
 * @param categories Optional array of categories to filter by
 * @param mapper Optional function to transform values from the iterator (must handle undefined)
 */
export function getIterator<T = string>(
    categories?: string[], 
    mapper?: (value: string | undefined) => T
): KaanonIterator<T>;

/**
 * Creates an iterator that yields email addresses from items with "nimi" category
 * @param server Optional email server domain (defaults to "example.com")
 */
export function getEmailAddresses(server?: string): KaanonIterator<string>;

/**
 * Creates an iterator that yields properly formatted names from "nimi" category
 */
export function getNames(): KaanonIterator<string>;
  