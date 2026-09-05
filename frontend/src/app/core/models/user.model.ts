export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'USER' | 'OWNER';
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  wishlist?: string[];
  createdAt?: string;
}

export interface Owner {
  _id: string;
  name: string;
  businessName: string;
  email: string;
  mobile: string;
  role: 'OWNER';
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  businessId?: string;
  rating?: number;
  createdAt?: string;
}
