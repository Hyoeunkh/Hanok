// ─── Example ──────────────────────────────────────────────────────────────────
export type ExData = {
  id: number;
  name: string;
};

// ─── Auth / Login ─────────────────────────────────────────────────────────────
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    phone: string;
  };
};

// ─── Auth / Logout ────────────────────────────────────────────────────────────
export type LogoutPayload = {
  refreshToken: string;
};

export type LogoutResponse = {
  success: boolean;
};

// ─── Auth / Token Refresh ─────────────────────────────────────────────────────
export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

// ─── Auth / Sign Up ───────────────────────────────────────────────────────────
export type SignUpPayload = {
  email: string;
  nickname: string;
  password: string;
  phone: string;
  smsToken: string;
};

// ─── Auth / Email ─────────────────────────────────────────────────────────────
export type CheckEmailResponse = {
  isDuplicated: boolean;
};

// ─── Auth / SMS ───────────────────────────────────────────────────────────────
export type SmsCodeResponse = {
  expireAt: string;
};

export type VerifySmsResponse = {
  verified: boolean;
  sessionToken: string;
};

export type SideBarItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

// ─── Escrow ───────────────────────────────────────────────────────────────────
export type EscrowState = 'DEPOSITED' | 'INVOICE_SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export type EscrowItem = {
  escrowId?: string | number;
  imageUrl?: string;
  itemName: string;
  amount: number;
  escrowState: EscrowState;
  createdAt: string;
};

export type EscrowListResponse = {
  status: string;
  message: string;
  data: EscrowItem[];
};

export type EscrowDetailResponse = {
  status: string;
  message: string;
  data: {
    winningInfo: {
      imageUrl?: string;
      itemName: string;
      finalPrice: number;
      sellerName: string;
      sellerId: string;
      wonAt: string;
    };
    shippingAddress: {
      name: string;
      phone: string;
      postalCode: string;
      address: string;
      addressDetail: string;
    };
    delivery: {
      courierName: string;
      trackingNumber: string;
    } | null;
  };
};

// ─── Tracking ─────────────────────────────────────────────────────────────────
export type PostTrackingInfoPayload = {
  carrierName: string;    // 택배사 이름 ("CJ대한통운" 등)
  trackingNumber: string; // 송장 번호
};
