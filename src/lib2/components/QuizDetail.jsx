import { useState } from "react";
import { useEffect } from "react";

const QuizDetail = (props) => {
    const { coordinate, onQuizDetailChanged } = props;
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

    return (<div className="QuizDetail"

        // onBlur={handleBlurQuizDetail}

    >
        <div onClick={() => {
            set_showQuizDetail(true)
        }}>
            QD
        </div>

        {showQuizDetail &&
            <div className="dropDown_qd">
                quizOptionCount:{quizOptionCount}<br />
                correctAnswer:{correctAnswer}<br />
                shouldSolveQuestion:{shouldSolveQuestion}<br />
                <div className="quizDetailBtnZone">
                    <button onClick={e=>{
                          e.preventDefault();
                        e.stopPropagation();
                        
                        if( onQuizDetailChanged){
                            onQuizDetailChanged(showQuizDetail)
                        }
                        set_showQuizDetail(false);

                    }}>적용</button>
                    <button onClick={e=>{
                          e.preventDefault();
                        e.stopPropagation();
                        if( onQuizDetailChanged){
                            onQuizDetailChanged(showQuizDetail)
                        }
                        set_showQuizDetail(false);
                    }}>취소</button>
                </div>
            </div>
        }


    </div>)
}
export default QuizDetail;