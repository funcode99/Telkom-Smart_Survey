import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";

import { auth } from "../utils/useAuth.js";
import { useRecoilValue } from "recoil";
import { userProfile } from "../utils/recoil.js";
import { getAllGroup } from "../utils/api/groupApi.js";
import useModal from "../utils/useModal";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import TableList from "../components/global/TableList";
import Pagination from "../components/global/Pagination";
import Modal from "../components/group/Modal";
import ModalAdd from "../components/group/ModalAdd";
import { PageHeader as Header } from "../components/global/Header.jsx";

const Group = () => {
    const [isLoading, setLoading] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(1);
    const { setModal } = useModal("create-group");
    const profile = useRecoilValue(userProfile);
    const { t } = useTranslation("group");
    const { t: t_c } = useTranslation("common");

    const getData = (page) => {
        setLoading(true);
        setPage(page);
        setGroupList([]);

        getAllGroup({ userId: profile.userId, level: profile.level, page })
            .then((resolve) => {
                setGroupList(resolve?.lists);
                setTotalData(resolve?.totalData);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getData(1);
    }, []);

    return (
        <Sidebar>
            <Header
                title={t_c("group")}
                buttonList={[
                    {
                        label: "+ " + t("group_new"),
                        onClick: () => setModal(true),
                    },
                ]}
            />
            <TableList
                modalIdentifier="update-group"
                list={groupList}
                isLoading={isLoading}
                header={["Group Name", "Group Description", "Member"]}
                body={groupList.map((group) => [group.groupName, group.groupDesc, group.groupMembers?.length])}
            />

            <Pagination count={totalData} page={page} setPage={(page) => getData(page)} />
            <Modal refresh={() => getData(page)} />
            <ModalAdd refresh={() => getData(1)} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "group"])),
    },
});

export default auth(Group);
