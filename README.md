# @wxn0brp/db-storage-accdb

A simple ACCDB (Microsoft Access) storage adapter for the **ValtheraDB** database library. It uses the `odbc` package to connect natively to your `.accdb` or `.mdb` files.

## Installation

```bash
npm install @wxn0brp/db-storage-accdb
```

### ODBC Driver Prerequisites

To connect to your database, you must have the **Microsoft Access Database Engine** installed on your system. If you're on Windows, you can quickly install the driver via `winget`:

```bash
winget install Microsoft.AccessDatabaseEngine.2016
```

## Usage

Ensure you have the proper MS Access ODBC driver installed on your machine (`Microsoft Access Driver (*.mdb, *.accdb)`).

```typescript
import { ValtheraClass } from "@wxn0brp/db-core";
import { createAccDBValthera, makeConnect } from "@wxn0brp/db-storage-accdb";

// 1. Establish connection to your Access database
const conn = await makeConnect('path/to/your/database.accdb');

// 2. Wrap it with the Valthera storage adapter
const db = createAccDBValthera(conn);

// 3. Get collection (table) instances
const User = db.c("Users");

// Add entry
await User.add({ name: "John Doe", age: 30 });

// Find entries
const users = await User.find({ name: "John Doe" });
console.log(users);

// Update entry
await User.updateOne({ name: "John Doe" }, { age: 31 });

// Remove entry
await User.remove({ name: "John Doe" });

// Ensure connection is closed after your app finishes
await conn.close();
```

## Why? Idk

**Q: Why did I made this?**  

A: Idk. 

**Q: But seriously, why?**  

A: It started off as a joke. Somehow, it ended up actually working properly. So if you ever find yourself needing to connect to a Microsoft Access 2007 database in a modern web stack (for whatever absurd reason), here you go.

## License

MIT
