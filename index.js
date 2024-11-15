import kaanon from "./kaanon.json";

const filterKaanon = (categories = []) => {
    return Object.entries(kaanon)
        .filter(([, values]) => categories.length === 0 || categories.some((category) => values.includes(category)))
        .map(([key]) => key)
        .sort(() => Math.random() - 0.5);
};

function* kaanonIterator(categories = []) {
    const filtered = filterKaanon(categories);

    while (filtered.length > 0) {
        yield filtered.pop();
    }
    return undefined;
}

/**
 * Creates an iterator for items in the kaanon
 * @param {string[]} [categories=[]] - Optional array of categories to filter items by
 * @param {function(string|undefined): T} [mapper=(x) => x === undefined ? "" : x] - Optional function to transform values.
 *        The mapper must handle undefined input (when iterator is exhausted) and never return undefined.
 * @returns {KaanonIterator<T>} An iterator object with next(), take(), and isDone() methods
 * @template T
 * 
 * @example
 * // Get all items
 * const iterator = getIterator();
 * 
 * @example
 * // Get items from specific category
 * const iterator = getIterator(['category1']);
 * 
 * @example
 * // Transform items with a mapper
 * const iterator = getIterator([], x => x ? x.toUpperCase() : 'default');
 */
export const getIterator = (categories = [], mapper = (x) => x === undefined ? "" : x) => {
    const iterator = kaanonIterator(categories);
    let isDoneFlag = false;

    return {
        next: () => {
            const next = iterator.next();
            isDoneFlag = next.done;
            return mapper(next.done ? undefined : next.value);
        },
        take: (count) => {
            const list = [];
            while (list.length < count) {
                const next = iterator.next();
                if (next.done) {
                    isDoneFlag = true;
                    break;
                }
                list.push(mapper(next.value));
            }
            return list;
        },
        isDone: () => isDoneFlag
    };
};

/**
 * Creates an iterator that yields email addresses from items with "nimi" category
 * @param server Optional email server domain (defaults to "example.com")
 * @returns Iterator of email addresses
 */
export const getEmailAddresses = (server = 'example.com') => {
    const emailMapper = (name) => {
        if (name === undefined) {
            return `anonymous@${server}`;
        }
        const normalized = name.toLowerCase()
            .replace(/\s+/g, '.')
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/å/g, 'a');
        return `${normalized}@${server}`;
    };
    
    return getIterator(['nimi'], emailMapper);
};

/**
 * Creates an iterator that yields properly formatted names from "nimi" category
 * @returns Iterator of formatted names
 */
export const getNames = () => {
    const nameMapper = (name) => {
        if (name === undefined) {
            return 'Anonymous User';
        }
        return name.split(/\s+/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
    };
    
    return getIterator(['nimi'], nameMapper);
};
