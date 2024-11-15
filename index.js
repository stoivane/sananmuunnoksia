import kaanon from "./kaanon.json";

function* kaanonIterator(categories = []) {
    const filtered = Object.entries(kaanon)
        .filter(([, values]) => categories.length === 0 || categories.some((category) => values.includes(category)))
        .map(([key]) => key)
        .sort(() => Math.random() - 0.5);

    while (filtered.length > 0) {
        yield filtered.pop();
    }
    return undefined;
}

export const getIterator = (categories = []) => kaanonIterator(categories);

export const getRandom = (count, categories = []) => {
    const iterator = getIterator(categories);
    const random = [];
    while (random.length < count) {
        const next = iterator.next();
        if (next.done) {
            break;
        }
        random.push(next.value);
    }
    return random;
};

/**
 * Creates fake email addresses from items with "nimi" category
 * @param count Number of email addresses to generate
 * @param server Optional email server domain (defaults to "example.com")
 * @returns Array of email addresses
 */
export const getEmailAddresses = (count = Infinity, server = 'example.com') => {
    const names = getRandom(count, ['nimi']);
    return names.map(name => {
        // Convert scandinavian characters and spaces
        const normalized = name.toLowerCase()
            .replace(/\s+/g, '.')
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/å/g, 'a');
        return `${normalized}@${server}`;
    });
};

/**
 * Gets names from the "nimi" category and formats them as "Frontname Lastname"
 * @param count Number of names to get (default: Infinity)
 * @returns Array of formatted names
 */
export const getNames = (count = Infinity) => {
    const names = getRandom(count, ['nimi']);
    return names.map(name => {
        // Split name into parts and capitalize each part
        return name.split(/\s+/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
    });
};
