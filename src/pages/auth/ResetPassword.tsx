import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import LockIcon from '/icons/Bold Duotone/Security/Lock Password.svg';
import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import useFetch from '../../hooks/useFetch';
import { toast } from '../../components/ui/use-toast';
import SubmitButton from '../../components/ui-custom/submitButton';

const ResetPassword = () => {
	const nav = useNavigate();
	const loc = useLocation();
	const { from } = loc.state || { from: '/login' }; // Default to login if no state

	const { onPost, isFetching } = useFetch(
		'/auth/forgot-password',
		(data, status) => {
			toast({ description: data.message });

			if (status === 200) nav('./new');
		}, // on success
		(e) => {
			const { message, ...err } = e;
			// notify
			toast({
				title: `${message} (${status})`,
				description: err.errors.error_message,
				variant: 'destructive',
			});
		}, // on error
		{}, //
		{
			Authorization:
				'Basic ' +
				btoa(
					`${import.meta.env.VITE_SUPER_ADMIN_CLIENT_ID}:${
						import.meta.env.VITE_SUPER_ADMIN_CLIENT_SECRET
					}`
				),
		}
	);

	const handleSubmit = (values: any) => {
		onPost(values);
	};

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		onSubmit: handleSubmit,
	});

	return (
		<div className="flex items-center justify-center h-svh">
			<div className="relative w-full max-w-[400px] h-auto bg-[#DDDDDD] rounded-md p-10 text-center">
				<div className="absolute top-2 left-2">
					<Button onClick={() => nav(from)} variant="ghost">
						<ChevronLeft /> Back
					</Button>
				</div>

				<img src={LockIcon} className="mx-auto mb-10" alt="" />

				<p className="text-xl font-bold mb-2">
					Forgot Your Password?
				</p>
				<p className="mb-5"> Enter email address to reset password </p>
				<form className="text-start" onSubmit={formik.handleSubmit}>
					<Input
						label="Email"
						className="mb-8"
						name="email"
						onChange={formik.handleChange}
					/>
					<SubmitButton
						className="w-full"
						state={isFetching && formik.dirty}
          >
						Reset Password
					</SubmitButton>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
