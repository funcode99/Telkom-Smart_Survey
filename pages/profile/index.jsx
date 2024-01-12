import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "./Profile.module.scss";

import { updateUser } from "../../utils/api/userApi";
import { auth } from "../../utils/useAuth";
import { userProfile } from "../../utils/recoil";
import { useRecoilState } from "recoil";
import { getUserAnswer } from "../../utils/api/answerApi";
import { uploadFile } from "../../utils/functions";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import { Button } from "../../components/global/Button";
import Input from "../../components/global/Input";
import Pagination from "../../components/global/Pagination";
import Spinner from "../../components/global/Spinner";
import Modal from "../../components/profile/Modal";
import TableList from "../../components/global/TableList";
import { PageHeader as Header } from "../../components/global/Header";

const Profile = () => {
    const [input, setInput] = useState({ fullname: "", mobile: "", email: "" });
    const [newImage, setNewImage] = useState();
    const [answerList, setAnswerList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [profile, setProfile] = useRecoilState(userProfile);
    const router = useRouter();
    const { t } = useTranslation("profile");

    const getData = (page) => {
        setLoading(true);
        getUserAnswer({ userId: profile.userId, page })
            .then((resolve) => {
                setAnswerList(resolve.lists);
                setTotalData(resolve.totalData);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const uploadHandler = async () => {
        const image = await uploadFile();
        if (image.error) return toast.error(image.error);
        setNewImage(image.data);
    };

    const saveHandler = () => {
        setSubmitLoading(true);

        const newInput = { ...input };
        if (newImage) newInput.profile_picture = newImage;

        updateUser(newInput, profile.userId)
            .then((resolve) => {
                toast.info("Update profile success.");
                setProfile(resolve);
                setNewImage("");
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSubmitLoading(false);
            });
    };

    useEffect(() => {
        getData(page);
    }, [page]);

    useEffect(() => {
        setInput({
            fullname: profile.fullname,
            mobile: profile.mobile,
            email: profile.email,
        });
    }, [profile]);

    const loadImage = () => {
        if (newImage) {
            return `data:image/jpeg;base64,${newImage}`;
        } else if (profile.profilePicture) {
            return profile.profilePicture;
        }
    };

    return (
        <Sidebar>
            <Header title="Profile" />
            <div className={styles.container}>
                <div className={styles.profile_container}>
                    <h3>Your Profile</h3>
                    <Input label="Profile Picture">
                        <div className={styles.profile_picture} onClick={uploadHandler}>
                            {(profile.profilePicture || newImage) && <Image src={loadImage()} alt="avatar" layout="fill" />}
                        </div>
                    </Input>
                    <Input label="Name" value={input.fullname} onChange={(e) => setInput({ ...input, fullname: e.target.value })} isRequired />
                    <Input label="Mobile" value={input.mobile} onChange={(e) => setInput({ ...input, mobile: e.target.value })} />
                    <Input label="Email" value={input.email} onChange={(e) => setInput({ ...input, email: e.target.value })} isRequired />
                    <Button
                        style={{
                            height: "2.625rem",
                            width: "10rem",
                            marginTop: "2rem",
                            letterSpacing: "0.1rem",
                        }}
                        isDisabled={
                            !input.fullname ||
                            !input.email ||
                            (input.fullname === profile.fullname && input.email === profile.email && input.mobile === profile.mobile && !newImage)
                        }
                        isLoading={submitLoading}
                        onClick={saveHandler}
                    >
                        SAVE CHANGES
                    </Button>
                </div>
                <div className={styles.survey_container}>
                    <h3>Completed Surveys</h3>
                    {isLoading ? (
                        <Spinner style={{ padding: "6rem 0 5rem" }} />
                    ) : (
                        <div className={styles.table_container}>
                            <TableList
                                list={answerList}
                                header={[t("survey_title"), t("survey_date")]}
                                body={answerList.map((answer) => {
                                    console.log(answer);
                                    return [
                                        { value: answer.surveyName, style: { fontWeight: "bold" } },
                                        { value: moment(answer.completedDate).format("D MMM, YYYY"), style: { fontWeight: "bold" } },
                                    ];
                                })}
                                onClick={(answer) => {
                                    router.push("/profile/answer/" + answer.answerId);
                                }}
                                isDisabled={(answer) => !answer.surveyId}
                                hide_action
                            />
                        </div>
                    )}
                    <div className={styles.pagination}>
                        <Pagination
                            count={totalData}
                            page={page}
                            setPage={(page) => {
                                setPage(page);
                            }}
                            row={7}
                        />
                    </div>
                </div>
            </div>
            <Modal />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
    },
});

export default auth(Profile);
