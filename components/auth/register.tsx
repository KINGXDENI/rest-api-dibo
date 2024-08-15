"use client";
import Swal from "sweetalert2";
import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const Register = () => {
  const router = useRouter();

  const initialValues: RegisterFormType = {
    name: "Acme",
    email: "admin@acme.com",
    password: "admin",
    confirmPassword: "admin",
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      if (values.password !== values.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match!",
        });
        return;
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            text: "You have been registered successfully.",
          }).then(() => {
            router.replace("/");
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text:
              errorData.message ||
              "There was an issue with your registration. Please try again.",
          });
        }
      } catch (error) {
        console.error("Registration failed:", error);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "There was an issue with your registration. Please try again.",
        });
      }
    },
    [router]
  );

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Register</div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Name"
                value={values.name}
                isInvalid={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                onChange={handleChange("name")}
              />
              <Input
                variant="bordered"
                label="Email"
                type="email"
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
              <Input
                variant="bordered"
                label="Confirm password"
                type="password"
                value={values.confirmPassword}
                isInvalid={
                  !!errors.confirmPassword && !!touched.confirmPassword
                }
                errorMessage={errors.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
            >
              Register
            </Button>
          </>
        )}
      </Formik>

      <div className="font-light text-slate-400 mt-4 text-sm">
        Already have an account ?{" "}
        <Link href="/login" className="font-bold">
          Login here
        </Link>
      </div>
    </>
  );
};
