# Sananmuunnoksia Kettulan vintiltä
Tämä on tasavallan virallinen [sananmuunnoskaanon](https://sto.iki.fi/sananmuunnoksia/), jonka suojelijana toimii Kuhanleikkaaja-Lilli. Vaihtoehtoisen käyttöliittymän korpukseen tarjoaa [satunnainen poiminta](https://sto.iki.fi/sananmuunnoksia/satunnainen/).

## Kaanon.js

Kaanon.js on JavaScript-moduuli, joka tarjoaa iterointi- ja muunnosfunktioita sananmuunnoskaanonin käyttäjille.

### Asennus

```bash
npm install kaanon.js
```

### Käyttö

Moduuli tarjoaa kolme pääfunktiota:
1. `getIterator(categories?, mapper?)`: Luo iteraattorin kaanonin sanoille
   - `categories`: Valinnainen lista kategorioita joiden mukaan suodatetaan
   - `mapper`: Valinnainen muunnosfunktio arvoille
   - Palauttaa iteraattorin jolla on metodit `next()`, `take(count)` ja `isDone()`

2. `getEmailAddresses(server?)`: Luo sähköpostiosoitteita "nimi"-kategorian sanoista
   - `server`: Valinnainen sähköpostipalvelimen domain (oletus: "example.com")
   - Muuntaa skandinaaviset merkit ja välilyönnit automaattisesti

3. `getNames()`: Luo muotoiltuja nimiä "nimi"-kategorian sanoista
   - Palauttaa nimet oikeassa kirjainkoossa (isot alkukirjaimet)
   - Palauttaa "Anonymous User" kun iteraattori on tyhjentynyt

#### Esimerkkejä

```javascript
import { getIterator, getEmailAddresses, getNames } from 'kaanon.js';

// Get all items
const iterator = getIterator();

// Get next item
const item = iterator.next();

// Get items from specific category
const categoryIterator = getIterator(['ruokalista']);
const menuItems = categoryIterator.take(3);

// Transform items with a mapper
const upperIterator = getIterator([], x => x ? x.toUpperCase() : 'NONE');
const upperItem = upperIterator.next(); // Returns item in uppercase

// Generate email addresses
const emailIterator = getEmailAddresses('company.com');
const emails = emailIterator.take(2); // ['matti.meikalainen@company.com', 'maija.mallikas@company.com']

// Get formatted names
const nameIterator = getNames();
while (!nameIterator.isDone()) {
    const name = nameIterator.next(); // Returns properly capitalized name
}

// Check if iterator is exhausted
const iterator = getIterator();
while (!iterator.isDone()) {
    const item = iterator.next();
    // Process item...
}
```
