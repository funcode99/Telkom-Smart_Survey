import PropTypes from "prop-types";

import Input from "../../global/Input";

import styles from "./Range.module.scss";

const Range = ({ register, setValue, getValues, errors }) => {
    // const [minRef, setMinRef] = useState({});
    // const min = register("min", { required: true });
    // const max = register("max", { required: true });
    // const minLabel = register("minLabel", { required: true });
    // const maxLabel = register("maxLabel", { required: true });

    // useEffect(() => {
    //     setMinRef(register("min", { required: true }));
    // }, []);
    // console.log(register);
    return (
        <div className={styles.container}>
            <div className={styles.input}>
                <Input
                    controller={register("min", {
                        required: "Cannot be empty",
                        min: {
                            value: 1,
                            message: "Minimum value is 1",
                        },
                        max: {
                            value: 9,
                            message: "Maximum value is 9",
                        },
                        onChange: (e) => {
                            let value = e.target.value;
                            let max = getValues("max");

                            if (value > 9) {
                                max = 10;
                            } else if (!isNaN(value) && max <= value) {
                                max = value + 1;
                            }

                            setValue("max", parseInt(max));
                        },
                        setValueAs: (value) => {
                            let min = parseInt(value);

                            if (value < 1) {
                                min = 1;
                            } else if (value > 9) {
                                min = 9;
                            }

                            return min;
                        },
                    })}
                    label="Min Value"
                    type="number"
                    error={errors.min}
                />
                <Input
                    controller={register("max", {
                        required: "Cannot be empty",
                        min: {
                            value: 2,
                            message: "Minimum value is 2",
                        },
                        max: {
                            value: 10,
                            message: "Maximum value is 10",
                        },
                        onChange: (e) => {
                            let value = e.target.value;
                            let min = getValues("min");

                            if (value < 2) {
                                min = 1;
                            } else if (!isNaN(value) && min >= value) {
                                min = value - 1;
                            }

                            setValue("min", parseInt(min));
                        },
                        setValueAs: (value) => {
                            let max = parseInt(value);

                            if (value < 2) {
                                max = 2;
                            } else if (value > 10) {
                                max = 10;
                            }

                            return max;
                        },
                    })}
                    label="Max Value"
                    error={errors.max}
                    type="number"
                />
            </div>
            <div className={styles.input}>
                <Input
                    controller={register("minLabel", {
                        required: "Cannot be empty",
                    })}
                    label="Min Label"
                    error={errors.minLabel}
                />
                <Input
                    controller={register("maxLabel", {
                        required: "Cannot be empty",
                    })}
                    label="Max Label"
                    error={errors.maxLabel}
                />
            </div>
        </div>
    );
};

Range.propTypes = {
    register: PropTypes.func,
    getValues: PropTypes.func,
    setValue: PropTypes.func,
    errors: PropTypes.object,
};

export default Range;
