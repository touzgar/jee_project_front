export class Role {
  roleId!: number;
  role!: string;
}

export class User {
  userId!: number; 
  username!: string;
  password!: string;
  email!: string;
  enabled!: boolean;
  roles!: Role[]; 
  roleNames!: string; 
  address!:string;
}