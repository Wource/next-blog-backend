# Next Blog Backend

## Running the project for developement
To run the project, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Copy the `.env.example` file to `.env` and update the environment variables - `cp env.example .env`
4. Make sure you have Docker installed and running
5. Run the docker components for development: `docker compose up minio postgres`
6. Run the development server: `npm run dev`
