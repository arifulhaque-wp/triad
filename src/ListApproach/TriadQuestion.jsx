import { useAnswerStore } from "./store";
import { Layer, Stage } from "react-konva";
import CustomTriangleComponent2 from "../CustomComponent/CustomTriangleComponent2";
import { Button } from "antd";
import { disapper, sleep } from "../rawJS/Animation";
import { useMemo, useState } from "react";

const TriadQuestion = ({
  triangleConfig,
  indexState,
  setQueList,
  datasLength,
  setTriangleConfig,
  queryData,
}) => {
  const { answer, updateAnswer } = useAnswerStore();
  const [tri, setTri] = useState({});
  const [index, setIndex] = indexState;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [movement, setMoveMent] = useState([]);
  console.log("📢[TriadQuestion.jsx:21]: movement: ", movement);

  function onClickNext() {
    let t_index = index;
    t_index += 1;
    if (datasLength > t_index) {
      setIndex(t_index);
    }
    const t_data = queryData?.filter((x) => x.qNo == t_index)[0];
    if (t_data) {
      setTriangleConfig({
        sideText: [t_data.Top, t_data.LL, t_data.LR],
        triangleColor: String(t_data.Tcolor).toLowerCase().replace(" ", ""),
        triangleWidth: 175 * 2,
        circleColor: String(t_data.Pcolor).toLowerCase().replace(" ", ""),
        insideText: t_data.QueryName,
        question: `${t_data.qNo + 1}.${t_data.Question}`,
        que: t_data.Question,
        puckPos: null,
      });
    }
  }
  async function onClickSubmit() {
    setSubmitLoading(true);
    if (Object.keys(tri).length != 0) {
      for (let i = 0; i < tri.sideText.current.length; i++) {
        const x = tri?.sideText.current[i];
        if (x.current) {
          if (x.current?.scaleX() == 1.1) {
            if (x.current?.text() != " ") {
              if (answer.length == 0) {
                await sleep(3000);
                await disapper(tri?.mainGroup.current);
                updateAnswer([
                  {
                    qNo: index,
                    que: triangleConfig.que,
                    ans: x.current?.text(),
                    puckPos: tri.puck.current.position(),
                    movement: movement,
                    triangleConfig: triangleConfig,
                  },
                ]);
                setMoveMent(null)
                onClickNext();
                break;
              } else {
                const t = [...answer];
                function isExist() {
                  for (let i = 0; i < t?.length; i++) {
                    if (t[i].qNo == index) {
                      return i;
                    }
                  }
                  return -1;
                }
                const ansIdx = isExist();
                if (ansIdx != -1) {
                  t.splice(ansIdx, 1);
                }
                t.push({
                  qNo: index,
                  que: triangleConfig.que,
                  ans: x.current?.text(),
                  puckPos: tri.puck.current.position(),
                  movement: movement,
                  triangleConfig: triangleConfig,
                });
                await sleep(3000);
                await disapper(tri?.mainGroup.current);
                updateAnswer(t);
                setMoveMent(null)
                onClickNext();
                break;
              }
            }
          }
        }
      }
    }
    setSubmitLoading(false);
  }
  const stageContent = useMemo(() => {
    return (
      <Layer>
        <CustomTriangleComponent2
          triangleConfig={triangleConfig}
          triState={[tri, setTri]}
          movementState={[movement, setMoveMent]}
        />
      </Layer>
    );
  }, [triangleConfig, tri, setTri]);
  return (
    <div className="m-2">
      <div>
        <Button
          className="uppercase w-36 text-white font-semibold rounded-md"
          size="large"
          style={{
            borderColor: "#636363",
            borderWidth: "2px",
            backgroundColor: "#000",
          }}
          onClick={() => {
            setQueList(true);
          }}
        >
          Back
        </Button>
      </div>
      <div className="flex justify-center items-center flex-col">
        {triangleConfig && (
          <Stage width={1} height={1}>
            {stageContent}
          </Stage>
        )}
        <div className="flex justify-center gap-4">
          <Button
            className="uppercase w-36 text-white font-semibold rounded-md"
            size="large"
            style={{
              borderColor: "#636363",
              borderWidth: "2px",
              backgroundColor: "#000",
            }}
          >
            {" "}
            See Summary
          </Button>
          <Button
            loading={submitLoading}
            onClick={onClickSubmit}
            className="uppercase w-36 text-white font-semibold rounded-md"
            style={{
              borderColor: "#f2c15b",
              backgroundColor: "#f19225",
              borderWidth: "2px",
            }}
            size="large"
          >
            Submit
          </Button>
          <Button
            className="uppercase w-36 text-white font-semibold rounded-md"
            style={{
              backgroundColor: "#1b8daa",
              borderColor: "#386784",
              borderWidth: "2px",
            }}
            size="large"
            onClick={onClickNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TriadQuestion;
