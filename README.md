# VDRW: Real-Time Drawing and Guessing App
# https://vdrw-vercel-deployement.vercel.app
## Overview

VDRW is a fun, interactive real-time drawing application where users can draw artwork and challenge their friends to guess what they're drawing. It's like an online version of Pictionary! The app supports multiplayer sessions with real-time updates, allowing seamless collaboration and guessing through WebSockets.

The frontend is built with React for a responsive UI, while the backend uses Django for robust API handling and real-time features powered by Django Channels, ASGI, and Redis.

## Features

- **Real-Time Drawing**: Draw on a canvas and see updates in real-time across connected users.
- **Guessing Game**: Friends can guess what you're drawing via chat or input.
- **Multiplayer Parties**: Create or join rooms (parties) for group play.
- **User Authentication**: Secure login and registration using JWT.
- **Chat Integration**: Real-time chat for hints, guesses, and fun interactions.
- **Cross-Origin Support**: Handles frontend-backend communication smoothly.

## Technologies Used

- **Frontend**: React, lucide-react (for icons), React Router, Axios (for API calls), Tailwind CSS (for styling), Vite (build tool).
- **Backend**: Django, Django REST Framework, Django Channels (for WebSockets), ASGI (with Daphne server), Redis (for channel layers), PostgreSQL (database).
- **Other**: WebSockets for real-time communication, JWT for authentication, CORS for cross-origin requests.

## Prerequisites

Before setting up the app, ensure you have the following installed:

- Python 3.8+
- Node.js 18+ and npm
- PostgreSQL database server
- Redis server (for real-time features)
- Git (to clone the repository)

You'll also need to set up environment variables for database credentials and other configs (see below).

## Installation

### Clone the Repository

```bash
git clone https://github.com/yacine204/vdrw.git
cd vdrw
```

### Backend Setup (Django)

The backend is located in the `vdrw/` directory.

1. Navigate to the backend directory:
   ```bash
   cd vdrw
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies via pip (based on the project's Django configuration, including Channels, Redis integration, and more):
   ```bash
   pip install django djangorestframework django-cors-headers channels daphne channels-redis djangorestframework-simplejwt python-dotenv psycopg2-binary
   ```

4. Create a `.env` file in the `vdrw/vdrw/` directory with your PostgreSQL credentials:
   ```
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost  # or your host
   DB_PORT=5432
   ```
   (You may need additional env vars like `SECRET_KEY` if specified in code.)

5. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. (Optional) Create a superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

### Frontend Setup (React)

The frontend is located in the `frontend/` directory.

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend  # From backend dir, or cd frontend from repo root
   ```

2. Install dependencies via npm:
   ```bash
   npm install
   ```
   This will install React, React Router, Axios, and dev tools like Vite, Tailwind CSS, TypeScript, and ESLint.

## Running the App

1. **Start Redis**: Ensure Redis is running on your local machine (default: `localhost:6379`). On most systems:
   ```bash
   redis-server
   ```

2. **Run the Backend** (using Daphne for ASGI/WebSocket support):
   ```bash
   # From the vdrw/ directory
   daphne -b 0.0.0.0 -p 8000 vdrw.asgi:application
   ```
   The backend will be available at `http://localhost:8000`.

3. **Run the Frontend** (development mode with hot reloading):
   ```bash
   # From the frontend/ directory
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173` (Vite default). Open this in your browser.

## Usage

1. Open the app in your browser (frontend URL).
2. Register a new account or log in.
3. Create a new party/room or join an existing one.
4. Start drawing on the canvas - your friends in the same room will see updates in real-time.
5. Use the chat to guess what others are drawing or give hints.
6. Enjoy the game! The app handles real-time synchronization via WebSockets, so everything updates instantly.

For production, consider deploying with a proper ASGI server like Daphne or Uvicorn, and use a reverse proxy (e.g., Nginx) for static files and security.

## Troubleshooting

- **Database Issues**: Ensure PostgreSQL is running and credentials in `.env` are correct.
- **Redis Connection**: If `CHANNEL_LAYERS` fails, verify Redis is on port 6379.
- **CORS Errors**: The app allows all origins by default, but adjust in `settings.py` if needed.
- **Missing Dependencies**: If you encounter import errors, install any missing packages based on code (e.g., `pip install <package>`).

## Contributing

Feel free to fork the repo, make improvements, and submit pull requests. Focus on adding features like better drawing tools or AI guessing!

## License

This project is open-source under the MIT License.
