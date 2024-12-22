# Bihar Gallery

Bihar Gallery is a web platform showcasing the rich history, culture, and diversity of Bihar. The platform allows users to explore blogs, images, and videos that highlight the essence of Bihar. Authenticated users can upload their media (audio and video) to contribute to the platform's growing collection. The project is designed to provide a seamless and engaging experience for users, with robust authentication and a responsive design.

## Features

### General Features

- **Explore Bihar's Heritage**: Access blogs, images, and videos highlighting the state's culture and history.
- **Responsive Design**: Fully optimized for devices of all screen sizes.

### User Features

- **User Authentication**: Secure login and registration using JSON Web Tokens (JWT).
- **Media Upload**: Authenticated users can upload audio and video content directly from their devices.
- **Dashboards**:
  - **User Dashboard**: Update user profile and visit profiles of other users with proper authentication.
  - **Admin Dashboard**: Manage users and content.

### Technical Features

- **SEO Optimization**: Implemented React Helmet for metadata and improved Google ranking.
- **Media Storage**: Audio and video files are stored in Google Cloud Storage with signed URLs for secure upload and retrieval.
- **RESTful API**: Axios is used to handle API requests for seamless data integration.

## Tech Stack

### Frontend

- **Framework**: React with TypeScript
- **Styling**: Pure CSS
- **SEO Optimization**: React Helmet

### Backend

- **Framework**: Node.js with Express.js
- **Authentication**: JWT-based authentication

### Database

## Google Cloud Storage for media files

### Deployment

- Fully responsive design, ensuring compatibility across devices.
