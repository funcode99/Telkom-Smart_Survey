import { useState, useEffect } from "react";

import { useRecoilValue } from "recoil";
import { userProfile } from "../utils/recoil";
import { toast } from "react-toastify";
import { getAllAccess } from "../utils/api/accessApi";
import useModal from "../utils/useModal";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import TableList from "../components/global/TableList";
import Toolbar from "../components/global/Toolbar";
import ModalAdd from "../components/access/ModalAdd";

const Access = () => {
    const [isLoading, setLoading] = useState(false);
    const [accessList, setAccessList] = useState([]);
    // const [page, setPage] = useState(1);
    const { setModal } = useModal("add-access");
    const profile = useRecoilValue(userProfile);

    const getData = (page) => {
        console.log(profile);
        setLoading(true);
        getAllAccess({ userId: profile.userId, level: profile.level, page })
            .then((resolve) => {
                setAccessList(resolve);
                setLoading(false);
            })
            .catch((reject) => {
                console.log(reject);
                setLoading(false);
                toast.error(reject);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Sidebar>
            <Toolbar title="Access" buttonList={[{ label: "+ NEW ACCESS", onClick: () => setModal(true), isHidden: profile.level === "super" }]} />
            <TableList
                modalIdentifier="edit-access"
                list={accessList}
                isLoading={isLoading}
                header={["Access Name", "Access Survey"]}
                body={accessList.map((access) => [access.accessName, access.allowedSurvey?.length || "0"])}
                hide_action
            />
            <ModalAdd refresh={() => getData()} />
        </Sidebar>
    );
};

export default Access;
