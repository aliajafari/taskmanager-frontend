# Task Manager Frontend

A modern task management application built with Next.js, React Query, and TypeScript. This application provides a clean interface for managing projects, tasks, and tags.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Project Management**: View and filter tasks by projects
- **Tag System**: Organize tasks with tags
- **Filtering**: Filter tasks by project, tags, or due date
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Uses React Query for efficient data fetching and caching

## Tech Stack

- **Next.js 16**: React framework with App Router
- **React Query (@tanstack/react-query)**: Data fetching and state management
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form management
- **Axios**: HTTP client

## Folder Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with QueryProvider
│   ├── page.tsx           # Home page (redirects to /tasks)
│   └── tasks/
│       └── page.tsx        # Tasks page
├── components/
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── modal.tsx
│       ├── loading.tsx
│       └── error.tsx
├── features/              # Feature-based structure
│   ├── tasks/
│   │   ├── components/    # Task-specific components
│   │   │   ├── task-card.tsx
│   │   │   ├── task-form.tsx
│   │   │   └── task-filters.tsx
│   │   ├── hooks/         # React Query hooks
│   │   │   └── use-tasks.ts
│   │   └── utils/         # Utility functions
│   │       └── filter-tasks.ts
│   └── projects/
│       └── hooks/
│           └── use-projects.ts
└── lib/
    ├── http/              # HTTP layer
    │   ├── client.ts     # Axios client with token support
    │   └── api/          # API endpoints
    │       ├── tasks.ts
    │       └── projects.ts
    └── query/
        └── providers.tsx # React Query provider
```

## Design Patterns

### Feature-Based Architecture
The project follows a feature-based structure where each feature (tasks, projects) is self-contained with its own components, hooks, and utilities.

### HTTP Layer Abstraction
The HTTP client (`lib/http/client.ts`) provides a centralized way to handle API requests with:
- Automatic token injection from localStorage
- Request/response interceptors
- Error handling

### React Query Hooks
Custom hooks in each feature directory encapsulate data fetching logic:
- `useTasks()`: Fetch all tasks
- `useCreateTask()`: Create a new task
- `useUpdateTask()`: Update an existing task
- `useDeleteTask()`: Delete a task
- `useProjects()`: Fetch all projects

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Backend API running on `http://127.0.0.1:8000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskmanager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically redirect to `/tasks` page.

### Running Tests

To run unit tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm test -- --watch
```

To run tests with coverage:
```bash
npm test -- --coverage
```

## API Configuration

The application expects the backend API to be running on the URL specified in the `NEXT_PUBLIC_API_BASE_URL` environment variable. By default, it uses `http://127.0.0.1:8000` if the environment variable is not set.

To configure the API URL, create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

**Note**: In Next.js, environment variables that need to be accessible in the browser must be prefixed with `NEXT_PUBLIC_`.

### API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/tasks` - List all tasks (sorted by due date)
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Authentication

The HTTP client automatically includes an authentication token from `localStorage` if available. To set a token:

```typescript
import { httpClient } from '@/lib/http/client';
httpClient.setToken('your-token-here');
```

## Usage

### Creating a Task

1. Click the "Create New Task" button
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Project (required)
   - Due Date (optional)
   - Status (todo, in-progress, done)
   - Tags (optional, multiple selection)
3. Click "Create"

### Filtering Tasks

Use the filter panel to filter tasks by:
- **Project**: Select a specific project
- **Tag**: Select a tag to show only tasks with that tag
- **Due Date**: Select a date to show tasks due on that date

You can combine multiple filters. Click "Clear Filters" to reset.

### Editing a Task

1. Click "Edit" on any task card
2. Modify the task details
3. Click "Update"

### Deleting a Task

1. Click "Delete" on any task card
2. Confirm the deletion

## Assumptions

1. **Authentication**: The application assumes authentication tokens are stored in `localStorage` with the key `auth_token`. Some endpoints may not require authentication.

2. **API Response Format**: The application expects standard REST API responses with JSON format.

3. **Task Sorting**: Tasks are automatically sorted by due date (upcoming first) on the backend.

4. **Tags**: Tags are extracted from existing tasks. There's no separate API endpoint for fetching all tags.

5. **Error Handling**: Basic error handling is implemented. Network errors and API errors are displayed to the user.

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## Responsive Design

The application is fully responsive and adapts to different screen sizes:
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column layout

## Future Improvements

- [ ] Add authentication/login page
- [ ] Add tag management (create/edit/delete tags)
- [ ] Add project management (create/edit/delete projects)
- [ ] Add task search functionality
- [ ] Add drag-and-drop for task status updates
- [ ] Add calendar view for tasks
- [ ] Add notifications for overdue tasks
- [ ] Add unit and integration tests

## License

This project is part of a technical assessment.
