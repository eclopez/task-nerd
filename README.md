# Task Nerd by Erik Lopez

## Setup

1. Clone the repository
2. Install the dependencies, by running:

```bash
npm install
```

3. Make a copy of the `.env.example` file and rename it to `.env`. Update the `DATABASE_URL` with your url.
4. Initialize the database, by running:

```bash
npm run db:init
```

4. Seed the databse with example data, by running:

```bash
npm run db:seed
```

5. Start the server, by running:

```bash
npm run dev
```

6. If needed, reset the database and re-seed it, by running:

```bash
npm run db:reset
```

## Architectural thoughts

### Data

The data model is simple. There are two tables: `Priority` and `Task`.

I chose to store the `Priority` values in the database rather than set it on the frontend to preserve referential integrity and allow for renaming and adding more in the future. Besides `name`, I also included a `value` for each priority which allows for ordering by severity and add more finely-grained priority levels in the future.

The `Task` table includes the fields `title`, `description`, `createdAt`, `updatedAt`, `completedAt`, and `priorityId` which links a task to a priority. `createdAt` and `updatedAt` are maintained in the database but are not surfaced on the frontend, this is something that can be added in the future to provide another way to sort and filter the task data. Additionally, `completedAt` serves as the field of record for whether or not the task has been completed, as it will be `null` if it has not yet been completed. This allows us the context of when it was completed for sorting and filtering, without the added overhead of a specific boolean field.

### Application

I'm using Next.js 15, React 19, Material UI, Tailwind CSS, and Prisma to construct the application. I'm using the `App Router` feature of Next.js and chose to organize it so that only `Page` and `Layout` components reside in the `src/app/` folder, as I think this makes it cleaner and easier to reason about the structure of the site.

Server Actions, React Components, React Hooks, and styles all reside in their own folders inside `src/`. Prisma-specific code resides outside of the `src/` folder.

I chose to implement hooks as the interface that the components interact with to use server actions so that I could keep my components as lean as possible, and so that I could create a custom hook to serve the individual needs of each component.

### Improvements

As far as improvements that can be made, more testing can be added, including for the actions and the hooks which would require effective mocking of Prisma. Additionally, after adding or editing a task and navigating back to the task list, a cache could be implemented so that the task list serves up stale data while the new data is fetched, making the page seem more responsive, instead of the current behavior of the entire list loading again.
