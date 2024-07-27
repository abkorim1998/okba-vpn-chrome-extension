import { useEffect, useState } from "react";
import { getTableData } from "./helpers/ablibary";
import { FaSignal } from "react-icons/fa";


type serverListProps = { country?: string, anonymity?: string, protocol?: string }
type serverListType = { host: string, port: number }[]
export function PageProvider() {

    const [proxyPerformance, setProxyPerformance] = useState<{ proxy: { host: string, port: number }, ping: number, isWorking: boolean, running: boolean }[]>([]);

    useEffect(() => {
        getServerList()
            .then((datalist) => {

                // setList(datalist)
                // console.log(datalist)


                handleTestProxies({ proxies: datalist }).then(results => {
                    setProxyPerformance(results);
                })

            })
    }, [])



    const pingProxy = async (proxy: { host: string, port: number }) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const startTime = Date.now();
        try {
            await fetch(`http://${proxy.host}:${proxy.port}`, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal,
            });
            const endTime = Date.now();
            clearTimeout(timeoutId);
            return { ping: Math.round(endTime - startTime), isWorking: true };
        } catch (error) {
            clearTimeout(timeoutId);
            // console.error(`Error pinging proxy ${proxy.host}:${proxy.port}`, error);
            return { ping: Number.MAX_VALUE, isWorking: false }; // Indicate a failed ping with a very high time
        }
    };


    const handleTestProxies = async ({ proxies }: { proxies: serverListType }) => {
        const results = await Promise.all(proxies.map(async (proxy) => {
            const response = await pingProxy(proxy);
            return { proxy: { host: proxy.host, port: proxy.port }, ping: response.ping, isWorking: response.ping < 300, running: response.isWorking };
        }));
        return results
    };




    // async function getServerList({
    //     country = "US",
    //     anonymity = "elite",
    //     protocol = "https"
    // } = {}) {
    //     try {
    //         var table = await getTableData({
    //             url: `https://proxyhub.me/en/${country.toLowerCase()}-${protocol}-proxy-list.html`,
    //             tableSelector: '#main > div > div.list.table-responsive > table',
    //             fromRow: 1,
    //         });
    //         var serverList = table.map(row => {
    //             if (row[1]) {
    //                 return `${row[0]}:${row[1]}`;
    //             } else {
    //                 return null;
    //             }
    //         }).filter(server => server != null);

    //         return serverList;
    //     } catch (error) {
    //         return [];
    //     }

    // }

    async function getServerList({ country = "US", anonymity = "elite", protocol = "http" }: serverListProps = {}): Promise<serverListType> {
        try {
            const response = await fetch(`https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&country=${country}&protocols=${protocol}&anonymityLevel=${anonymity}`);
            const { data } = await response.json() as { data: any[] };
            const serverList = data.map((e: any) => {
                return {
                    host: e.ip as string,
                    port: e.port as number
                }
            });
            return serverList;
        } catch (error) {
            return [];
        }
    }


    const getSignalIcon = (ping: number) => {
        if (ping < 100) {
            return <FaSignal style={{ color: 'green' }} />;
        } else if (ping < 300) {
            return <FaSignal style={{ color: 'yellow' }} />;
        } else {
            return <FaSignal style={{ color: 'red' }} />;
        }
    };

    return (
        <div>
            <ul>
                {proxyPerformance.map((result, index) => (
                    <li
                        key={index}
                        title={`${result.ping} ms`}
                        className={`flex justify-between gap-2 items-center p-2 border-b border-gray-300 ${result.isWorking ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex gap-2">
                            {getSignalIcon(result.ping)}
                            <span>{result.proxy.host}</span>
                        </div>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full"
                            onClick={() => {
                                chrome.runtime.sendMessage({ type: "setProxy", proxy: result.proxy });
                            }}
                        >Connect</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}