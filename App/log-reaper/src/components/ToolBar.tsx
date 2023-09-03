/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Toolbar component for managing indvidual log message patterns, including exporting to YAML,
 * name edit, moving them back to the input filter
 **/

import { Button } from "@mui/material";
import { Dispatch, RefObject, useEffect } from "react";
import "../css/ToolBar.css";
import ToolBarPattern from "./ToolBarPattern";
import { stringify } from "yaml";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { MessagePatternData } from "../types/types";

type Props = {
  setErrorValue: Dispatch<React.SetStateAction<string>>;
  filterRef: RefObject<ReactCodeMirrorRef>;
  logMessagePatterns: MessagePatternData[];
  setLogMessagePatterns: Dispatch<React.SetStateAction<MessagePatternData[]>>;
  setLogMessageCombinationPattern: Dispatch<React.SetStateAction<string[]>>;
  refExportModal: RefObject<HTMLDivElement>;
  setEditedPatternName: Dispatch<React.SetStateAction<string>>;
  setExportModalText: Dispatch<React.SetStateAction<string>>;
};

function ToolBar(props: Props) {
  const { setLogMessageCombinationPattern } = props;

  useEffect(() => {
    var logMessagePatternArray = [];

    for (var i = 0; i < props.logMessagePatterns.length; i++) {
      var logMessagePattern = "";

      if (
        props.logMessagePatterns[i].checked &&
        props.logMessagePatterns[i].patterns.length > 0
      ) {
        logMessagePattern += props.logMessagePatterns[i].value;
        logMessagePatternArray.push(logMessagePattern);
      }
    }

    setLogMessageCombinationPattern(logMessagePatternArray);
  }, [props.logMessagePatterns, setLogMessageCombinationPattern]);

  const onDeleteLogMessagePattern = (
    event: any,
    logMessagePattern: MessagePatternData
  ): void => {
    event.preventDefault();

    var logMessagePatternsCopy = [...props.logMessagePatterns];
    const index = props.logMessagePatterns.findIndex((sq) => sq.id === logMessagePattern.id);
    logMessagePatternsCopy.splice(index, 1);
    props.setLogMessagePatterns(logMessagePatternsCopy);
  };

  const onSetLogMessagePatternAsFilter = (
    event: any,
    logMessagePattern: MessagePatternData
  ): void => {
    event.preventDefault();

    // override current text inside filter, do not use hook
    var view = props.filterRef?.current?.view;
    if (view !== undefined && view.state.doc.line(1).text === "") {
      view.dispatch(
        view.state.update({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: logMessagePattern.patterns.map((pattern) => pattern.value).join(""),
          },
        })
      );

      props.setEditedPatternName(logMessagePattern.name);
      onDeleteLogMessagePattern(event, logMessagePattern);
    } else {
      props.setErrorValue(
        "You are about to overwrite the pattern inside of the filter. Save it first."
      );
    }
  };

  const onLogMessagePatternSelection = (
    event: any,
    logMessagePattern: MessagePatternData
  ): void => {
    var logMessagePatternsCopy = [...props.logMessagePatterns];
    const index = props.logMessagePatterns.findIndex((sq) => sq.id === logMessagePattern.id);
    logMessagePatternsCopy[index].checked = event.target.checked;

    props.setLogMessagePatterns(logMessagePatternsCopy);
  };

  // edit log message pattern's name
  const onEditLogMessagePattern = (event: any, logMessagePattern: MessagePatternData) => {
    var logMessagePatternsCopy = [...props.logMessagePatterns];
    const index = props.logMessagePatterns.findIndex((sq) => sq.id === logMessagePattern.id);
    logMessagePatternsCopy[index].name = event.target.value;

    props.setLogMessagePatterns(logMessagePatternsCopy);
  };

  // this function is called when the user clicks the export button
  const onExport = (event: any) => {
    event.preventDefault();
    var exportedPatterns: any = {};
    var value = "";

    // iterating trough selected log message patterns and appending their values to a string
    if (props.logMessagePatterns.length > 0) {
      for (var i = 0; i < props.logMessagePatterns.length; i++) {
        value = "";
        if (
          props.logMessagePatterns[i].checked &&
          props.logMessagePatterns[i].patterns.length > 0
        ) {
          for (var j = 0; j < props.logMessagePatterns[i].patterns.length; j++) {
            value += props.logMessagePatterns[i].patterns[j].value;
          }

          // replacing empty spaces in the log message pattern names
          // so PlogChecker is able to parse it correctly
          exportedPatterns[props.logMessagePatterns[i].name.replaceAll(" ", "_")] = value + "";
        }
      }

      // format the string to the correct YAML format
      if (exportedPatterns !== undefined) {
        // PLAIN YAML mode is used
        var yamlString = stringify(
          { events: exportedPatterns },
          { defaultStringType: "PLAIN", nullStr: "~" }
        );

        props.setExportModalText(yamlString);

        // make the export dialog visible
        if (props.refExportModal.current !== null)
          props.refExportModal.current.style.visibility = "visible";
      }
    }
  };

  return (
    <div id="toolbar">
      <div id="toolbar-body">
        <div id="toolbar-patterns">
          {props.logMessagePatterns.map((sq: MessagePatternData) => (
            <ToolBarPattern
              key={sq.id}
              logMessagePattern={sq}
              onSetLogMessagePatternAsFilter={onSetLogMessagePatternAsFilter}
              onLogMessagePatternSelection={onLogMessagePatternSelection}
              onEditLogMessagePattern={onEditLogMessagePattern}
            ></ToolBarPattern>
          ))}
        </div>
        <div id="options">
          <Button
            variant="contained"
            onClick={(event) => onExport(event)}
            style={{
              width: "70%",
              borderRadius: 5,
            }}
          >
            Export message patterns
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ToolBar;
