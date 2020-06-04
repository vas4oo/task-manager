export function getErrorMessage(error) {
    if (error.message) {
        return { message: `${error.message}` };
    }
    if (error.response) {
        if (
            error.response.data &&
            error.response.data.Data &&
            error.response.data.Data.ErrorCode
        ) {
            return { message: `${error.response.data.Data.ErrorCode}` };
        }

        if (
            error.response.data &&
            error.response.data.Data &&
            error.response.data.Data.Message
        ) {
            return { message: `${error.response.data.Data.Message}` };
        }

        if (error.response.data) {
            return { message: `${error.response.data}` };
        }

        return { message: `${error.response.status} ${error.response.statusText}` };
    } else {
        return { message: `${error.message}` };
    }
}