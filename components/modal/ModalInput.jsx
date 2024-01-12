import PropTypes from "prop-types";
import styles from "./ModalInput.module.scss";
import { useRef, useEffect } from "react";

import Input from "../global/Input";
import { Button, ButtonContainer } from "../global/Button";

const ModalInput = ({ title, data = [], button = [], isLoading, onSubmit }) => {
    const formRef = useRef();

    useEffect(() => {
        console.log(formRef.current?.getElementsByTagName("button"));
    }, [formRef]);

    return (
        <form
            ref={formRef}
            onSubmit={(e) => {
                console.log("submit nih");
                onSubmit(e);
            }}
        >
            {title && (
                <div className={styles.header}>
                    <h3>{title}</h3>
                </div>
            )}
            <div className={styles.body}>
                {data.map((object, i) => {
                    return (
                        <Input
                            key={i}
                            label={object.label}
                            type={object.type}
                            value={object.value}
                            isDisabled={object.isDisabled}
                            isRequired={object.isRequired}
                            onChange={(e) => object.onChange(e)}
                        >
                            {object.customInput}
                        </Input>
                    );
                })}
            </div>
            <ButtonContainer>
                {button.map((buttonData, i) => {
                    return (
                        <Button
                            type={buttonData.canSubmit ? "submit" : "button"}
                            onClick={buttonData.onClick ? buttonData.onClick : null}
                            key={i}
                            style={{ flex: 1, ...buttonData.style }}
                            isDisabled={buttonData.canDisabled && isLoading}
                            isTransparent={buttonData.isTransparent}
                        >
                            {buttonData.label}
                        </Button>
                    );
                })}
            </ButtonContainer>
        </form>
    );
};

ModalInput.propTypes = {
    title: PropTypes.string,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool,
                PropTypes.exact({
                    label: PropTypes.string,
                    value: PropTypes.string,
                }),
            ]),
            type: PropTypes.string,
            onChange: PropTypes.func,
            isSelect: PropTypes.bool,
            isLoading: PropTypes.bool,
            isDisabled: PropTypes.bool,
            customInput: PropTypes.node,
            options: PropTypes.arrayOf(
                PropTypes.exact({
                    label: PropTypes.string,
                    value: PropTypes.string,
                })
            ),
        })
    ),
    button: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            canDisabled: PropTypes.bool,
        })
    ),
    onSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default ModalInput;
