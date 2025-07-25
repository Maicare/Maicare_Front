"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schemas/auth.schema";
import InputControl from "@/common/components/InputControl";
import { LoginInput } from "@/types/auth.types";
import { useAuth } from "@/common/hooks/use-auth";
import Link from "next/link";

const LoginForm = () => {
    const { login } = useAuth();
    const methods = useForm<LoginInput>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: LoginInput) => {
        await login(data, { displayProgress: true, displaySuccess: true });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Field */}
                <InputControl
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                />

                {/* Password Field */}
                <InputControl
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                />

                {/* Submit Button */}
                <div className="mb-5">
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
                    >
                        {isSubmitting ? (
                            <div className="inline-block h-[1.23rem] w-[1.23rem] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>

                {/* Divider */}
                <hr className="my-4" />

                {/* Navigation Button to Intake Form */}
                <div className="mb-5">
                    <Link href="/registration">
                        <p className="w-full block p-4 text-white text-center transition border rounded-lg cursor-pointer border-secondary bg-secondary hover:bg-secondary-hover">
                            Vul Intakeformulier in
                        </p>
                    </Link>
                </div>
            </form>
        </FormProvider>
    );
};

export default LoginForm;
