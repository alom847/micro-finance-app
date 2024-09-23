export const showAsCurrency = (amount: number) => {
  return Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "inr",
  });
};
