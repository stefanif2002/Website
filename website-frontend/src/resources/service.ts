import axios, {AxiosError} from "axios";
import {message, notification} from "antd";

export const myApi = axios.create({
    baseURL: `http://localhost:8084/api/v1/`, // Adjust this to your backend's base URL
});


export const url = `http://localhost:8081/api/v1`;



//export const url = `https://4rent.duckdns.org/api/v1`;


export const width = 1920/(window.innerWidth - 200);

export const height = 1080/(window.innerHeight);

export const featureNotImplemented = () => {
    notification.warning({
        message: "Feature Not Implemented",
        description: "This feature is under development and will be available soon.",
        pauseOnHover: true,
        showProgress: true,

    });
};

export const getLangPrefix = (path: string) => {
    const m = path.match(/^\/([a-z]{2})(\/|$)/i);
    return m ? `/${m[1].toLowerCase()}` : "/el";
};

// Enhanced function to handle errors with context-sensitive messages
export const handleApiError = (
    error: AxiosError,
    context: string = '',
    _action?: string,
    customMessage: string = '',
    notFoundMessage: string = 'Item not found'
) => {
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
                {
                    const msg = (data as { message?: string } | undefined)?.message;
                    message.error(`${context}: Server encountered an issue: ${msg || 'Internal Server Error'}. Please try again later.`);
                }
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
