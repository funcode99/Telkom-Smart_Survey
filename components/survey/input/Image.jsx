import PropTypes from "prop-types";
import Image from "next/image";
import { toast } from "react-toastify";
import styles from "./Image.module.scss";

import { uploadFile, toBase64 } from "../../../utils/functions";
import IconUpload from "../../../public/images/survey/upload_icon.svg";
import { HiOutlineTrash } from "react-icons/hi";

const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const ImageComponent = ({ answer, setAnswer }) => {
    return (
        <div
            className={styles.container}
            onClick={async () => {
                const file = await uploadFile();
                if (file.error) return toast.error(file.error);

                console.log(file.metadata);
                setAnswer(file.data);
            }}
            onDragEnter={(e) => preventDefault(e)}
            onDragOver={(e) => preventDefault(e)}
            onDragLeave={(e) => preventDefault(e)}
            onDrop={(e) => {
                preventDefault(e);
                const file = e.dataTransfer?.files?.[0];

                if (!file?.type.includes("image")) {
                    return toast.error("File is not image.");
                }
                if (file?.size > 1000000) {
                    return toast.error(`Maximum size is 1000kb.`);
                }

                toBase64(file)
                    .then((resolve) => {
                        setAnswer(resolve);
                    })
                    .catch((reject) => {
                        console.log(reject);
                        toast.error(reject);
                    });
            }}
        >
            {answer ? (
                <div className={styles.file_image}>
                    <div>
                        <Image alt="image" src={`data:image/jpeg;base64,${answer}`} layout="fill" objectFit="contain" />
                    </div>
                    <HiOutlineTrash
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnswer(null);
                        }}
                    />
                </div>
            ) : (
                <>
                    <IconUpload />
                    <span>Choose or drop your image</span>
                    <p>Available formats JPG, PNG, Webp</p>
                </>
            )}
        </div>
    );
};

ImageComponent.propTypes = {
    nowIndex: PropTypes.number,
    answer: PropTypes.number,
    setAnswer: PropTypes.func,
};

export default ImageComponent;
