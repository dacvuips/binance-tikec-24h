"use client";
import { symbols } from "@/constants/constans";
import {
  handleAddMark,
  handleGetUnitIcon,
  handleImageSymbol,
  handleMark,
  parseNumber,
} from "@/function/handle-data";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { MdArrowDownward, MdOutlineAttachMoney } from "react-icons/md";
export default function Home() {
  const [getData, setGetData] = useState<any>([]);
  const [symbolData, setSymbolData] = useState<any>([]);
  const [isSort, setIsSort] = useState<boolean>(false);
  const [symbolsMap, setSymbolsMap] = useState<any>([]);
  const domainBinance = "https://data-api.binance.vision/api/v3/ticker/24hr";
  const getDataBinance = async () => {
    // handle get data from binance
    await axios
      .get(`${domainBinance}?symbols=${JSON.stringify(handleMark(symbols))}`, {
        redirect: "follow",
      } as any)
      .then(function (response) {
        setGetData(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    // handle auto refresh data
    getDataBinance();
    setInterval(() => {
      getDataBinance();
    }, 4000);

    return () => {};
  }, []);

  useEffect(() => {
    // handle sort data
    if (isSort) {
      setSymbolData(
        getData.sort((a: any, b: any) => {
          return a.quoteVolume - b.quoteVolume;
        })
      );
    } else {
      setSymbolData(
        getData.sort((a: any, b: any) => {
          return b.quoteVolume - a.quoteVolume;
        })
      );
    }
  }, [getData, isSort, symbolsMap]);

  useEffect(() => {
    // handle check deference data
    const data =
      JSON.parse(localStorage.getItem("symbolData") as any) || symbolData;

    if (!data || !data[0]?.symbol) {
      localStorage.setItem("symbolData", JSON.stringify(symbolData));
      return;
    }

    const dataMap = data?.map((item: any) => {
      const findChange = symbolData?.find((x: any) => {
        if (x.symbol == item.symbol) {
          return x;
        }
      });

      if (findChange?.lastPrice != item.lastPrice) {
        return { ...findChange, isChange: true };
      } else {
        return { ...findChange, isChange: false };
      }
    });

    localStorage.setItem("symbolData", JSON.stringify(dataMap));

    setSymbolsMap(dataMap);
  }, [symbolData]);

  const RenderDate = useMemo(
    () =>
      symbolsMap?.map((item: any, index: number) => {
        const symbolIconHasColor = handleImageSymbol(item.symbol, true)
          ?.icon as string;
        const symbolIconNotColor = handleImageSymbol(item.symbol, false)
          ?.icon as string;
        const symbolAndUnit = handleAddMark(item.symbol) as any;
        const unitIcon = handleGetUnitIcon(symbolAndUnit)?.icon as string;
        const priceChangePercent = parseFloat(item.priceChangePercent);
        return (
          <tr className="font-normal h-8   " key={index}>
            <td className="font-bold pl-3 ">
              <div className="flex item-center">
                <img
                  alt="logo"
                  className="w-4 h-4 mr-3"
                  src={symbolIconHasColor}
                />
                <span
                  className={`leading-4 ${
                    item.isChange ? "text-teal-400" : ""
                  }`}
                >
                  {symbolAndUnit}
                </span>
              </div>
            </td>
            <td className=" ">
              <div className="flex items-center justify-end">
                <img alt="logo" className="w-4 h-4 mr-1" src={unitIcon} />
                <span>{parseNumber(item.lastPrice)}</span>
              </div>
            </td>
            <td
              className={`text-right ${
                item.priceChangePercent >= 0
                  ? " text-green-500"
                  : " text-red-500"
              }`}
            >{`${priceChangePercent.toFixed(2)}%`}</td>
            <td className="text-right">
              <div className="flex items-center justify-end">
                <img
                  alt="logo"
                  className="w-4 h-4 mr-1"
                  src={symbolIconNotColor}
                />
                <span>{parseNumber(item.volume)}</span>
              </div>
            </td>
            <td className="text-right pr-3 ">
              <div className="flex items-center justify-end">
                <i className="text-lg">
                  <MdOutlineAttachMoney />
                </i>

                <span>{parseNumber(item.quoteVolume)}</span>
              </div>
            </td>
          </tr>
        );
      }),
    [symbolData[0]?.symbol, getData, isSort, symbolData]
  );

  return (
    <main className="flex    w-full  h-full justify-center py-32  bg-[#fff]">
      <table className="table-auto  font-light border rounded-md overflow-hidden bg-[#f5f6f6]">
        <thead>
          <tr className="bg-[#eceded] h-9   ">
            <th className="text-left min-w-44 pl-3">{"Pair"}</th>
            <th className="text-right min-w-32">{"Price"}</th>
            <th className="text-right min-w-44">{"24h Change"}</th>
            <th className="text-right min-w-44">{"24h Volume(Coin)"}</th>
            <th className="text-right min-w-44 pr-3 ">
              <div className="flex items-center justify-end">
                <button onClick={() => setIsSort(!isSort)}>
                  <MdArrowDownward />
                </button>
                {"24h USDT"}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>{RenderDate}</tbody>
      </table>
    </main>
  );
}
