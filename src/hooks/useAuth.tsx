
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { local, local_clear } from '../lib/utils';
import useFetch from './useFetch';
import { useEffect, useState } from 'react';

const useAuth = () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const nav = useNavigate();
    const { toast } = useToast();

    const token = local('token');

    // login
    const { isFetching, onPost } = useFetch(
        '/o/oauth/token',
        (data, status) => { // on submit
            // notify
            toast({ description: data.message });
            
            // navigate to dashboard
            if (status === 200) {
                const { access_token, expires_in, token_type, scope, refresh_token } = data.data;

                // store login meta data
                local('scope', scope);
                local('token', access_token);
                local('token_exp', expires_in);
                local('token_type', token_type);
                local('refresh_token', refresh_token);

                nav('/dashboard')
            }
        },
        (error, status) => { // on error
            const { message} = error;
            // notify
            toast({
                title: `${message} (${status})`,
               
                variant: 'destructive',
            })
        },
        {}, // options
        { 'Content-Type': 'application/x-www-form-urlencoded' } // optional headers 
    );

    const login = (data: any) => onPost(data);

    const logOut = () => {
        local_clear();
        setTimeout(() => nav('/login'), 500);
    }


    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [])

    return {
        token,
        login,
        logOut,
        isLoggedIn,
        isLoggingIn: isFetching,
    }
}

export default useAuth;