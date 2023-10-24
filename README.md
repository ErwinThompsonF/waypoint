# Project Name
Project Waypoint
## Description
The goal of this project is to develop a web application that allows users to submit the addresses of a pickup point and a drop-off point. The application should communicate with the Mock API backend to retrieve the corresponding waypoints and display them on an embedded map.

## Installation

1. Clone the repository.
2. Navigate to the project directory.

3. Create a new file named `.env` in the root directory of the project.

4. Open the `.env` file and add the following environment variables:

API_HOST=YOUR_API_HOST_VALUE
MAP_API_KEY=YOUR_MAP_API_KEY_VALUE

Replace `YOUR_API_HOST_VALUE` with the appropriate value for your API host, and `YOUR_MAP_API_KEY_VALUE` with your Google Maps API key.

## Usage

1. Install the project dependencies by running the following command:
```
npm install
```

2. Start the development server:

```
npm start
Open your browser and navigate to http://localhost:3000 to access the application.
```

## Production Build
To build the project for production, follow these steps:

Open a terminal or command prompt.

Navigate to the project directory.

Run the following command to install the project dependencies:

```
npm install
```

Create a production build by running the following command:
```
npm run build
```
This command will generate an optimized production build of the project.
After the build process completes, you will find the production-ready files in the build directory.

run the production build application by running the following command:
```
npm start
```

This command will start a local server on port 3000, serving the production build of your application.

Open your browser and navigate to http://localhost:3000 (or the appropriate port if you specified a different one) to access the deployed application.

## License
In the installation section, we added a step (Step 3) to create a new file named `.env` in the root directory of the project. We also provided instructions on adding the required environment variables (`API_HOST` and `MAP_API_KEY`) in the `.env` file.

Make sure to replace `YOUR_API_HOST_VALUE` with the actual API host value and `YOUR_MAP_API_KEY_VALUE` with your Google Maps API key.
