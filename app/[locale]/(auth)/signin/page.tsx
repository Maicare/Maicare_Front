"use client";

import Image from "next/image";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useAuth } from "@/common/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";

const SignIn = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [temp_token, setTemp_token] = useState("");
  const { login, Verify2FA } = useAuth({ autoFetch: false });
  const router = useRouter();
  const { currentLocale } = useLocalizedPath();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!is2FAEnabled) {
      if (!email || !password) {
        console.error("Email and password are required");
        return;
      }
      try {
        const response = await login({ email, password }, {
          displayProgress: true,
          displaySuccess: true,
        });
        if (response.requires_2fa) {
          setIs2FAEnabled(true);
          setTemp_token(response.temp_token);
        } else {
          setTimeout(() => {
            router.push("/"+currentLocale+'/dashboard')
          }, 3000);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      if (!twoFactorCode) {
        console.error("2FA code is required");
        return;
      }
      if (twoFactorCode.length !== 6) {
        console.error("2FA code must be 6 digits");
        return;
      }
      if (!temp_token) {
        console.error("Temporary token is missing");
        return;
      }
      try {
        await Verify2FA(temp_token, twoFactorCode, {
          displayProgress: true,
          displaySuccess: true,
        });
        setTimeout(() => {
          router.push("/"+currentLocale+'/dashboard')
        }, 3000);
      } catch (error) {
        console.error("2FA verification failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8 p-8">
          <div className="flex items-center gap-4">
            <Image
              className="pb-2 dark:hidden"
              src={"/images/logo/logo.png"}
              alt="Logo"
              width={80}
              height={12}
            />
            <p className="text-4xl font-bold text-gray-800 dark:text-white">
              MAI<span className="font-extrabold text-blue-600">Care</span>
            </p>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              Welkom terug
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Meld u aan om verder te gaan met uw account
            </p>
          </div>

          <div className="flex mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-3 w-12 bg-blue-200 dark:bg-blue-800 rounded-full mb-2"></div>
                  <div className="h-2 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <CardHeader className="space-y-1 pb-6">
              <div className="flex lg:hidden justify-center mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    className="dark:hidden"
                    src={"/images/logo/logo.png"}
                    alt="Logo"
                    width={50}
                    height={12}
                  />
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    MAI<span className="font-extrabold text-blue-600">Care</span>
                  </p>
                </div>
              </div>

              <CardTitle className="text-2xl text-center font-bold text-gray-800 dark:text-white">
                Meld u aan
              </CardTitle>
              <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                Voer uw gegevens in om door te gaan
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Aanmelden</TabsTrigger>
                  <TabsTrigger value="signup">Registreren</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  {!is2FAEnabled ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                          E-mailadres
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="naam@voorbeeld.nl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 rounded-lg"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                            Wachtwoord
                          </Label>
                          <a
                            href="#"
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Wachtwoord vergeten?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Voer uw wachtwoord in"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 rounded-lg"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Input
                          id="remember"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Onthoud mij
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                      >
                        Aanmelden
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="text-center py-2">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <svg
                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-white">
                          Tweefactorauthenticatie
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Voer de 6-cijferige code uit uw authenticator app in
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="2fa" className="text-gray-700 dark:text-gray-300">
                          Authenticatiecode
                        </Label>
                        <Input
                          id="2fa"
                          type="text"
                          placeholder="123456"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          className="h-11 rounded-lg text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-11 rounded-lg"
                          onClick={() => setIs2FAEnabled(false)}
                        >
                          Terug
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"

                        >
                          Verifiëren
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>

                <TabsContent value="signup">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                      Registratie niet beschikbaar
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Neem contact op met de beheerder voor een account.
                    </p>
                    <Link href="/registration" className="text-blue-600 hover:underline">
                      Registreren
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SignIn, { mode: AUTH_MODE.LOGGED_OUT, redirectUrl: Routes.Common.Home });