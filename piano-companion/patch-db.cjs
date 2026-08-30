const fs = require('fs');
const file = 'src/lib/db/db.ts';
let content = fs.readFileSync(file, 'utf8');

// Update db initialization logic to bulkPut books array instead of single object
content = content.replace(
  `import { SEED_BOOK, SEED_LESSONS } from './seedData';`,
  `import { SEED_BOOKS, SEED_LESSONS } from './seedData';`
);

content = content.replace(
  `await db.books.put(SEED_BOOK);`,
  `await db.books.bulkPut(SEED_BOOKS);`
);

// We should also clear and reload lessons if they don't match the new counts (simple migration approach for this test environment)
content = content.replace(
  /const bookCount = await db.books.count\(\);[\s\S]*?}\n}/,
  `const bookCount = await db.books.count();
  if (bookCount < 2) {
    await db.books.bulkPut(SEED_BOOKS);
  }

  // Since we added so many tracks, force seed injection if lesson count is low
  const lessonCount = await db.lessons.count();
  if (lessonCount < 100) {
      await db.lessons.clear();
      await db.lessons.bulkPut(SEED_LESSONS);
  }
}`
);

fs.writeFileSync(file, content);
console.log('db.ts updated');
