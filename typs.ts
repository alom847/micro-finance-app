export type User = {
  id: number;
  phone: string;
  email: string;
  alternate_phone: string;
  name: string;
  image: string;
  role: string;
  kyc_verified: boolean;
  ac_status: boolean;
  permissions: string;

  address: string;
  mother_name: string;
  father_name: string;
  nominee_name: string;
  current_address: string;
  current_district: string;
  current_city: string;
  current_zip: string;
  current_state: string;
  district: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  date_of_birth: string;
  maritial_status: string;
  gender: string;
  profession: string;
  annual_turnover: string;

  created_at: Date;
};

export type Loan = {
  id: number;
  ref_id: number | null;
  user_id: number;
  plan_id: number;
  amount: number;
  total_paid: number;
  emi_amount: number;
  total_payable: number;
  interest_rate: number;
  premature_closing_charge: number | null;
  allow_premature_closing: boolean;
  interest_frequency: string;
  emi_frequency: string;
  prefered_installments: number;
  overrode_installments: number;
  payment_status: boolean;
  loan_status: string;
  maturity_date: Date | null;
  loan_date: Date | null;
  created_at: Date;
  remark: string;
  guarantor: unknown;
  loan_plan: number;
  user: User;
};

export type LoanPlan = {
  id: number;
  plan_name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  premature_closing_charge: number;
  allow_premature_closing: boolean;
  interest_frequency: string;
  allowed_emi_frequency: string;
  max_installments: number;
  processing_fee: number;
  penalty_rate: number;
  commission_rate: number;
  selling: boolean;
};

export type LoanWithPlan = Loan & {
  user: User;
  emi_paid: number;
  next_pay_date: Date;
  loan_plan: LoanPlan;
  last_repayment: string | null;
  guarantor: {
    name: string;
    phone: string;
    address: string;
    relationship: string;
    photo: string;
    standard_form: string;
  };
};

export type Deposit = {
  id: number;
  ref_id: number | null;
  user_id: number;
  plan_id: number;
  amount: number;
  total_paid: number;
  category: "RD" | "FD";
  interest_rate: number;
  premature_withdrawal_charge: number;
  allow_premature_withdrawal: boolean;
  interest_credit_frequency: string;
  payment_frequency: string;
  prefered_tenure: number;
  maturity_date: Date | null;
  deposit_date: Date;
  created_at: Date;
  remark: string;
  nominee: unknown;
  payment_status: string;
  deposit_status: string;
  deposit_plan: number;
  user: User;
};

export type DepositPlan = {
  id: number;
  min_amount: number;
  max_amount: number;
  plan_name: string;
  category: string;
  interest_rate: number;
  premature_withdrawal_charge: number;
  allow_premature_withdrawal: boolean;
  allowed_interest_credit_frequency: string;
  allowed_payment_frequency: string;
  selling: boolean;
  penalty_rate: number;
  commission_rate: number;
};

export type DepositWithPlan = Deposit & {
  user: User;
  next_pay_date: Date;
  deposit_plan: DepositPlan;
  nominee: {
    name: string;
    phone: string;
    address: string;
  };
};

export type EmiRecord = {
  id: number;
  plan_id: number;
  category: "Loan" | "Deposit";
  amount: number;
  late_fee: number;
  total_paid: number;
  pay_date: Date;
  status: "Paid" | "Collected" | "Hold";
  remark: string;
  created_at: Date;

  collected_by: number | null;
  hold_by: number | null;
};

export type Repayment = EmiRecord & {
  collector: User;
};

export type LoansWithDue = LoanWithPlan & {
  due: {
    // overdues: due_record[];
    // partiallyPaid: due_record[];
    // dues: due_record[];
    totalOverdue: number;
    totalPartialRemain: number;
    totalDue: number;
  };
};

export type report = {
  reports: (EmiRecord & {
    collector: User | null;
  })[];
  pending: number;
  loan: number;
  deposit: number;
  late_fee: number;
};

export type groupReport = {
  txns: {
    collected_by: string;
    _sum: {
      amount: number;
      late_fee: number;
    };
    user: User;
  }[];
  pending: number;
};

export type withdrawal = {
  id: number;
  wallet_id: number;
  amount: number;
  status: "Pending" | "Approved";
  note: string;
  created_at: Date;
  updated_at: Date;
};
