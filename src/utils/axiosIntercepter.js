import axios from "axios";

axios.interceptors.request.use(request => {
    // console.log("AXIOS REQUEST:", {
    //     url: request.url,
    //     method: request.method,
    //     headers: request.headers,
    //     data: request.data,
    // });

    return request;
});

axios.interceptors.response.use(
    response => {
        // console.log("AXIOS RESPONSE:", response);
        return response;
    },
    error => {
        console.log("AXIOS ERROR:", error.response);
        return Promise.reject(error);
    }
);