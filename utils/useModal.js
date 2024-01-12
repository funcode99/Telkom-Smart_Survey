import { useRecoilState } from "recoil";
import { modalState } from "./recoil";

// Custom hooks to trigger modal
// Useful when you save modal state on parent and you have many setModal function in different child component
// Usage : {modal, setModal} = useModal(id)
// 'id' is identifier.

const useModal = (id) => {
    const [store, setStore] = useRecoilState(modalState);
    const modal = store[id]?.visible || false;
    const data = store[id]?.data || {};

    const setModal = (value) => {
        setStore({
            ...store,
            [id]: {
                visible: value,
                data: {},
            },
        });
        return new Promise((resolve) => resolve());
        // use promise return, in case you need for wait until modal truly closed
    };
    const setData = (value) => {
        setStore({
            ...store,
            [id]: {
                visible: !store[id]?.value,
                data: value,
            },
        });
        return new Promise((resolve) => resolve());
    };

    // modal = boolean to detect if modal showing or not (true / false)
    // setModal = function to set modal | setModal(true / false)
    // data = you can save data on modal, using this to read data
    // setData = function to set modal data | setData({}) , value must be object

    // !note : if you use setModal, it will automatically change data to empty ({})
    // !note : if you use setData, it will automatically change modal to opposite (!modal)
    return { modal, setModal, data, setData };
};

export default useModal;
