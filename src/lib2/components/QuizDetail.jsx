
import { useState, useEffect, useRef } from "react";
import quiz_detail from "../svg/quiz_detail2.svg";

const QuizDetail = (props) => {
    const { coordinate, onQuizDetailChanged, handleQuizDetailCancel } = props;
    // console.log("coordinate",coordinate)
    const [showQuizDetail, set_showQuizDetail] = useState(false);
    const [quizOptionCount, set_quizOptionCount] = useState(coordinate.quizOptionCount);
    const [correctAnswer, set_correctAnswer] = useState(coordinate.correctAnswer);
    const [shouldSolveQuestion, set_shouldSolveQuestion] = useState(coordinate.shouldSolveQuestion);

    // useEffect(() => {
    //     if (!showQuizDetail && coordinate) {
    //         set_quizOptionCount(coordinate.quizOptionCount)
    //         set_correctAnswer(coordinate.correctAnswer)
    //         set_shouldSolveQuestion(coordinate.shouldSolveQuestion)
    //     }
    // }, [coordinate, showQuizDetail])



    // const handleBlurQuizDetail = () => {
    //     console.log("불러")
    //     set_showQuizDetail(false);
    // }
    const handleAdjust = e => {
        // e.preventDefault();
        // e.stopPropagation();
        // console.log("클릭")
        if (onQuizDetailChanged) {
            onQuizDetailChanged(showQuizDetail)
        }
        set_showQuizDetail(false);

    }
    const handleCancel = e => {
        if (handleQuizDetailCancel) {
            handleQuizDetailCancel(showQuizDetail)
        }
        set_showQuizDetail(false);
    }

    const quizDetailRef = useRef();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (quizDetailRef.current && !quizDetailRef.current.contains(e.target)) {
                // quizDetailRef 외부를 클릭했을 때
                // console.log("외부클릭")
                set_showQuizDetail(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (<div className="QuizDetail"
        ref={quizDetailRef}


    >
        <div className="quiz_icon" onClick={() => {
            set_showQuizDetail(qd => !qd)
        }}>
            <img src={quiz_detail} alt="" />
        </div>

        {showQuizDetail &&
            <>

                <div className="dropDown_qd">
                    <div>
                        <label htmlFor="quizOptionCount">보기 수:</label>
                        <select
                            id="quizOptionCount"
                            value={quizOptionCount}
                            onChange={(e) => set_quizOptionCount(e.target.value)}
                        >
                            {[...Array(10).keys()].map((value) => (
                                <option key={value + 1} value={value + 1}>
                                    {value + 1}
                                </option>
                            ))}
                        </select>
                        <br />
                    </div>

                    correctAnswer:{correctAnswer}<br />
                    shouldSolveQuestion:{shouldSolveQuestion}<br />
                    <div className="quizDetailBtnZone">
                        <button onMouseDown={handleAdjust}>적용</button>
                        <button onMouseDown={handleCancel}>취소</button>
                    </div>
                </div>
                <div className="dropDown_triangle" />
            </>

        }


    </div>)
}
export default QuizDetail;