import Link from "next/link";
import PropTypes from "prop-types";
import LinesEllipsis from "react-lines-ellipsis";
import { useTranslation } from "next-i18next";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import styles from "./Card.module.scss";

import { BiDownload } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Dummy from "../../public/images/survey/default_banner.jpg";

const background = {
    sell: {
        color: "#FF7E00",
        background: "#FFF7EC",
    },
    share: {
        color: "#A980F8",
        background: "#F1F0FF",
    },
    purchased: {
        color: "#115B79",
        background: "#ECFFFC",
    },
};

const Content = ({ survey = {}, onClick = () => null, style }) => {
    const { t } = useTranslation("common");
    console.log(survey);

    return (
        <>
            <section className={styles.main_container} onClick={() => onClick(survey)} style={style}>
                <div className={styles.image}>
                    {survey.title ? (
                        <LazyLoadImage src={survey.surveyImage || Dummy.src} visibleByDefault={!survey.surveyImage} />
                    ) : (
                        <Skeleton height="6rem" style={{ transform: "translateY(-2px)" }} />
                    )}
                </div>
                <div className={styles.container}>
                    <div className={styles.header_template}>
                        {survey._id ? (
                            <>
                                {survey.isSelling === "sell" && <label className={styles.point}>100 {t("point")}</label>}
                                <label style={background[survey.isSelling]}>
                                    {t(survey.isSelling === "sell" ? "template_paid" : "template_free")}
                                </label>
                            </>
                        ) : (
                            <Skeleton />
                        )}
                    </div>
                    <h2 className={styles.title}>
                        {survey.title ? (
                            <LinesEllipsis text={survey.title} maxLine="2" ellipsis="..." data-tip={survey.title} data-for={survey._id} />
                        ) : (
                            <Skeleton />
                        )}
                    </h2>
                    {(survey.sourceTemplate?.creatorName || survey.createdBy?.name) && (
                        <span className={styles.author}>
                            {t("template_by")} <b>{survey.sourceTemplate?.creatorName || survey.createdBy?.name}</b>
                        </span>
                    )}
                    <span className={styles.description}>
                        {survey.description ? (
                            <LinesEllipsis text={survey.description} maxLine="2" ellipsis="..." data-tip={survey.description} data-for={survey._id} />
                        ) : (
                            <Skeleton count={2} />
                        )}
                    </span>
                    {!survey.title ? (
                        <Skeleton />
                    ) : (
                        <div className={styles.footer_template}>
                            <BiDownload />
                            <span>
                                <b>{survey.totalUsed}</b> {t("used")}
                            </span>
                        </div>
                    )}
                </div>
            </section>
            <ReactTooltip place="bottom" delayShow={1000} className={styles.tooltip} id={survey._id} globalEventOff="click" />
        </>
    );
};

const Card = (props) => {
    if (!props.href) return <Content {...props} />;
    return (
        <Link href={props.href}>
            <a>
                <Content {...props} />
            </a>
        </Link>
    );
};

const props = {
    survey: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        totalQuestion: PropTypes.number,
        totalResult: PropTypes.number,
        surveyImage: PropTypes.string,
        createdBy: PropTypes.shape({
            name: PropTypes.string,
        }),
        groups: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(
                PropTypes.shape({
                    groupName: PropTypes.string,
                    groupId: PropTypes.string,
                })
            ),
        ]),
        category: PropTypes.shape({
            category: PropTypes.string,
            categoryId: PropTypes.string,
        }),
        tags: PropTypes.arrayOf(PropTypes.string),
        type: PropTypes.oneOf(["quiz", "survey"]),
        timestamps: PropTypes.string,
        _id: PropTypes.string,
    }),
    href: PropTypes.oneOfType[(PropTypes.string, PropTypes.bool)],
    onClick: PropTypes.func,
    header: PropTypes.node,
    footer: PropTypes.node,
    style: PropTypes.object,
};

Card.propTypes = props;
Content.propTypes = props;

export default Card;
