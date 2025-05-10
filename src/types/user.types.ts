import { TComment } from "./comment.types";
import { TIdea, } from "./idea.types";
import { TPaidIdeaPurchase } from "./payment.types";
import { VoteType } from "./vote.types";

export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: UserRole;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  isDeleted: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  ideas?: TIdea[];
  vote?: VoteType[];
  Comment?: TComment[];
  PaidIdeaPurchase?: TPaidIdeaPurchase[];
};

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
