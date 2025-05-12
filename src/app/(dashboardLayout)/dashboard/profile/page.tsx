import Profile from "@/components/modules/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Profile",
  description: "Profile page of the dashboard",
};

const ProfilePage = () => {
  return <Profile />;
};

export default ProfilePage;
