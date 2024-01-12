import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { Highlight, Provider } from "@zekro/react-highlight";
import { toast } from "react-toastify";
import styles from "./Searchbox.module.scss";

import { searchSurvey, searchStore } from "../../../utils/api/surveyApi";
import useOverlay from "../../../utils/useOverlay";
import { useRecoilValue } from "recoil";
import { userProfile } from "../../../utils/recoil";
import { MdClose } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import Dummy from "../../../public/images/survey/default_banner.jpg";

import Spinner from "../../global/Spinner";

const Searchbox = ({ isResponsive }) => {
    const [input, setInput] = useState("");
    const [isSearch, setSearch] = useState(true);
    const [surveyList, setSurveyList] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [surveyLoading, setSurveyLoading] = useState(false);
    const [storeLoading, setStoreLoading] = useState(false);
    const profile = useRecoilValue(userProfile);
    useOverlay(isSearch, setSearch, "header-searchbar");

    const searchHandler = (input) => {
        setSurveyList([]);
        setStoreList([]);
        setSurveyLoading(true);
        setStoreLoading(true);

        searchSurvey({ search: input, row: 3, userId: profile.userId, level: profile.level })
            .then((resolve) => {
                console.log(resolve);
                setSurveyList(resolve.lists);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSurveyLoading(false);
            });

        searchStore({ search: input, row: 3, userId: profile.userId, level: profile.level })
            .then((resolve) => {
                console.log(resolve);
                setStoreList(resolve.lists);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setStoreLoading(false);
            });
    };

    useEffect(() => {
        if (input) {
            searchHandler(input);
        } else {
            setSurveyList([]);
            setStoreList([]);
        }
    }, [input]);

    return (
        <div className={styles.container} id="header-searchbar">
            <div className={styles.input_container + (isResponsive ? " " + styles.mobile : "")}>
                {!isResponsive && (
                    <input
                        placeholder="Cari surveymu disini"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onClick={() => setSearch(true)}
                    />
                )}

                {input ? (
                    <MdClose
                        onClick={() => {
                            setSearch(false);
                            setInput("");
                            setSurveyList([]);
                            setStoreList([]);
                        }}
                    />
                ) : (
                    <AiOutlineSearch />
                )}
            </div>
            {isSearch && input && (
                <Provider keywords={[input]} highlightClassName={styles.highlight}>
                    <div className={styles.result_container}>
                        <div className={styles.result_section}>
                            <div className={styles.result_title}>
                                <label>Surveymu</label>
                                <span onClick={() => setSearch(false)}>
                                    <Link href={"/survey-list?search=" + input}>Lihat Semua</Link>
                                </span>
                            </div>
                            {surveyLoading ? (
                                <Spinner size={50} />
                            ) : (
                                <div className={styles.list_container}>
                                    {surveyList.map((result) => {
                                        return (
                                            <Link href={"/edit-survey/" + result._id} key={result._id}>
                                                <a>
                                                    <div className={styles.list} onClick={() => setSearch(false)}>
                                                        <Image src={result.surveyImage || Dummy.src} width={30} height={20} alt="banner" />
                                                        <span>
                                                            <Highlight content={result.title} />
                                                        </span>
                                                    </div>
                                                </a>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className={styles.result_section}>
                            <div className={styles.result_title}>
                                <label>Toko Template</label>
                                <span onClick={() => setSearch(false)}>
                                    <Link href={"/store/detail?search=" + input}>Lihat Semua</Link>
                                </span>
                            </div>
                            {storeLoading ? (
                                <Spinner size={50} />
                            ) : (
                                <div className={styles.list_container}>
                                    {storeList.map((result) => {
                                        return (
                                            <Link href={"/detail-survey/" + result._id} key={result._id}>
                                                <a>
                                                    <div className={styles.list} key={result._id} onClick={() => setSearch(false)}>
                                                        <Image src={result.surveyImage || Dummy.src} width={30} height={20} alt="banner" />
                                                        <span>
                                                            <Highlight content={result.title} />
                                                        </span>
                                                    </div>
                                                </a>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </Provider>
            )}
        </div>
    );
};

Searchbox.propTypes = {
    isResponsive: PropTypes.bool,
};

export default Searchbox;
