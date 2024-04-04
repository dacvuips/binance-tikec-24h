import { symbolsListUnitIcon, symbolsListWithIcon } from "@/constants/constans";

const handleMark = (symbols: string[]) => {
  // handle mark symbol "/"
  const symbolList = symbols.map((symbol: string) => {
    return symbol.replace("/", "");
  });
  return symbolList;
};
const handleImageSymbol = (symbol: string, hasColor: boolean) => {
  // handle get image symbol
  const sliceSymbolString = symbol?.slice(0, 5);
  if (hasColor) {
    return symbolsListWithIcon.find((item) => {
      if (sliceSymbolString?.includes(item.value)) {
        return item;
      }
    });
  } else {
    return symbolsListUnitIcon.find((item) => {
      if (sliceSymbolString?.includes(item.value)) {
        return item;
      }
    });
  }
};
const handleAddMark = (symbol?: string) => {
  // handle add mark symbol "/"
  const data = symbolsListWithIcon.map((item) => {
    if (symbol?.match(item.value)) {
      return symbol?.replace(item.value, item.value + "/");
    }
  });

  return data.find((item) => {
    if (item && item.slice(-1) !== "/") {
      return item;
    }
  });
};
const handleGetUnitIcon = (symbol: string) => {
  // handle get unit icon
  return symbolsListUnitIcon.find((item) => {
    const sliceSymbolString = symbol?.slice(-5);

    if (sliceSymbolString?.includes(item.value)) {
      return item;
    }
  });
};

const parseNumber = (number: string, minimumFractionDigits?: number) => {
  // handle parse number get 2 decimal
  return parseFloat(number).toLocaleString("en-US", {
    minimumFractionDigits: minimumFractionDigits || 2,
  });
};

export {
  handleAddMark,
  handleGetUnitIcon,
  handleImageSymbol,
  handleMark,
  parseNumber,
};
