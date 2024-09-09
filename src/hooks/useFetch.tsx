import { DialogContext } from "../contexts/dialog.context";
import { useState, useContext } from "react";
import { local, local_clear } from "../lib/utils";
import { useNavigate } from 'react-router-dom';

interface IOptions {
    handleError?: boolean;
}

interface UseFetchResult {
    onFetch: (method?: string, body?: any) => Promise<void>;
    isFetching: boolean;
    onPost: (body?: any) => Promise<void>;
    onPut: (body?: any) => Promise<void>;
    onDelete: (body?: any) => Promise<void>;
}

const useFetch = (
    path: string,
    onSuccess: (body: any, status: any) => void,
    onError?: (res?: any, status?: any) => void,
    options?: IOptions,
    customHeaders?: HeadersInit,
): UseFetchResult => {

    const [isFetching, setIsFetching] = useState(false);
    const { onSetMessage } = useContext(DialogContext);
    const navigate = useNavigate();

    const encodeFormData = (data: any) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
    }

    let isRedirecting = false;
    // Map to keep track of active controllers
    const activeControllers = new Map();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const logoutAndRedirect = () => {
        if (!isRedirecting) {
            isRedirecting = true;

            // Abort all ongoing requests
            activeControllers.forEach(controller => controller.abort());
            activeControllers.clear();
            local_clear();

            navigate("/login");
        }
    };


    const onFetch = async (method = 'get', body: any = undefined) => {
        const BASE_URL: string = import.meta.env.VITE_BASE_URL!;

        const host = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

        const token = local("token");
        const _path = path;

        // Create a new AbortController for this fetch request
        const controller = new AbortController();
        const { signal } = controller;

        // Save the controller so we can abort it if needed
        activeControllers.set(_path, controller);

        try {
            setIsFetching(true);
            const headers = {
                "Content-Type": "application/json",
                // "Authorization": `Bearer `,
                "Authorization": `Bearer ${token}`,
                ...customHeaders
            };

            const formattedBody = headers['Content-Type'].includes('x-www-form-urlencoded')
                ? encodeFormData(body)
                : headers['Content-Type'].includes('json')
                    ? JSON.stringify(body)
                    : body;

            const res = await fetch(`${host}${_path}`, {
                method,
                headers,
                body: formattedBody,
                signal
            });

            if (res.status === 401) {
                // logout and clear local storage
                // logoutAndRedirect();
                return;
            }

            if (res.ok) {
                try {
                    const responseBody = await res.json();
                    onSuccess(responseBody, res.status);
                } catch (e) {
                    onSuccess(null, res.status);
                }
            } else {
                if (res.status === 500) {
                    throw new Error("An unknown error occurred");
                }
                if (onError) {
                    const _res = await res.json();
                    onError(_res, res.status);
                }
            }
        } catch (e) {
            if (options?.handleError && onError) onError();
            else onSetMessage("An unknown error occurred");
        } finally {
            setIsFetching(false);
        }
    }

    const onPost = async (body?: any) => onFetch("post", body);
    const onPut = async (body?: any) => onFetch("put", body);
    const onDelete = async (body?: any) => onFetch("delete", body);

    return {
        onFetch,
        isFetching,
        onPost,
        onPut,
        onDelete,
    };
}

export default useFetch;
