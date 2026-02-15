export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
  phoneNumber?: string;
  address?: string;
  profileImg?: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type TUserRole = "admin" | "staff" | "guest" | "subAdmin";
export type TUserStatus = "active" | "blocked";

export const USER_ROLE_ENUM = ["admin", "staff", "guest", "subAdmin"];
export const USER_STATUS_ENUM = ["active", "blocked"];

export const USER_ROLE = {
  admin: "admin",
  staff: "staff",
  guest: "guest",
  subAdmin: "subAdmin",
} as const;
