"use client";

import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Leaf, Sprout } from "lucide-react";

interface BackgroundVariant {
  background: string[];
}

interface BackgroundVariants {
  login: BackgroundVariant;
  register: BackgroundVariant;
}

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const backgroundVariants: BackgroundVariants = {
    login: {
      background: [
        "linear-gradient(135deg, hsl(140, 70%, 45%) 0%, hsl(90, 60%, 55%) 100%)",
        "linear-gradient(135deg, hsl(90, 60%, 55%) 0%, hsl(140, 70%, 45%) 100%)",
      ],
    },
    register: {
      background: [
        "linear-gradient(135deg, hsl(100, 60%, 50%) 0%, hsl(140, 70%, 45%) 100%)",
        "linear-gradient(135deg, hsl(140, 70%, 45%) 0%, hsl(100, 60%, 50%) 100%)",
      ],
    },
  } as const;

  const handleTabChange = (value: string) => {
    if (value === "login" || value === "register") {
      setActiveTab(value);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen overflow-hidden relative px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <motion.div
        key={activeTab}
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: backgroundVariants[activeTab].background,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      />

      {/* Animated Side Illustration */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-20"
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: activeTab === "login" ? 0 : 100,
          opacity: activeTab === "login" ? 0.2 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="hsl(140, 70%, 45%)"
            d="M40.7,-70.4C53.1,-62.5,64.1,-52.8,70.6,-41.2C77.1,-29.6,79.1,-16.1,77.4,-3.7C75.7,8.8,70.3,20.2,63.3,30.4C56.3,40.6,47.8,49.6,37.6,57.4C27.4,65.2,15.6,71.8,1.3,70.6C-13.1,69.4,-29.1,60.4,-43.2,51.1C-57.3,41.8,-69.5,32.2,-75.1,20.1C-80.7,8,-79.6,-6.6,-74.1,-19.4C-68.6,-32.2,-58.6,-43.2,-47.1,-51.4C-35.6,-59.6,-22.6,-65.1,-8.8,-62.8C5.1,-60.5,28.3,-50.4,40.7,-70.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Animated Side Illustration for Register */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-20"
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: activeTab === "register" ? 0 : -100,
          opacity: activeTab === "register" ? 0.2 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="hsl(100, 60%, 50%)"
            d="M38.3,-66.7C50.8,-58.1,63.5,-50.1,70.6,-39.1C77.7,-28.1,79.2,-14.1,77.1,-1.1C75,11.9,69.3,23.8,62.1,34.5C54.9,45.2,46.3,54.7,35.7,61.9C25.1,69.1,12.5,74,-1.4,76.1C-15.4,78.2,-30.8,77.5,-43.5,70.9C-56.2,64.3,-66.2,51.8,-73.3,38.4C-80.4,25,-84.6,10.8,-81.8,-2.1C-79,-15,-69.2,-26.6,-59.7,-37.4C-50.2,-48.2,-41,-58.2,-29.8,-66.2C-18.6,-74.2,-9.3,-80.2,2.2,-83.4C13.7,-86.6,27.4,-86.9,38.3,-66.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Login/Register Card */}
      <motion.div
        className="relative z-10 w-[400px] mb-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <Leaf className="text-white h-8 w-8 mr-2" />
            <h1 className="text-3xl font-bold text-white">Krishan Traders</h1>
          </div>
        </div>

        <Tabs
          defaultValue="login"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="sync">
            {activeTab === "login" && (
              <TabsContent key="login-content" value="login" asChild>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        <CardTitle>Login to Your Account</CardTitle>
                      </div>
                      <CardDescription>
                        Access your Krishan Traders account to manage your
                        agricultural supplies.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <LoginForm />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "register" && (
              <TabsContent key="register-content" value="register" asChild>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-primary" />
                        <CardTitle>Create New Account</CardTitle>
                      </div>
                      <CardDescription>
                        Join Krishan Traders for quality agricultural products
                        and services.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <RegisterForm setActiveTab={setActiveTab} />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
