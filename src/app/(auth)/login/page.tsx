import Image from "next/image";
import LoginForm from "./LoginForm";
import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden xl:flex flex-1 bg-blue-50 items-center justify-center p-10">
        <Image
          src="/assets/images/Login-pana (1) 1.png"
          alt="login"
          width={450}
          height={450}
        />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-2">Log In</h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            Log in to explore expert insights...
          </p>
          {/* <LoginForm /> */}
          <LoginLink postLoginRedirectURL="/home">Sign in</LoginLink>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
