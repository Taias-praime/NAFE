import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { setBG } from '../../lib/utils';
import useAuth from '../../hooks/useAuth';
import { useFormik } from 'formik';
import SubmitButton from '../../components/ui-custom/submitButton';
import { useEffect } from 'react';
import { LoginVS } from '../../models/validationSchema';

const SAMPLE_IMG = '';
// 'https://images.unsplash.com/photo-1512238350357-c3180a5d7e2f?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const Login = () => {
	const { login, isLoggingIn, isLoggedIn } = useAuth();

	const nav = useNavigate();

	const initialValues = {
		username: '',
		password: '',
        client_id: import.meta.env.VITE_SUPER_ADMIN_CLIENT_ID,
        client_secret: import.meta.env.VITE_SUPER_ADMIN_CLIENT_SECRET,
        grant_type: 'password',
        scope: 'openid profile offline_access'
	};

	const handleLogin = () => {
		login(formik.values).then((d) => {
			console.log(d);
			// nav('/dashboard');
		});
	};

	const formik = useFormik({
		initialValues,
		onSubmit: handleLogin,
	});

	
	useEffect(() => {
		
		if (isLoggedIn) nav('/dashboard');
	}, [isLoggedIn])

	return (
		<div className="grid lg:grid-cols-5 h-svh">
			<div
				className="relative hidden p-10 lg:flex items-end col-span-3 bg-background h-full"
				{...setBG(SAMPLE_IMG)}>
				<div className="z-10 max-w-[500px] mb-5">
					<h1 className="text-white text-4xl mb-5">
						Lorem ipsum, dolor!
					</h1>
					<p className="text-accent">
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Dolorem iusto quas consequatur reprehenderit,
						nulla, aut iure debitis assumenda, sunt eos ex
						accusantium. Dolore ut ipsa ex non, et ducimus ea?
					</p>
				</div>

				<div className="bg-gradient-to-t from-black absolute top-0 left-0 w-full h-full z-0"></div>
			</div>

			<div className="col-span-2 h-full flex items-center justify-center">
				<form className="container mx-auto max-w-[450px]" onSubmit={formik.handleSubmit}>
					<p className="text-xl mb-10 text-center"> Welcome Back </p>

					<Input
						value={formik.values.username}
						onChange={formik.handleChange}
						name="username"
						placeholder=""
						className="mb-10"
						autoComplete="email"
						label="Email"
					/>

					<Input
						value={formik.values.password}
						onChange={formik.handleChange}
						name="password"
						placeholder=""
						type="password"
						autoComplete="current-password"
						className="mb-10"
						label="Password"
					/>

                    <SubmitButton state={isLoggingIn} className='w-full' > Login </SubmitButton>

					<div className="py-5 text-center">
						<Link to="/reset"> Forgot Password? </Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
