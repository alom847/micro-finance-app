export const formateId = (
  id: number,
  type: "User" | "Loan" | "FD" | "RD" | "WITHDRAWAL" = "User"
) => {
  switch (type) {
    case "User":
      return `HMU${id.toString().padStart(6, "0")}`;
    case "RD":
      return `HMR${id.toString().padStart(6, "0")}`;
    case "FD":
      return `HMF${id.toString().padStart(6, "0")}`;
    case "Loan":
      return `HML${id.toString().padStart(6, "0")}`;
    case "WITHDRAWAL":
      return `HMW${id.toString().padStart(2, "0")}`;
  }
};
