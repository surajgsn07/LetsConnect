# Lets Connect - A Social Platform for Tech People

**Lets Connect** is a modern social platform designed to help tech enthusiasts, developers, and professionals connect, collaborate, and grow their careers. The platform provides a range of features including real-time chat, video calls, posts, profiles, experience and education management, and much more. Whether you're a developer, designer, or tech enthusiast, Lets Connect helps you build meaningful relationships and stay updated with the latest trends in the tech industry.

## Features

- **User Profiles**: Users can create and manage their profiles, showcasing their skills, experience, education, and areas of interest.
- **Chat & Messaging**: Real-time messaging with the ability to send text, images, and videos.
- **Video Calls**: Seamless video conferencing for remote collaboration or casual catch-ups.
- **Posts**: Share your thoughts, projects, and updates with your network. Like, comment, and interact with other posts.
- **Experience & Education**: Manage your professional experience and education, and showcase your career journey.
- **Communities**: Join or create tech-related communities to discuss specific technologies, frameworks, or topics.
- **Networking**: Follow other professionals, get updates on their activities, and grow your network.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Redux, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication
- **Video Calls**: WebRTC for video conferencing
- **Real-time Communication**: Socket.io for real-time messaging
- **File Uploads**: Cloudinary for media uploads

## Installation

### Prerequisites

- Node.js (version 14.x or above)
- npm or yarn
- MongoDB (local or cloud instance)

### Steps to Install

1. Clone the repository:

    ```bash
    git clone https://github.com/surajgsn07/lets-connect.git
    cd lets-connect
    ```

2. Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

3. Install frontend dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in the backend directory and set up the required environment variables:
      - `MONGO_URI` - MongoDB connection string
      - `JWT_SECRET` - Secret key for JWT authentication
      - `CLOUDINARY_URL` - Cloudinary API URL for image uploads

5. Start the development servers:
    - Start the backend server:

      ```bash
      cd backend
      npm start
      ```

    - Start the frontend server:

      ```bash
      cd frontend
      npm start
      ```

    Your application should now be running on `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## Usage

- **Create an account**: Sign up using your email or a third-party OAuth provider.
- **Build your profile**: Add details about your experience, education, skills, and interests.
- **Start networking**: Connect with other users, follow their activities, and interact through posts and comments.
- **Join communities**: Engage in specialized groups to learn and discuss various technologies.
- **Chat and video calls**: Start one-on-one or group chats and initiate video calls with your network.

## Contributing

We welcome contributions to **Lets Connect**! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new pull request.

Please ensure that your code adheres to the project's coding standards and passes the tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any issues or suggestions, feel free to open an issue or reach out to us.

- **Author**: [Suraj Singh](https://github.com/surajgsn07)
- **Email**: surajgusain786786@gmail.com

## Acknowledgments

- Thanks to the open-source community for providing the libraries and tools that made this project possible.
