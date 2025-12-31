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

## Project Structure

- `app/(auth)`: Authentication related routes and components.
- `app/(content)`: Main application content including Quizzes, Lectures, and Subjects.
- `app/(landing-page)`: Public facing landing page.
- `app/api/revalidate`: Single route for pages revalidation.

© 2025 Yosef Beder. All Rights Reserved.
