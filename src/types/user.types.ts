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
};

export type TUserRole = "admin" | "staff" | "guest" | "subAdmin";

export type TUserStatus = "active" | "blocked";
