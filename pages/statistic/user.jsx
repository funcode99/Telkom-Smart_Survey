import { useState, useEffect } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import moment from "moment";
import styles from "./Statistic.module.scss";

import { auth } from "../../utils/useAuth";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getActivity } from "../../utils/api/activityApi";
import options from "./options";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Toolbar from "../../components/global/Toolbar";

const ActiveUser = () => {
    const [menu, setMenu] = useState("daily");
    // const [isLoading, setLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const router = useRouter();

    console.log(router.query);

    const getActiveUser = (menuArg) => {
        let interval;
        let gte;
        let lte;

        switch (menuArg) {
            case "daily":
                interval = "day";
                gte = moment().startOf("month").format("YYYY-MM-DD");
                lte = moment().endOf("month").format("YYYY-MM-DD");
                break;
            case "monthly":
                interval = "month";
                gte = moment().startOf("year").format("YYYY-MM-DD");
                lte = moment().endOf("year").format("YYYY-MM-DD");
                break;
            case "yearly":
                interval = "year";
                gte = "2021-01-01";
                lte = "2030-12-12";
                break;

            default:
                break;
        }

        const params = {
            aggs: {
                date_by_name: {
                    date_histogram: {
                        field: "@timestamp",
                        interval,
                    },
                },
            },
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                "@timestamp": {
                                    gte,
                                    lte,
                                },
                            },
                        },
                    ],
                },
            },
            size: 0,
        };

        setDataList([]);
        getActivity({ event: "registered" in router.query ? "register" : "login", params: JSON.stringify(params) })
            .then((resolve) => {
                console.log(resolve);
                if (menu !== menuArg) return;
                if (menuArg === "monthly") {
                    const list = Array.from(Array(12), () => ({ doc_count: 0 }));
                    resolve.date_by_name.buckets.map((bucket) => {
                        list[parseInt(moment(bucket.key_as_string).format("MM")) - 1] = bucket;
                    });

                    console.log(resolve.date_by_name.buckets, list);
                    setDataList(list);
                } else {
                    setDataList(resolve.date_by_name.buckets);
                }
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            });
    };

    const dataFormat = (canvas) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, "rgba(139, 116, 234, 0.5)");
        gradient.addColorStop(0.6, "rgba(139, 116, 234, 0.2)");
        gradient.addColorStop(0.85, "rgba(139, 116, 234, 0.05)");
        gradient.addColorStop(1, "rgba(244, 131, 123, 0.0)");

        let labels = [];
        switch (menu) {
            case "daily":
                labels = Array.from(Array(parseInt(moment().endOf("month").format("D"))), (_, i) => (i < 9 ? `0${i + 1}` : i + 1));
                break;
            case "monthly":
                labels = ["January", "February", "Maret", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
                break;
            case "yearly":
                labels = Array.from(Array(10), (_, i) => 2021 + i);
                break;
            default:
                break;
        }

        return {
            labels,
            datasets: [
                {
                    fill: true,
                    backgroundColor: gradient,
                    data: dataList.map((data) => data.doc_count),
                    borderColor: "rgb(139, 116, 234)",
                    borderWidth: 5,
                },
            ],
        };
    };

    useEffect(() => {
        getActiveUser(menu);
    }, [menu]);

    return (
        <Sidebar>
            <div className={styles.header + " " + styles.header_flex}>
                <Link href="/statistic">
                    <a>
                        <IoMdArrowRoundBack className={styles.back} />
                    </a>
                </Link>
                <h3>{"registered" in router.query ? "Registered" : "Active"} User</h3>
            </div>
            <Toolbar
                activeMenu={menu}
                menuStyle={{ width: "17rem" }}
                menuList={[
                    {
                        label: "Daily",
                        value: "daily",
                        onClick: () => {
                            setMenu("daily");
                        },
                    },
                    {
                        label: "Monthly",
                        value: "monthly",
                        onClick: () => {
                            setMenu("monthly");
                        },
                    },
                    {
                        label: "Yearly",
                        value: "yearly",
                        onClick: () => {
                            setMenu("yearly");
                        },
                    },
                ]}
            />
            <div className={styles.chart}>
                <Line data={dataFormat} options={options(dataList.length)} height={500} />
            </div>
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(ActiveUser);
