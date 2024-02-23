import React, { useEffect, useRef, useState, useCallback } from "react";
import perspective from "@finos/perspective";
import { TIME_INDEX, SYMBOL, PRICE, QUANTITY, MARKET_MAKER, INSERTION_TIME } from "./constants/binance";

const worker = perspective.worker();
const initialData = [
    {
        [TIME_INDEX]: 1,
        [SYMBOL]: "AAPL",
        [PRICE]: 150.23,
        [QUANTITY]: 100,
        [MARKET_MAKER]: "XYZ",
        [INSERTION_TIME]: "2024-02-21T08:00:00"
    },
    {
        [TIME_INDEX]: 2,
        [SYMBOL]: "GOOGL",
        [PRICE]: 2800.45,
        [QUANTITY]: 50,
        [MARKET_MAKER]: "ABC",
        [INSERTION_TIME]: "2024-02-21T08:05:00"
    },
    {
        [TIME_INDEX]: 3,
        [SYMBOL]: "MSFT",
        [PRICE]: 300.67,
        [QUANTITY]: 75,
        [MARKET_MAKER]: "DEF",
        [INSERTION_TIME]: "2024-02-21T08:10:00"
    }
];

const PerspectiveTable = () => {
    const tableRef = useRef();
    const viewerRef = useRef(null);
    const [tableReady, setTableReady] = useState(false);
    const [viewerConfig, setViewerConfig] = useState({})
    const [data, setData] = useState();

    useEffect(() => {
        const loadData = async () => {
            worker
            .table(initialData)
            .then((table) => (tableRef.current = table))
            .then(() => setTableReady(true));
        };
        loadData();
    },[])

    const createView = useCallback(async () => {
        if (!tableRef.current) return;
        const view = await tableRef.current.view({
          row_pivots: [INSERTION_TIME],
          columns: [TIME_INDEX, SYMBOL, PRICE, QUANTITY, MARKET_MAKER, INSERTION_TIME ]
        });
        console.log(await view.to_json())
        setData(await view.to_json());
        view.on_update(async () => {setData(await view.to_json())});
      }, []);

    useEffect(() => {
        if (viewerRef.current && tableRef.current && tableReady) {
        // viewerRef.current.load(tableRef.current);
         //  viewerRef.current.restore(viewerConfig);
         // viewerRef.current.toggleConfig();
          createView();
        }
      }, [tableReady, createView]);



    if (!tableReady) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
        <perspective-viewer
          style={{ width: 500, height: 500 }}
          ref={data}
        ></perspective-viewer>
        </div>
    );
};

export default PerspectiveTable;
