const calculateSellPieces = (
  sellType: "piece" | "carton",
  quantity: number,
  unitsPerPack: number
) => {
  return sellType === "carton" ? quantity * unitsPerPack : quantity;
};

export default calculateSellPieces;
