import axios from "axios";

// const BASE_URL = "https://api.offnstudio.in/v1/api";
const BASE_URL = "http://192.168.207.252:3000/v1/api";

// const BASE_URL = "https://panel.himalayanmicrofin.in/api/native";
// const BASE_URL = "http://192.168.1.7:3000/api/native";

export const API = axios.create({
  baseURL: BASE_URL,
});

// auth

export const Signup = async (
  phone: string,
  email: string,
  password: string,
  confirm: string,
  name: string
) => {
  return API.post("/auth/signup", {
    phone,
    email,
    password,
    confirm,
    name,
  });
};

export const VerifySignup = async (phone: string, otp: string) => {
  return API.post("/auth/verify-signup", {
    phone,
    otp,
  });
};

export const ChangePwd = async (
  old_pass: string,
  new_pass: string,
  confirm: string
) => {
  return API.post("/user/settings/change-pass", {
    old_pass,
    new_pass,
    confirm,
  });
};

export const RequestPwdReset = async (phone: string) => {
  return API.post("/auth/req-pwd-reset", {
    phone,
  });
};

export const ResendOTP = async (
  phone: string,
  type: "ResetPassword" | "Register"
) => {
  return API.post("/auth/resend-otp", {
    phone,
    type,
  });
};

export const ResetPassword = async (
  phone: string,
  otp: string,
  password: string,
  confirm: string
) => {
  return API.post("/auth/reset-pwd", {
    phone,
    otp,
    password,
    confirm,
  });
};

// profile

export const GetProfile = async () => {
  return API.get("/user/profile");
};

export const UpdateProfile = async (body: { [key: string]: unknown }) => {
  return API.post("/user/profile/update", body);
};

export const UpdateProileImage = async (body: FormData) => {
  return API.post("/user/profile/update-dp", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Wallet

export const GetWallet = async () => {
  return API.get("/wallet");
};

export const GetTransactions = async (skip: number = 0, limit: number = 20) => {
  return API.get("/wallet/txns?", {
    params: {
      skip,
      limit,
    },
  });
};

export const GetWithdrawals = async (
  skip = 0,
  limit = 20,
  src_term = ""
  // type = "Completed,Pending"
) => {
  return API.get(
    `/wallet/withdrawals?skip=${skip}&limit=${limit}&src_term=${src_term}`
  );
};

export const InitiateWithdrawalRequest = async (amount: number) => {
  return API.post(`/wallet/withdrawal`, {
    withdrawal_amount: amount,
  });
};

// KYC

export const GetKyc = async () => {
  return API.get("/kyc");
};

export const ResetKYC = async () => {
  return API.post("/kyc/reset");
};

export const UpdateIDProof = async (body: FormData) => {
  return API.post("/kyc/update-id-proof", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateAddressProof = async (body: FormData) => {
  return API.post("/kyc/update-addr-proof", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateSelfie = async (body: FormData) => {
  return API.post("/kyc/update-selfie", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// dash

export const GetDashData = async () => {
  return API.get("/user/dash-data");
};

// referrals

export const GetReferrals = async () => {
  return API.get(`/user/referrals`);
};

// Plans

export const GetLoanPlans = async (skip = 0, limit = 20) => {
  return API.get(`/plans/loan?limit=${limit}&skip=${skip}`);
};

export const GetLoanPlanDetails = async (id: number) => {
  return API.get(`/plans/loan/${id}`);
};

export const GetDepositPlans = async (
  category = "FD",
  skip = 0,
  limit = 20
) => {
  return API.get(
    `/plans/deposit?category=${category}&limit=${limit}&skip=${skip}`
  );
};

export const GetDepositPlanDetails = async (id: number) => {
  return API.get(`/plans/deposit/${id}`);
};

//  Loans

export const ApplyForLoan = async (body: FormData) => {
  return API.post("/loans/apply", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const GetLoans = async (skip = 0, limit = 20) => {
  return API.get(`/loans?skip=${skip}&limit=${limit}`);
};

export const GetLoanDetails = async (id: number) => {
  return API.get(`/loans/${id}`);
};

export const GetLoanRepayments = async (id: number, skip = 0, limit = 10) => {
  return API.get(`/loans/${id}/repayments?skip=${skip}&limit=${limit}`);
};

export const GetLoanDue = async (id: number) => {
  return API.get(`/loans/${id}/due`);
};

export const GetLoanAssignments = async (id: number, agent_id: string = "") => {
  return API.get(`/loans/${id}/agents?agent_id=${agent_id}`);
};

// deposits

export const ApplyForDeposit = async (deposit_data: {
  [key: string]: unknown;
}) => {
  return API.post(`/deposits/apply`, {
    deposit_data,
  });
};

export const GetDeposits = async (
  category: "FD" | "RD" = "FD",
  skip = 0,
  limit = 20
) => {
  return API.get(`/deposits?category=${category}&skip=${skip}&limit=${limit}`);
};

export const GetDepositDetails = async (id: number) => {
  return API.get(`/deposits/${id}`);
};

export const GetDepositRepayments = async (
  id: number,
  skip = 0,
  limit = 10
) => {
  return API.get(`/deposits/${id}/repayments?skip=${skip}&limit=${limit}`);
};

export const GetDepositDue = async (id: number) => {
  return API.get(`/deposits/${id}/due`);
};

export const UpdateDepositDetails = async (
  id: number,
  deposit_data: {
    [key: string]: unknown;
  }
) => {
  return API.post(`/deposits/${id}`, {
    deposit_data,
  });
};

export const GetDepositAssignments = async (
  id: number,
  agent_id: string = ""
) => {
  return API.get(`/deposits/${id}/agents?agent_id=${agent_id}`);
};

// Agent

export const GetAssignments = async (type = "Loan", skip = 0, limit = 10) => {
  return API.get(`/user/assignments?type=${type}&skip=${skip}&limit=${limit}`);
};

export const CollectDepositEMI = async (id: number, emi_data: any) => {
  return API.post(`/deposits/${id}/collect`, {
    emi_data,
  });
};

export const CollectEMI = async (id: number, emi_data: any) => {
  return API.post(`/loans/${id}/collect`, {
    emi_data,
  });
};

export const MakeCorrection = async (id: number, emi_data: any) => {
  return API.post(`/repayment/${id}/correct`, {
    emi_data,
  });
};

export const GetRepayment = async (id: number) => {
  return API.get(`/repayment/${id}`);
};

export const GetReport = async (
  skip = 0,
  limit = 20,
  filter_from: Date | undefined = undefined,
  filter_to: Date | undefined = undefined,
  filter_collected_by: string | undefined = undefined,
  filter_plan_type: "All" | "Loan" | "Deposit" = "All"
) => {
  return API.get(`/report`, {
    params: {
      skip,
      limit,
      filter_from,
      filter_to,
      filter_collected_by,
      filter_plan_type:
        filter_plan_type === "All" ? undefined : filter_plan_type,
    },
  });
};

export const GetPendingReport = async (limit = 20, skip = 0) => {
  return await API.get(`report/pendings?limit=${limit}&skip=${skip}`);
};

export const MarkAsPaid = async (id: number) => {
  return await API.post(`report/mark-paid`, {
    id,
  });
};

//
export const GetSearchResult = async (
  src_term: string,
  filter:
    | "All"
    | "Users"
    | "Loans"
    | "Deposits"
    | "Kycs"
    | "Loan_Pending"
    | "Deposit_Pending" = "All"
) => {
  return API.get(
    `/admin/get-search-result?src_term=${src_term}&filter=${filter}`
  );
};

// support

export const GetCompanyUPIAddress = async () => {
  return API.get("/settings/company-vpas");
};
