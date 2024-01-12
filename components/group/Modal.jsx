import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { useTranslation } from "next-i18next";
import styles from "./Modal.module.scss";

import { timeout } from "../../utils/functions";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

import { removeMember, setMember, updateGroup, deleteGroup } from "../../utils/api/groupApi";
import { searchUser } from "../../utils/api/userApi";
import useModal from "../../utils/useModal";
import useOverlay from "../../utils/useOverlay";

import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import Spinner from "../global/Spinner";
import { Button, ButtonContainer } from "../global/Button";
import Popup from "../global/Popup";

const Modal = ({ refresh }) => {
    const [input, setInput] = useState({});
    const [isChange, setChange] = useState(false);
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isPopup, setPopup] = useState(null);
    const { modal, setModal, data, setData } = useModal("update-group");
    const profile = useRecoilValue(userProfile);
    const { t } = useTranslation("group");
    useOverlay(searchOpen, setSearchOpen, "dropdown-group-addmember");

    useEffect(() => {
        if (data.groupId) {
            console.log(data);
            setInput(data);
            setSearch("");
            setSearchOpen(false);
            setSearchResult([]);
        }
    }, [data]);

    useEffect(() => {
        setChange(false);
    }, [modal]);

    const searchMember = (keyword) => {
        setSearchLoading(true);
        setSearchResult([]);
        searchUser({ keyword, level: "user", status: "verified", row: 4 })
            .then((resolve) => {
                setSearchResult(resolve.lists);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSearchLoading(false);
            });
    };

    useEffect(() => {
        if (search) {
            searchMember(search);
        } else {
            setSearchOpen(false);
            setSearchResult([]);
        }
    }, [search]);

    useEffect(() => {
        setSearchOpen(searchResult.length ? true : false);
    }, [searchResult]);

    const addMember = (email) => {
        if (isLoading) return;

        setLoading(true);
        setMember({ emails: [email] }, data.groupId)
            .then((resolve) => {
                toast.info("Add member success");
                setData(resolve);
                setSearch("");
                setSearchOpen(false);
                setSearchResult([]);
                setChange(true);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const deleteMember = (userId) => {
        if (isLoading) return;

        setLoading(true);
        removeMember({ userIds: [userId] }, data.groupId)
            .then((resolve) => {
                toast.info("Remove member success");
                setData(resolve);
                setChange(true);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const submitHandler = () => {
        if (data.groupName === input.groupName && data.groupDesc === input.groupDesc) {
            return setModal(false);
        }

        setLoading(true);
        updateGroup({ groupName: input.groupName, groupDesc: input.groupDesc }, data.groupId)
            .then(() => {
                refresh();
                toast.info("Update group success.");
                setModal(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteHandler = () => {
        setLoading(true);
        deleteGroup(data.groupId)
            .then(async () => {
                await timeout(1000);
                refresh();
                toast.info("Delete group success.");
                setModal(false);
                setLoading(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
            });
    };

    if (isPopup) {
        return (
            <Popup
                show={modal}
                setPopup={setPopup}
                modalProps={{ isLoading }}
                title={t(isPopup === "delete" ? "warning_delete_group" : "warning_leave_group")}
                cancelButton={{
                    onClick: () => setPopup(null),
                }}
                submitButton={{
                    onClick: isPopup === "delete" ? () => deleteHandler() : () => deleteMember(profile.userId),
                    isLoading: isLoading,
                }}
            />
        );
    }

    return (
        <ModalContainer show={modal} isLoading={isLoading} customContainer={{ width: "42rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
            <div className={styles.main_container}>
                <div className={styles.left_container}>
                    <div className={styles.input_container}>
                        <Input
                            label="Group Name"
                            value={input.groupName}
                            onChange={(e) => setInput({ ...input, groupName: e.target.value })}
                            isRequired
                        />
                        <Input label="Group Description">
                            <textarea value={input.groupDesc} onChange={(e) => setInput({ ...input, groupDesc: e.target.value })} isRequired />
                        </Input>
                    </div>
                </div>
                <div className={styles.right_container}>
                    <label className={styles.title}>Member</label>
                    <div className={styles.member_container}>
                        <div className={styles.add_member} id="dropdown-group-addmember">
                            <input placeholder="Type Name or Email" value={search} onChange={(e) => setSearch(e.target.value)} />
                            {searchOpen && (
                                <div className={styles.panel}>
                                    {!searchLoading ? (
                                        searchResult.map((result) => {
                                            return (
                                                <div
                                                    className={styles.list}
                                                    key={result.userId}
                                                    onClick={() => addMember(result.email)}
                                                    style={{ cursor: isLoading && "wait" }}
                                                >
                                                    <span className={styles.name}>{result.fullname}</span>
                                                    <span className={styles.email}>{result.email}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <Spinner width={30} height={30} style={{ padding: "0.75rem" }} />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.member_list}>
                            {data.groupMembers?.map((member, i) => {
                                const isAdmin = data.groupAdmin?.some((admin) => admin.userId === member.userId);

                                return (
                                    <div className={styles.card} key={i}>
                                        <label className={styles.name}>
                                            <span>{member.name}</span>
                                            {isAdmin && <span className={styles.admin}>Admin</span>}
                                        </label>
                                        <span className={styles.email}>{member.email}</span>
                                        {isAdmin || profile.userId === member.userId ? null : (
                                            <MdClose onClick={() => deleteMember(member.userId)} style={{ cursor: isLoading && "wait" }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <ButtonContainer style={{ height: "2.5rem" }}>
                {data.groupAdmin?.some((admin) => admin.userId === profile.userId) ? (
                    <Button isTransparent onClick={() => setPopup("delete")} style={{ width: "7rem" }}>
                        DELETE
                    </Button>
                ) : (
                    <Button isTransparent onClick={() => setPopup("leave")} style={{ width: "7rem" }}>
                        LEAVE
                    </Button>
                )}
                <Button
                    isTransparent
                    onClick={() => {
                        if (isChange) refresh();
                        setModal(false);
                    }}
                    style={{
                        marginLeft: "auto",
                        width: "7rem",
                    }}
                >
                    CLOSE
                </Button>
                <Button onClick={submitHandler} isDisabled={isLoading} style={{ width: "7rem" }}>
                    SAVE
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

Modal.propTypes = {
    refresh: PropTypes.func,
};

export default Modal;
