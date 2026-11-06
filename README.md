# Doc Reader Guide

A comprehensive educational platform designed to help medical students study effectively.

## Features

- **Interactive Quizzes**: Test your knowledge with MCQ and Written quizzes, complete with detailed results analytics, progress tracking, and visualization (Pie Charts).
- **Lecture Management**: Watch lectures with our advanced video player (Vidstack) featuring timestamp support. Seamlessly transfer notes and quiz results between lectures.
- **Structured Content**: Navigate through a hierarchical content system: Faculty -> Year -> Module -> Subject.
- **Admin Dashboard**: comprehensive tools for managing students, including secure signup and data management.
- **Android App Integration**: Dedicated routes for app downloads and deep linking.
- **User Accounts**: Secure authentication and profile management.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, heroicons, Health icons, FontAwesome
- **Authentication**: Firebase, JWT
- **State & Storage**: SWR, IndexedDB (idb)
- **Editor**: Lexical
- **Video**: Vidstack

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yosefbeder/doc-reader-guide.git
    ```
2.  Install dependencies:
    ```bash
    yarn install
    ```

### Environment Variables

Create a `.env` file in the root directory and configure your environment variables.

| Variable                           | Description                                                                         |
| :--------------------------------- | :---------------------------------------------------------------------------------- |
| `PORT`                             | The port the application runs on.                                                   |
| `NEXT_PUBLIC_API_URL`              | The URL of the backend API.                                                         |
| `NEXT_PUBLIC_JWT`                  | The guest JWT for non authenticated users and data collection at build time.        |
| `NEXT_PUBLIC_FRONTEND_URL`         | The URL of the frontend application (used for structured data and canonical links). |
| `NEXT_PUBLIC_VAPID_KEY`            | Public VAPID key for Firebase Cloud Messaging (Push Notifications).                 |
| `NEXT_PUBLIC_STATIC_URL`           | URL for serving static assets.                                                      |
| `NEXT_PUBLIC_OPTIONS_LIMIT`        | Limit for the number of options, sub questions, and url links.                      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`     | Google OAuth Client ID for authentication.                                          |
| `NEXT_PUBLIC_ANDROID_RELEASE_DATA` | URL/Data source for the latest Android app release.                                 |

### Running the App

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Clean up unused images

`scripts/cleanup-unused-images.cjs` checks the backend PostgreSQL tables directly, including MCQ images, written images, question/answer rich text, lecture notes and lecture attachments. It supports both R2 and the backend's `public/image` folder. The database is accessed in read-only mode. It does not delete database records.

Set `DATABASE_URL` to the same database used by the backend. The script loads the working directory's `.env`; environment variables supplied by the shell or Node's `--env-file` take precedence. For R2 it uses `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `NEXT_PUBLIC_R2_URL` and optionally `S3_BUCKET` (default `drg`). Local cleanup requires `NEXT_PUBLIC_STATIC_URL` and filesystem access to the backend image folder. Run local cleanup on the server that stores those files.

Start with a dry-run:

```sh
yarn cleanup:images --r2 --dry-run --report /tmp/unused-images.json
```

R2 scans the app-owned `question-images/` prefix by default. To include every supported image key in the bucket, add `--r2-prefix ''`. Non-image files are left alone. To scan the backend's image folder as well, add `--images-dir /path/to/backend/public/image` (or use that option alone to clean only local files). Symlinks are skipped.

Review the listed candidates and JSON report, then replace `--dry-run` with `--delete` to remove them. The two flags cannot be combined; dry-run also remains the default when neither is provided. Images modified within the last 24 hours are skipped to protect pending imports. Override with `--min-age-hours N` when appropriate; `0` includes recent images. Before deleting, the script rereads references and checks each candidate's metadata; changed or newly referenced files are skipped. Pause imports and edits during deletion because the database and storage do not share a transaction. R2 credentials need list/read access for dry-run and delete access for `--delete`.

```sh
# After reviewing the dry-run, delete unreferenced images in the selected scope.
yarn cleanup:images --r2 --report /tmp/unused-images.json --delete

# Inspect all available options.
yarn cleanup:images --help

# Run cleanup regression tests without connecting to production.
node --test scripts/test-cleanup-unused-images.cjs
```

## Project Structure

- `app/(auth)`: Authentication related routes and components.
- `app/(content)`: Main application content including Quizzes, Lectures, and Subjects.
- `app/(landing-page)`: Public facing landing page.
- `app/api/revalidate`: Single route for pages revalidation.

© 2026 Yosef Beder. All Rights Reserved.
