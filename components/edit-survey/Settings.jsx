import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Image from "next/image";
import Select from "react-select";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import styles from "./Settings.module.scss";

import DateIcon from "../../public/images/survey/date_icon.svg";
import { DateTimePicker } from "@material-ui/pickers";
import { convertRupiah, getCategory, timeout } from "../../utils/functions";
import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { editSurvey, deleteSurvey, setGroupSurvey, removeGroupSurvey } from "../../utils/api/surveyApi";
import useModal from "../../utils/useModal";

import Tooltip from "../global/Tooltip";
import { Button, ButtonContainer } from "../global/Button";
import RadioButton from "../global/RadioButton";
import Dropdown from "../global/Dropdown";
import ModalPopup from "./modal/ModalPopup";

const setInitial = (survey = {}) => {
    return {
        title: survey.title || "",
        description: survey.description || "",
        fillLimit: survey.fillLimit || "once",
        respondentType: survey.respondentType || "guest",
        startDate: survey.timer?.startDate || null,
        endDate: survey.timer?.endDate || null,
        duration: survey.timer?.duration || 0,
        isSelling: survey.isSelling || "none",
        categoryId: survey.category?.categoryId,
        price: survey.price || 0,
    };
};

const Settings = ({ survey, updateData, tooltip }) => {
    const [input, setInput] = useState(setInitial());
    const [isLoading, setLoading] = useState({
        update: false,
        delete: false,
        group: false,
        access: false,
    });
    const [category, setCategory] = useState(null);
    const [group, setGroup] = useState([]);
    const profile = useRecoilValue(userProfile);
    const groupList = profile.groups?.map((group) => {
        return {
            label: group.groupName,
            value: group.groupId,
        };
    });
    const { setModal: setModalReward } = useModal("add-reward");
    const { setData: setModalRefund } = useModal("refund-reward");
    const { setModal: setModalDelete } = useModal("delete-survey");
    const router = useRouter();
    const categoryList = getCategory(router.locale);
    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");

    useEffect(() => {
        console.log(survey);

        if (survey.category?.categoryId) setCategory({ label: survey.category.category, value: survey.category.categoryId });

        setInput(setInitial(survey));
    }, [survey]);

    useEffect(() => {
        const groupContainer = [];
        survey?.groups?.forEach((group) => {
            groupContainer.push({ label: group.groupName, value: group.groupId });
        });
        setGroup(groupContainer);
    }, [survey.groups]);

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading({ ...isLoading, update: true });

        editSurvey(input, router.query.surveyId)
            .then((resolve) => {
                console.log(resolve);
                updateData({
                    ...input,
                    category,
                    timer: { startDate: input.startDate, endDate: input.endDate, duration: input.duration },
                });
                toast.info(t("success_update_survey"));
            })
            .catch((reject) => {
                console.log(reject);
                setInput(setInitial(survey));
                toast.error(reject);
            })
            .finally(() => {
                setLoading({ ...isLoading, update: false });
            });
    };

    const deleteHandler = () => {
        setLoading({ ...isLoading, delete: true });

        deleteSurvey({ id: router.query.surveyId })
            .then(async () => {
                await timeout(1000);
                setLoading(false);
                toast.info(t("success_delete_survey"));
                router.replace("/survey-list");
                setLoading({ ...isLoading, delete: false });
                setModalDelete(false);
            })
            .catch((reject) => {
                console.log(reject);
                setLoading({ ...isLoading, delete: false });
                setModalDelete(false);
                toast.error(reject);
            });
    };

    const groupHandler = (groupId, newGroup) => {
        setLoading({ ...isLoading, group: true });
        setGroupSurvey({ groupIds: [groupId] }, router.query.surveyId)
            .then(() => {
                toast.info(t("success_set_group"));
                setGroup(newGroup);
                console.log(newGroup);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading({ ...isLoading, group: false });
            });
    };

    const groupHandlerMin = (groupId, newGroup) => {
        setLoading({ ...isLoading, group: true });
        removeGroupSurvey({ groupIds: [groupId] }, router.query.surveyId)
            .then(() => {
                toast.info(t("success_remove_group"));
                setGroup(newGroup);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading({ ...isLoading, group: false });
            });
    };

    return (
        <form onSubmit={submitHandler}>
            <div className={styles.settings}>
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{router.locale === "en" ? `${survey.type} ${t("setting_title")}` : `${t("setting_title")} ${survey.type}`}</label>
                    </div>
                    <input value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} required />
                </div>
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{t("setting_description")}</label>
                    </div>
                    <textarea value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })} required />
                </div>
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{t("setting_category")}</label>
                    </div>
                    <Dropdown
                        id="dropdown-category"
                        value={input.categoryId}
                        options={categoryList}
                        onSelect={(value) => setInput({ ...input, categoryId: value })}
                        style={{ width: "30rem", zIndex: 3 }}
                        isFloating
                    />
                </div>
                <div className={styles.settings_card}>
                    <div className={styles.title}>
                        <label>{router.locale === "en" ? `${survey.type} ${t("setting_period")}` : `${t("setting_period")} ${survey.type}`}</label>
                    </div>
                    <div className={styles.period_container}>
                        <RadioButton
                            className={styles.period_radio}
                            value={input.startDate || input.endDate ? "custom" : "timeless"}
                            onChange={(value) =>
                                setInput({
                                    ...input,
                                    startDate: value === "custom" ? moment() : null,
                                    endDate: value === "custom" ? moment().add(1, "days").format("YYYY-MM-DDTHH:mmZ") : null,
                                })
                            }
                            name="endDate"
                            list={[
                                { label: t("setting_timeless"), value: "timeless" },
                                { label: t("setting_custom_date"), value: "custom" },
                            ]}
                        />
                        <div className={styles.period_input_container}>
                            <div className={styles.period_input}>
                                <label>{t("setting_start_date")}</label>
                                <div className={styles.period_date}>
                                    <DateTimePicker
                                        TextFieldComponent={(prop) => {
                                            return <input onClick={prop.onClick} value={prop.value} onChange={prop.onChange} />;
                                        }}
                                        format="DD MMMM yyyy HH:mm"
                                        value={input.startDate ? moment(input.startDate).toDate() : null}
                                        onChange={(date) => {
                                            console.log(date.valueOf());
                                            setInput({
                                                ...input,
                                                startDate: date.format("YYYY-MM-DDTHH:mmZ"),
                                                endDate:
                                                    !input.endDate || date.valueOf() > moment(input.endDate).valueOf()
                                                        ? date.add(1, "days").format("YYYY-MM-DDTHH:mmZ")
                                                        : input.endDate,
                                            });
                                        }}
                                    />
                                    <DateIcon />
                                </div>
                            </div>
                            <div className={styles.period_input}>
                                <label>{t("setting_end_date")}</label>
                                <div className={styles.period_date}>
                                    <DateTimePicker
                                        TextFieldComponent={(prop) => {
                                            return <input onClick={prop.onClick} value={prop.value} onChange={prop.onChange} />;
                                        }}
                                        format="DD MMMM yyyy HH:mm"
                                        value={input.endDate ? moment(input.endDate).toDate() : null}
                                        onChange={(date) => {
                                            setInput({
                                                ...input,
                                                endDate: date.format("YYYY-MM-DDTHH:mmZ"),
                                                startDate:
                                                    !input.startDate || date.valueOf() < moment(input.startDate).valueOf()
                                                        ? date.substract(1, "days").format("YYYY-MM-DDTHH:mmZ")
                                                        : input.startDate,
                                            });
                                        }}
                                    />
                                    <DateIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {survey.type === "quiz" && (
                    <div className={styles.settings_card + " " + styles.center}>
                        <div className={styles.title}>
                            <label>Quiz Duration</label>
                        </div>
                        <input
                            className="input"
                            type="number"
                            value={input.duration}
                            onChange={(e) => setInput({ ...input, duration: e.target.value })}
                            required
                        />
                    </div>
                )}
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{t("setting_respondent")}</label>
                    </div>
                    <RadioButton
                        className={styles.radio}
                        value={input.respondentType}
                        onChange={(value) => setInput({ ...input, respondentType: value })}
                        name="respondentType"
                        list={[
                            { label: t("setting_anyone"), value: "guest" },
                            { label: t("setting_registered_only"), value: "registered" },
                        ]}
                    />
                </div>
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{t("setting_limit")}</label>
                        <Tooltip message={tooltip.limit} />
                    </div>
                    <RadioButton
                        className={styles.radio}
                        value={input.fillLimit}
                        onChange={(value) => setInput({ ...input, fillLimit: value })}
                        name="fillLimit"
                        list={[
                            { label: t("setting_once"), value: "once" },
                            { label: t("setting_unlimited"), value: "unlimited" },
                        ]}
                    />
                </div>
                <div className={styles.settings_card}>
                    <div className={styles.title}>
                        <label>{t("setting_reward")}</label>
                        <Tooltip message={tooltip.limit} />
                    </div>
                    {survey.transferPoint?.qty ? (
                        <div className={styles.reward_container}>
                            <div className={styles.reward}>
                                <div className={styles.point}>
                                    <span className={styles.left}>Reward Responden</span>
                                    <span className={styles.center}>{survey.transferPoint?.unit}</span>
                                    <span>{t_c("point")}</span>
                                </div>
                                <label>{convertRupiah(survey.transferPoint?.unit * survey.transferPoint?.qty * 100)}</label>
                            </div>
                            <div className={styles.reward}>
                                <div className={styles.point}>
                                    <span className={styles.left}>Total Responden</span>
                                    <span className={styles.center}>{survey.transferPoint?.qty}</span>
                                    <span>{t_c("point")}</span>
                                </div>
                                <button type="button" className={styles.refund} onClick={() => setModalRefund(survey.transferPoint)}>
                                    {t("setting_refund")}
                                </button>
                            </div>
                        </div>
                    ) : survey.voucherReward?.qty ? (
                        <div className={styles.reward_container}>
                            <div className={styles.reward_voucher}>
                                <div>
                                    <Image src={survey.voucherReward?.itemReward?.banner} alt="voucher" layout="fill" objectFit="cover" />
                                </div>
                                <span>{survey.voucherReward?.itemReward?.itemName}</span>
                            </div>
                            <div className={styles.reward}>
                                <div className={styles.point}>
                                    <span className={styles.left}>Total Responden</span>
                                    <span className={styles.center}>{survey.voucherReward?.qty}</span>
                                    <span>{t_c("voucher")}</span>
                                </div>
                                <button
                                    type="button"
                                    className={styles.refund}
                                    onClick={() =>
                                        setModalRefund({ ...survey.voucherReward?.itemReward, qty: survey.voucherReward?.qty, isVoucher: true })
                                    }
                                >
                                    {t("setting_refund")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setModalReward(true)}
                            isTransparent
                            style={{ fontSize: "0.75rem", width: "max-content", padding: "0.5rem 0.75rem" }}
                        >
                            {t("setting_reward_add")}
                        </Button>
                    )}
                </div>
                <div className={styles.settings_card + " " + styles.center}>
                    <div className={styles.title}>
                        <label>{t("setting_group")}</label>
                    </div>
                    <Select
                        styles={{
                            control: (styles) => {
                                return {
                                    ...styles,
                                    cursor: isLoading.group ? "wait" : "default",
                                };
                            },
                        }}
                        className={styles.dropdown}
                        classNamePrefix={styles.dropdown}
                        isMulti={true}
                        isClearable={false}
                        value={group}
                        placeholder={profile.userId !== survey.createdBy?.userId ? "Only survey creator can change this" : "Select..."}
                        isDisabled={profile.level === "user" && profile.userId !== survey.createdBy?.userId}
                        options={groupList}
                        onChange={(e) => {
                            if (group.length < e.length) {
                                groupHandler(e[e.length - 1].value, e);
                            } else {
                                group.forEach((groupData) => {
                                    const check = e.some((x) => groupData.value === x.value);
                                    if (!check) groupHandlerMin(groupData.value, e);
                                });
                            }
                        }}
                    />
                </div>
                {(!survey.sourceTemplate?.creatorId || survey.sourceTemplate?.creatorId === profile.userId) && (
                    <div className={styles.settings_card}>
                        <div className={styles.title}>
                            <label>{router.locale === "en" ? `${survey.type} ${t("setting_sell")}` : `${t("setting_sell")} ${survey.type}`}</label>
                            <Tooltip message={tooltip.sharing} />
                        </div>
                        <div className={styles.price_container}>
                            <RadioButton
                                className={styles.price_radio}
                                value={input.isSelling}
                                onChange={(value) =>
                                    setInput({
                                        ...input,
                                        isSelling: value,
                                        price: value === "sell" ? input.price : 0,
                                    })
                                }
                                name="isSelling"
                                list={[
                                    { label: t("setting_sell"), value: "sell" },
                                    { label: t("setting_free"), value: "share" },
                                    { label: t("setting_not_for_sell"), value: "none" },
                                ]}
                            />
                            <div className={styles.price_input}>
                                <div className={styles.input}>
                                    <div className={styles.left}>
                                        <span>{t_c("price")}</span>
                                    </div>
                                    <input
                                        type="number"
                                        min={0}
                                        value={input.isSelling === "none" ? 0 : input.price}
                                        onChange={(e) => {
                                            setInput({
                                                ...input,
                                                isSelling: parseInt(e.target.value) ? "sell" : "share",
                                                price: parseInt(e.target.value),
                                            });
                                        }}
                                    />
                                    <div className={styles.right}>
                                        <span>{t_c("point")}</span>
                                    </div>
                                </div>
                                <label>{convertRupiah(input.price * 100)}</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ButtonContainer style={{ height: "2.75rem", justifyContent: "flex-start" }}>
                <Button onClick={() => setModalDelete(true)} isTransparent style={{ textTransform: "capitalize" }}>
                    {t_c("delete")} {survey.type}
                </Button>
                <Button style={{ marginLeft: "auto" }} isLoading={isLoading.update} isSubmit>
                    {t_c("save")}
                </Button>
            </ButtonContainer>

            <ModalPopup
                modalIdentifier="delete-survey"
                title={t("warning_delete_title")}
                message={t("warning_delete_message")}
                buttonLabel={t_c("delete")}
                isLoading={isLoading.delete}
                onSubmit={deleteHandler}
            />
        </form>
    );
};

Settings.propTypes = {
    survey: PropTypes.object,
    updateData: PropTypes.func,
    deleteData: PropTypes.func,
    tooltip: PropTypes.shape({
        publish: PropTypes.string,
        limit: PropTypes.string,
        sharing: PropTypes.string,
    }),
};

export default Settings;
