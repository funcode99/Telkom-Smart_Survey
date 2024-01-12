import PropTypes from "prop-types";

import ModalContainer from "../modal/ModalContainer";
import Spinner from "../global/Spinner";

const Loading = ({ show }) => {
    return (
        <ModalContainer
            show={show}
            customContainer={{ backgroundColor: "transparent", boxShadow: "none" }}
            customOverlay={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            isCenter
        >
            <Spinner size={200} color="#fff" secondaryColor="rgba(0,0,0,0.3)" />
        </ModalContainer>
    );
};

Loading.propTypes = {
    show: PropTypes.bool,
};

export default Loading;
