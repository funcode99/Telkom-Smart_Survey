import Link from "next/link";
import PropTypes from "prop-types";
import Image from "next/image";
import LinesEllipsis from "react-lines-ellipsis";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./VoucherCard.module.scss";

import Dummy from "../../public/images/survey/default_banner.jpg";

const color = {
    verified: {
        background: "#DFFFF0",
        color: "#0EB37E",
    },
    pending: {
        background: "#FFF0E2",
        color: "#FF7E00",
    },
    reject: {
        background: "#FFE2E2",
        color: "#DA0000",
    },
};

const Content = ({ voucher = {}, onClick = () => null, style, header, footer }) => {
    const { t } = useTranslation("common");

    const getStatus = (status) => {
        switch (status) {
            case "verified":
                return t("status_verified");
            case "pending":
                return t("status_pending");
            case "rejected":
                return t("status_rejected");
            default:
                return status;
        }
    };

    return (
        <>
            <section className={styles.container} onClick={() => onClick(voucher)} style={style}>
                <div className={styles.image}>
                    {voucher._id ? (
                        <>
                            <LazyLoadImage alt="banner" src={voucher.banner || Dummy.src} visibleByDefault={!voucher.banner} effect="blur" />
                            {voucher.qty && <span className={styles.quantity}>{voucher.qty}x</span>}
                        </>
                    ) : (
                        <Skeleton height="10rem" style={{ transform: "translateY(-2px)" }} />
                    )}
                </div>
                <div className={styles.content}>
                    {header || (
                        <div className={styles.header}>{voucher._id ? <label>{voucher.price || 0} Poin</label> : <Skeleton width={50} />}</div>
                    )}
                    <div className={styles.title}>
                        {voucher._id ? (
                            <>
                                <div className={styles.name}>
                                    <LinesEllipsis
                                        text={voucher.itemName}
                                        maxLine="2"
                                        ellipsis="..."
                                        data-tip={voucher.itemName}
                                        data-for={voucher._id}
                                    />
                                </div>
                                {voucher.merchant?.logo && (
                                    <div className={styles.logo}>
                                        {voucher.merchant?.logo && <Image src={voucher.merchant?.logo} width={48} height={48} alt="logo" />}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Skeleton width="100%" height={30} />
                        )}
                    </div>
                    {footer || (
                        <div className={styles.footer}>
                            <span className={styles.timestamp}>
                                {t(voucher.status === "verified" ? "expired" : "created")} {moment(voucher.expDate).format("DD/MM/YY")}
                            </span>
                            <span className={styles.status} style={color[voucher.status]}>
                                {getStatus(voucher.status)}
                            </span>
                        </div>
                    )}
                </div>
            </section>
            <ReactTooltip place="bottom" delayShow={1000} className={styles.tooltip} id={voucher._id} globalEventOff="click" />
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
    voucher: PropTypes.shape({
        _id: PropTypes.string,
        banner: PropTypes.string,
        itemId: PropTypes.string,
        itemName: PropTypes.string,
        desc: PropTypes.string,
        price: PropTypes.number,
    }),
    href: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    header: PropTypes.node,
    footer: PropTypes.node,
};

Card.propTypes = props;
Content.propTypes = props;

export default Card;
