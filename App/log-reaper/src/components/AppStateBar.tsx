/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Statebar component, displaying line count, error messages and application modes.
 **/

import { Dispatch, useEffect, useRef } from "react";
import "../css/AppStateBar.css";

type Props = {
  isEditMode: boolean;
  errorValue: string;
  setErrorValue: Dispatch<React.SetStateAction<string>>;
  currentLines: number;
  totalLines: number;
};

function AppStateBar(props: Props) {
  // error notification reference
  const refError = useRef<HTMLDivElement>(null);
  const { setErrorValue } = props;

  // setting error notification once the errorValue property is set
  useEffect(() => {
    // clearing error notification after a certain timeout
    const clearError = () => {
      refError.current!.style.visibility = "hidden";
      setErrorValue("");
    };

    // timeouts for error notification
    var editorTimerIntervalClear: number = 3000;

    if (props.errorValue !== "" && refError.current !== null)
      refError.current.style.visibility = "visible";

    let editorTimer = setTimeout(() => clearError(), editorTimerIntervalClear);

    return () => {
      clearTimeout(editorTimer);
    };
  }, [props.errorValue, setErrorValue]);

  return (
    <div id="options-bar">
      <p id="app-name-left" className="app-name">
        Log
      </p>
      <p id="app-name-right" className="app-name">
        Reaper
      </p>
      <div id="line-display">
        {(props.totalLines < props.currentLines ? props.totalLines : props.currentLines) +
          " / " +
          props.totalLines}
      </div>
      <div id="error-display" ref={refError}>
        {props.errorValue}
      </div>
      {props.isEditMode ? (
        <div id="mode-display" style={{ color: "lightgreen" }}>
          Edit mode
        </div>
      ) : (
        <div id="mode-display" style={{ color: "lightCoral" }}>
          Filter mode
        </div>
      )}
    </div>
  );
}
export default AppStateBar;
