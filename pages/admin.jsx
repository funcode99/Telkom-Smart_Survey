import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";

import { auth } from "../utils/useAuth.js";
import { getAllUser } from "../utils/api/userApi.js";
import useModal from "../utils/useModal";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import TableList from "../components/global/TableList";
import Toolbar from "../components/global/Toolbar";
import Pagination from "../components/global/Pagination";
import Modal from "../components/admin/Modal";
import ModalPending from "../components/admin/ModalPending";
import ModalAddUser from "../components/modal/ModalAddUser";

const Admin = () => {
    const [isLoading, setLoading] = useState("pending");
    const [userList, setUserList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [param, setParam] = useState({ status: "verified", page: 1 });
    const [menu, setMenu] = useState("verified");
    const { setModal } = useModal("add-admin");

    const getData = (param, menu) => {
        setParam(param);
        if (menu) setMenu(menu);

        setLoading(true);
        getAllUser({ ...param, level: "admin" })
            .then((resolve) => {
                console.log(resolve.lists);
                setUserList(resolve?.lists);
                setTotalData(resolve?.totalCount);
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
        getData(param);
    }, []);

    return (
        <Sidebar>
            <Toolbar
                title="Admin"
                activeMenu={menu}
                menuList={[
                    {
                        label: "Verified",
                        value: "verified",
                        onClick: () => {
                            getData({ status: "verified", page: 1 }, "verified");
                        },
                    },
                    {
                        label: "Pending",
                        value: "pending",
                        onClick: () => {
                            getData({ status: "active", page: 1 }, "pending");
                        },
                    },
                    {
                        label: "Pre-Register",
                        value: "preregister",
                        onClick: () => {
                            getData({ status: "active", preregist: true, page: 1 }, "preregister");
                        },
                    },
                ]}
                buttonList={[
                    {
                        label: "+ ADD USER",
                        onClick: () => {
                            setModal(true);
                        },
                    },
                ]}
            />
            <TableList
                modalIdentifier={menu === "verified" ? "edit-user" : "verify-user"}
                list={userList}
                isLoading={isLoading}
                header={["Name", "Email", "Mobile", "Role"]}
                body={userList.map((user) => {
                    return [user.fullname, user.email, user.mobile, user.role_details?.name];
                })}
            />
            <Pagination count={totalData} page={param.page} setPage={(page) => getData({ ...param, page })} />
            <Modal />
            <ModalPending onSuccess={() => getData({ status: "verified", page: 1 }, "verified")} />
            <ModalAddUser onSuccess={() => getData({ status: "active", preregist: true, page: 1 }, "preregister")} isAdmin />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(Admin);
