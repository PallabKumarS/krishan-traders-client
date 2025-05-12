"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import { useEffect, useState } from "react";
import { getMe } from "@/services/UserService";
import LoadingData from "@/components/shared/LoadingData";
import { toast } from "sonner";
import { TUser } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PasswordForm from "../forms/PasswordForm";
import ProfileForm from "../forms/ProfileForm";
import { Separator } from "../ui/separator";

// Form schema for account info
const accountFormSchema = z.object({
  name: z.string().optional(),
});

const Profile = () => {
  const { setUser: setContextUser } = useAppContext();
  const [user, setUser] = useState<TUser | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  // Account info form
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getMe();

        setContextUser(res?.data);
        setUser(res?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUsers();
  }, [setContextUser]);

  return (
    <div className="mx-auto p-6">
      {isFetching && <LoadingData />}
      <h1 className="text-3xl font-bold mb-6">{`${user?.name}'s Profile`}</h1>
      <p className="text-muted-foreground mb-8">
        View and update your personal information and account settings.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center px-4">
            <Avatar className="h-24 w-24 mb-4">
              {user?.profileImg ? (
                <AvatarImage src={user.profileImg} alt={user.name} />
              ) : (
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
            <p className="text-muted-foreground mb-4 capitalize">
              {user?.role}
            </p>
            <div className="w-full space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {user?.phoneNumber || "No phone number added"}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {user?.address || "No address added"}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm capitalize">{user?.role}</span>
              </div>
            </div>
            <Button className="mt-6 w-full px-1">
              <User className="mr-1 h-4 w-4" /> Edit Profile Picture
            </Button>
          </CardContent>
        </Card>

        {/* Profile Details Tabs */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs
              defaultValue="personal"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full flex flex-col md:flex-row gap-4 text-xs sm:text-sm mb-10 md:mb-0">
                <TabsTrigger value="personal" className="px-1 sm:px-2">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="account" className="px-1 sm:px-2">
                  Account
                </TabsTrigger>
                <TabsTrigger value="security" className="px-1 sm:px-2">
                  Security
                </TabsTrigger>
              </TabsList>
              <Separator />
              {/* personal tab  */}
              <TabsContent value="personal" className="space-y-4 pt-4">
                <ProfileForm userData={user} />
              </TabsContent>

              {/* account tab  */}
              <TabsContent value="account" className="space-y-4 pt-4">
                <form>
                  <div className="space-y-2">
                    <Label htmlFor="username">Name</Label>
                    <Input
                      id="name"
                      {...accountForm.register("name")}
                      value={user?.name || ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      className="capitalize"
                      value={user?.role || ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="joinDate">Joined Date</Label>
                    <Input
                      id="joinDate"
                      value={
                        user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : ""
                      }
                      readOnly
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="joinDate">userId</Label>
                    <Input
                      id="userId"
                      value={user?._id ? user._id : ""}
                      readOnly
                    />
                  </div>
                </form>
              </TabsContent>

              {/* security tab */}
              <TabsContent value="security" className="space-y-4 pt-4">
                <PasswordForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
