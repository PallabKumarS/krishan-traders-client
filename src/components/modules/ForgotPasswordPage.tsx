"use client";

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
import { Leaf, KeyRound, ShieldCheck } from "lucide-react";
import ForgotPassword from "../forms/ForgotPassword";
import ResetPassword from "../forms/ResetPassword";
import { getFromLocalStorage } from "@/lib/localStorage";

interface BackgroundVariant {
  background: string[];
}

interface BackgroundVariants {
  forgot: BackgroundVariant;
  reset: BackgroundVariant;
}

const ForgotPasswordPage = () => {
  const [activeTab, setActiveTab] = useState<"forgot" | "reset">("forgot");

  const backgroundVariants: BackgroundVariants = {
    forgot: {
      background: [
        "linear-gradient(135deg, hsl(200, 70%, 45%) 0%, hsl(240, 60%, 55%) 100%)",
        "linear-gradient(135deg, hsl(240, 60%, 55%) 0%, hsl(200, 70%, 45%) 100%)",
      ],
    },
    reset: {
      background: [
        "linear-gradient(135deg, hsl(220, 60%, 50%) 0%, hsl(260, 70%, 45%) 100%)",
        "linear-gradient(135deg, hsl(260, 70%, 45%) 0%, hsl(220, 60%, 50%) 100%)",
      ],
    },
  } as const;

  const handleTabChange = (value: string) => {
    if (value === "forgot" || value === "reset") {
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

      {/* Animated Side Illustration for Forgot Password */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-20"
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: activeTab === "forgot" ? 0 : 100,
          opacity: activeTab === "forgot" ? 0.2 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="hsl(200, 70%, 45%)"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.4,-45.8C87,-32.5,89.2,-16.2,87.1,-0.8C85,14.6,78.6,29.2,70.1,42.4C61.6,55.6,51,67.4,38.2,75.8C25.4,84.2,10.4,89.2,-5.8,87.6C-22,86,-44,77.8,-59.2,65.2C-74.4,52.6,-82.8,35.6,-84.7,18.1C-86.6,0.6,-82,-17.4,-74.9,-33.9C-67.8,-50.4,-58.2,-65.4,-45.1,-73.2C-32,-81,-16,-81.6,-0.8,-80.2C14.4,-78.8,28.8,-75.4,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Animated Side Illustration for Reset Password */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-20"
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: activeTab === "reset" ? 0 : -100,
          opacity: activeTab === "reset" ? 0.2 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="hsl(220, 60%, 50%)"
            d="M42.1,-72.8C55.4,-65.7,67.3,-55.2,74.8,-42.1C82.3,-29,85.4,-14.5,84.2,-0.5C83,13.5,77.5,27,70.2,39.4C62.9,51.8,53.8,63.1,42.5,71.2C31.2,79.3,17.7,84.2,2.8,82.4C-12.1,80.6,-24.2,72.1,-35.8,63.2C-47.4,54.3,-58.5,44.9,-66.8,33.2C-75.1,21.5,-80.6,7.5,-80.4,-6.5C-80.2,-20.5,-74.3,-34.5,-66.1,-47.2C-57.9,-59.9,-47.4,-71.3,-34.8,-78.6C-22.2,-85.9,-7.4,-89.1,6.2,-87.3C19.8,-85.5,28.8,-79.7,42.1,-72.8Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Forgot/Reset Password Card */}
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
          defaultValue="forgot"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
            <TabsTrigger value="reset">Reset Password</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="sync">
            {activeTab === "forgot" && (
              <TabsContent key="forgot-content" value="forgot" asChild>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        <CardTitle>Forgot Your Password?</CardTitle>
                      </div>
                      <CardDescription>
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ForgotPassword setActiveTab={setActiveTab} />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "reset" && (
              <TabsContent key="reset-content" value="reset" asChild>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <CardTitle>Reset Your Password</CardTitle>
                      </div>
                      <CardDescription>
                        Enter your new password to secure your Krishan Traders
                        account.
                        {getFromLocalStorage<string>("email") && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Email:{" "}
                            <span className="font-semibold">
                              {getFromLocalStorage("email") as string}
                            </span>
                          </p>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ResetPassword />
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

export default ForgotPasswordPage;
