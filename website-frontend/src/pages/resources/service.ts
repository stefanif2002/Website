import axios, {AxiosError} from "axios";
import {message, notification} from "antd";


/*
// Authenticated API instance
export const myApi = axios.create({
    baseURL: `http://testforrent.duckdns.org/api/v1/`, // Adjust this to your backend's base URL
});

 */



export const myApi = axios.create({
    baseURL: `http://localhost:8080/api/v1/`, // Adjust this to your backend's base URL
});

export const url = `http://localhost:8084/api/v1`;

/*
export const url = `http://testforrent.duckdns.org/api/v1`;
 */

export const width = 1920/window.innerWidth;

export const height = 1080/(window.innerHeight);

export const featureNotImplemented = () => {
    notification.warning({
        message: "Feature Not Implemented",
        description: "This feature is under development and will be available soon.",
        pauseOnHover: true,
        showProgress: true,

    });
};

// Enhanced function to handle errors with context-sensitive messages
export const handleApiError = (error: AxiosError, context: string = '', action: string, customMessage: string = '', notFoundMessage: string = 'Item not found') => {
    if (error.response) {
        // The request was made and the server responded with a status code outside of the 2xx range
        const { status, data } = error.response;

        // Handle specific status codes
        switch (status) {
            case 404:
                // Custom 404 message
                message.error(`${notFoundMessage} with the given ID.`);
                break;

            case 400:
                // Handle client error
                message.error(`${context}: ${customMessage || 'Bad request, please check the data and try again.'}`);
                break;

            case 500:
                // Handle server error (e.g., internal server error)
                message.error(`${context}: Server encountered an issue: ${data.message || 'Internal Server Error'}. Please try again later.`);
                break;

            case 403:
                // Handle forbidden error (e.g., unauthorized access)
                message.error(`${context}: Forbidden, you do not have permission to perform this action.`);
                break;

            default:
                // Default error handler for unexpected status codes
                message.error(`${context}: ${customMessage || 'Unexpected error occurred. Please contact support.'}`);
                break;
        }
    } else if (error.request) {
        // The request was made but no response was received
        message.error(`${context}: Unable to connect to the server. Please check your internet connection or try again later.`);
    } else {
        // Something else happened in setting up the request
        message.error(`${context}: An error occurred: ${error.message}`);
    }

    console.error('Error:', error);
};
