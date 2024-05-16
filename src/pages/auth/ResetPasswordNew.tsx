import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import KeyIcon from "/icons/Bold Duotone/Security/Key Minimalistic Square 4.svg"
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SubmitButton from "../../components/custom/submitButton";
import { useFormik } from "formik";

const ResetPasswordNew = () => {

    const nav = useNavigate();
    const loc = useLocation();
    const { from } = loc.state || { from: '/reset' }; // Default to reset if no state

    const handleSubmit = () => {}

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        onSubmit: handleSubmit
    })  

  return (
      <div className="flex items-center justify-center h-svh">
          <form onSubmit={formik.handleSubmit} className="relative w-full max-w-[400px] h-auto bg-[#DDDDDD] rounded-md p-10 text-center">
              <div className="absolute top-2 left-2">
                <Button onClick={() => nav(from)} variant="ghost"> <ChevronLeft /> Back </Button>
              </div>
              
              <img src={KeyIcon} className="mx-auto mb-10" alt="" />

              <p className="text-xl font-bold mb-2"> Password Reset </p>
              <p className="mb-10"> Enter email address to reset password </p>
              <div className="text-start">
                  <Input name="password" type="password" label="New Password" className="mb-10" onChange={formik.handleChange} />
                  <Input name="confPassword" type="password" label="Confirm Password" className="mb-10" />
                  <SubmitButton state={false} className="w-full"> Reset Password </SubmitButton>
              </div>
          </form>
      </div>
  )
}


export default ResetPasswordNew;