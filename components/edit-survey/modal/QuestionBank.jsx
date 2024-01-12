import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import intersection from "lodash.intersection";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "next-i18next";
import styles from "./QuestionBank.module.scss";

import { getCategory } from "../../../utils/functions";
import { IoSearch } from "react-icons/io5";
import { IoMdArrowRoundBack, IoIosArrowUp } from "react-icons/io";
import { BsCheck } from "react-icons/bs";
import { MdClose, MdArrowForwardIos } from "react-icons/md";
import { getQuestionBank, cloneQuestion } from "../../../utils/api/questionApi";
import useModal from "../../../utils/useModal";

import { Button } from "../../global/Button";
import ModalContainer from "../../modal/ModalContainer";
import Tooltip from "../../global/Tooltip";

const BankDetail = ({ selectedList, setSelectedList, category, setSubmitLoading, setList, close, back }) => {
    const [questionList, setQuestionList] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation("edit-survey");

    const getData = (input) => {
        setLoading(true);
        getQuestionBank({ category, search: input })
            .then((resolve) => {
                console.log(resolve);
                setQuestionList(resolve.lists);
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
        getData(input);
    }, [category, input]);

    const submitHandler = () => {
        setSubmitLoading(true);
        cloneQuestion({
            surveyIdDest: router.query.surveyId,
            questionIds: selectedList.map((select) => select._id),
        })
            .then((resolve) => {
                console.log(resolve);
                setList(resolve.questions);
                setSelectedList([]);
                toast.info(t("success_import_question"));
                close();
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSubmitLoading(false);
            });
    };

    const checkIntersection = () => {
        const array = intersection(
            questionList?.map((question) => question._id),
            selectedList?.map((question) => question._id)
        );
        return array.length === questionList.length && !isLoading;
    };

    return (
        <>
            <div className={styles.header + " " + styles.header_detail}>
                <IoMdArrowRoundBack className={styles.back} onClick={back} />
                <h5>Question Bank</h5>
                <Tooltip message="Question Bank" />
                <MdClose className={styles.close} onClick={close} />
            </div>
            <div className={styles.body_detail}>
                <div className={styles.left}>
                    <div className={styles.search_border}>
                        <div className={styles.search_container}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Search for ${category.toLowerCase()} question bank`}
                            />
                            <IoSearch />
                        </div>
                    </div>
                    <div className={styles.question_select}>
                        <button
                            className={styles.checkbox}
                            type="button"
                            onClick={() => {
                                if (!questionList.length) return;

                                const uncheckAll = selectedList.filter((select) => {
                                    return !questionList.some((question) => question._id === select._id);
                                });
                                const checkAll = [
                                    ...selectedList,
                                    ...questionList.filter((select) => !selectedList.some((question) => question._id === select._id)),
                                ];

                                setSelectedList(checkIntersection() ? uncheckAll : checkAll);
                            }}
                        >
                            <div className={checkIntersection() && questionList.length ? styles.checked : null}>
                                <BsCheck />
                            </div>
                            <span>
                                Select all {questionList.length} questions from <b>{input || category}</b>
                            </span>
                        </button>
                    </div>
                    <div className={styles.question_list_container}>
                        {isLoading
                            ? Array.from({ length: 10 }).map((_, index) => {
                                  return (
                                      <div key={index} style={{ width: "45%", cursor: "wait" }}>
                                          <Skeleton key={index} height={30} />
                                      </div>
                                  );
                              })
                            : questionList.map((question, index) => {
                                  const isChecked = selectedList.findIndex((select) => select._id === question._id);

                                  return (
                                      <div
                                          className={styles.question_list}
                                          key={index}
                                          onClick={() => {
                                              if (isChecked >= 0) {
                                                  const newData = [...selectedList];
                                                  newData.splice(isChecked, 1);
                                                  setSelectedList(newData);
                                              } else {
                                                  setSelectedList([...selectedList, question]);
                                              }
                                          }}
                                      >
                                          <button className={styles.checkbox} type="button">
                                              <div className={isChecked >= 0 ? styles.checked : null}>
                                                  <BsCheck />
                                              </div>
                                          </button>
                                          <div>
                                              <label styles={styles.label}>{question.label}</label>
                                              {["option", "checkbox", "radio"].includes(question.inputType) && (
                                                  <div className={styles.option}>
                                                      <button
                                                          onClick={(e) => {
                                                              e.stopPropagation();

                                                              const panel = e.target.parentElement?.nextElementSibling;
                                                              const arrow = e.target.parentElement?.querySelector("svg");

                                                              if (panel.style.maxHeight) {
                                                                  panel.style.maxHeight = null;
                                                                  arrow.style.transform = null;
                                                              } else {
                                                                  panel.style.maxHeight = panel.scrollHeight + "px";
                                                                  panel.style.marginTop = ".5rem";
                                                                  arrow.style.transform = "scaleY(-1)";
                                                              }
                                                          }}
                                                      >
                                                          <span>Show Answer</span>
                                                          <IoIosArrowUp />
                                                      </button>
                                                      <ul
                                                          onTransitionEnd={(e) => {
                                                              if (!e.target.style.maxHeight) {
                                                                  e.target.style.marginTop = null;
                                                              }
                                                          }}
                                                      >
                                                          {question.option.map((option) => {
                                                              return (
                                                                  <li key={option._id}>
                                                                      • <span>{option.label}</span>
                                                                  </li>
                                                              );
                                                          })}
                                                      </ul>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.preview_container}>
                        <label>Preview</label>
                        <div className={styles.preview_list_container}>
                            {selectedList.map((question, index) => {
                                return (
                                    <div className={styles.preview_list} key={index}>
                                        <span>{question.label}</span>
                                        <MdClose
                                            onClick={() => {
                                                const newData = [...selectedList];
                                                newData.splice(index, 1);
                                                setSelectedList(newData);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.button}>
                        <Button style={{ height: "44px", width: "100%" }} onClick={submitHandler}>
                            + ADD QUESTION
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

const QuestionBank = ({ setList }) => {
    const [selectedList, setSelectedList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { modal, setModal } = useModal("question-bank");
    const router = useRouter();
    const categoryList = getCategory(router.locale);

    return (
        <ModalContainer
            show={modal}
            customContainer={{ padding: 0, overflowY: "visible" }}
            NextComponent={selectedCategory && BankDetail}
            nextProps={{
                selectedList,
                setSelectedList,
                category: selectedCategory,
                setSubmitLoading,
                setList,
                back: () => setSelectedCategory(null),
                close: () => setModal(false),
            }}
            isLoading={submitLoading}
            onClose={() => {
                setSelectedList([]);
                setSelectedCategory(null);
            }}
        >
            <div className={styles.header}>
                <h5>Question Bank</h5>
                <Tooltip message="Question Bank" />
                <MdClose className={styles.close} onClick={() => setModal(false)} />
            </div>
            <div className={styles.body}>
                {/* <div className={styles.search_container}>
                    <input placeholder="Search for question" />
                    <IoSearch />
                </div> */}
                <div className={styles.list_container}>
                    {categoryList.map((category) => {
                        return (
                            <div className={styles.list} key={category} onClick={() => setSelectedCategory(category.query)}>
                                <label>{category.label}</label>
                                <MdArrowForwardIos />
                            </div>
                        );
                    })}
                </div>
            </div>
        </ModalContainer>
    );
};

BankDetail.propTypes = {
    selectedList: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            label: PropTypes.string,
            inputType: PropTypes.string,
            option: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                })
            ),
        })
    ),
    setSelectedList: PropTypes.func,
    category: PropTypes.string,
    setSubmitLoading: PropTypes.func,
    back: PropTypes.func,
    close: PropTypes.func,
    setList: PropTypes.func,
};
QuestionBank.propTypes = {
    setList: PropTypes.func,
};

export default QuestionBank;
