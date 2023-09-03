/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: The parent component of the whole application for shared functionalities such as
 * Grok resolving, setting of supported Grok sets or retrieving grok patterns active in filters.
 **/

import "../css/App.css";
import GrokSetSelection from "./GrokSetSelection";
import MainText from "./MainText";
import ToolBar from "./ToolBar";
import Filter from "./Filter";
import AppStateBar from "./AppStateBar";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ExportModal from "./ExportModal";
import messagePatternMockData from "../mockData/mockLogMessagePatterns.json";
import logText from "../mockData/log.json";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import logo from "../img/testos-logo.png";
import { GrokPattern, GrokPatternSet, MessagePatternData } from "../types/types";

function App() {
  // hooks to communicate between components
  const [logMessagePatterns, setLogMessagePatterns] = useState<MessagePatternData[]>([]);
  const [selectionMatch, setSelectionMatch] = useState<GrokPattern[]>([]);
  const [grokPattern, setGrokPattern] = useState<GrokPattern[]>([]);
  const [logMessageCombiantionPattern, setLogMessageCombinationPattern] = useState<string[]>(
    []
  );

  const [editedDoc, setEditedDoc] = useState<string[]>([""]);
  const [originalDocOutput, setOriginalDocOutput] = useState<string[]>([""]);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [filterText, setFilterText] = useState("");
  const [exportModalText, setExportModalText] = useState<string>("");
  const [errorValue, setErrorValue] = useState<string>("");
  const [editedPatternName, setEditedPatternName] = useState<string>("New pattern");

  const [totalLines, setTotalLines] = useState<number>(0);
  const [currentLines, setCurrentLines] = useState<number>(0);

  const refExportModal = useRef<HTMLDivElement>(null);
  const filterRef = useRef<ReactCodeMirrorRef>({});

  //////////////////////////////////////////////////////////////////////////////////////////
  //** Here you can set a new Grok set from the grokPatterns directory **//
  //** In order to load the Grok patterns properly, 'type' must be identical to the file name of the Grok set **//
  //** Name is a display name that will be shown in the GrokSetSelection component. IsActive is a pre-select upon applicaiton load.**/
  const [grokPatternSets, setGrokPatternSets] = useState<GrokPatternSet[]>([
    { type: "grok-patterns", name: "Grok", isActive: false },
    { type: "firewalls", name: "Firewalls", isActive: false },
    { type: "haproxy", name: "Haproxy", isActive: false },
    { type: "java", name: "Java", isActive: false },
    { type: "junos", name: "Junos", isActive: false },
    { type: "linux-syslog", name: "Linux syslog", isActive: false },
    { type: "mongodb", name: "MongoDB", isActive: false },
    { type: "nagios", name: "Nagios", isActive: false },
    { type: "postgresql", name: "PostgreSQL", isActive: false },
    { type: "redis", name: "Redis", isActive: false },
    { type: "ruby", name: "Ruby", isActive: false },
    { type: "plogchecker", name: "PlogChecker", isActive: false },
    { type: "custom", name: "Custom", isActive: false },
  ]);
  //////////////////////////////////////////////////////////////////////////////////////////

  // loading of individual Grok pattern sets
  useEffect(() => {
    const fetchData = async () => {
      var grokArray = [];
      var loadedFile = "";
      for (var i = 0; i < grokPatternSets.length; i++) {
        if (grokPatternSets[i].isActive) {
          // fetch Grok pattern sets from 'GrokPatterns' directory
          // iterating trough individual sets defined in the grokPatternSets property
          loadedFile = require("../grokPatterns/" + grokPatternSets[i].type);
          const data = await axios.get(loadedFile);

          const dataArray = data.data.split(/\r?\n/);

          for (var j = 0; j < dataArray.length; j++) {
            // load individual Grok patterns inside of a Grok pattern set
            // and ignore comments starting with #
            if (dataArray[j].length > 0 && dataArray[j][0] !== "#") {
              var alias = dataArray[j].substring(0, dataArray[j].indexOf(" "));
              var value = dataArray[j].substring(dataArray[j].indexOf(" ") + 1);

              grokArray.push({ name: alias, value: value });
            }
          }
        }
      }

      setGrokPattern(grokArray);
    };

    fetchData();
  }, [grokPatternSets]);

  // display mode of the document
  useEffect(() => {
    if (logMessageCombiantionPattern.length === 0 && filterText === "") {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [filterText, logMessageCombiantionPattern]);

  // recurively translate nested GROK patterns into RegEx
  const resolveSubPatterns = (resolvedPattern: string): string => {
    // regex to locate GROK patterns
    // %{TYPE} or %{TYPE:name}
    var subPatternsRegex =
      /(%\{r\(.+?\):[A-Za-z0-9_]+?\})|(%\{[A-Z0-9_]+(?::[A-Za-z0-9_]+)?\})/g;
    var expression = "";
    var subPatterns = resolvedPattern.match(subPatternsRegex);
    // if no GROK is located return the pattern itself
    if (subPatterns === null || subPatterns.length === 0) {
      return resolvedPattern;
    }

    // for every located GROK pattern
    // 1) unwrapping - %{TYPE:name} -> TYPE:name -> [TYPE, name]
    // 2) retrieve the left part of exptression and append it - [[a-Z]-%{TYPE:name}-[1-2]] -> append [a-Z]- and continue
    // 3) retrieve value of located GROK
    // 4) if GROK pattern was not found, return error
    subPatterns.forEach((matchedPattern) => {
      var pattern = matchedPattern.slice(2, -1);
      var patternSplit = [];
      var indexOfSplit = pattern.lastIndexOf(":");

      if (indexOfSplit !== -1) {
        patternSplit.push(pattern.slice(0, indexOfSplit));
        patternSplit.push(pattern.slice(indexOfSplit + 1));
      } else {
        patternSplit.push(pattern);
      }

      var escapedString = matchedPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var regex = new RegExp(escapedString + "(.*)");
      var regexRes = resolvedPattern.split(regex);

      resolvedPattern = regexRes[1];
      expression += regexRes[0];

      if (patternSplit.length > 0) {
        if (patternSplit[0].startsWith("r(")) {
          if (patternSplit.length === 2 && patternSplit[1] !== undefined) {
            var paramReValue = patternSplit[0].slice(2, -1);
            expression += "(" + paramReValue + ")";
          }
        } else {
          var patternType = patternSplit[0];
          var subPatternArray = grokPattern.filter((item) => item.name === patternType);
          var subPattern = "";

          if (subPatternArray.length !== 1) {
            setErrorValue(
              "Error: pattern " + patternType + " not found in selected Grok sets!"
            );
          } else {
            subPattern = subPatternArray[0].value;
          }
          expression += resolveSubPatterns(subPattern);
        }
      }
    });
    return expression + resolvedPattern;
  };

  // retrieve a combination on chosen/active patterns from filters
  // and join them together using '|' (logical or)
  const getSavedPatterns = (): string => {
    var groupedPattern = "";

    // check if any selected log message patterns are present
    if (logMessageCombiantionPattern.length > 0) {
      logMessageCombiantionPattern.forEach((messagePattern) => {
        groupedPattern += messagePattern + "|";
      });
      groupedPattern = groupedPattern.slice(0, groupedPattern.length - 1);

      if (groupedPattern !== "" && filterText.length > 0) groupedPattern += "|";
    }

    return groupedPattern;
  };

  return (
    <div className="app">
      <div id="app-body">
        <AppStateBar
          totalLines={totalLines}
          currentLines={currentLines}
          errorValue={errorValue}
          isEditMode={isEditMode}
          setErrorValue={setErrorValue}
        ></AppStateBar>
        <GrokSetSelection
          grokPatternSets={grokPatternSets}
          setGrokPatternSets={setGrokPatternSets}
        ></GrokSetSelection>
        <Filter
          setErrorValue={setErrorValue}
          setEditedPatternName={setEditedPatternName}
          setLogMessagePatterns={setLogMessagePatterns}
          setEditedDoc={setEditedDoc}
          setFilterText={setFilterText}
          filterText={filterText}
          logMessagePatterns={logMessagePatterns}
          grokPattern={grokPattern}
          filterRef={filterRef}
          originalDocOutput={originalDocOutput}
          logMessageCombiantionPattern={logMessageCombiantionPattern}
          editedPatternName={editedPatternName}
          resolveSubPatterns={resolveSubPatterns}
          getSavedPatterns={getSavedPatterns}
        ></Filter>
        <ToolBar
          setEditedPatternName={setEditedPatternName}
          setExportModalText={setExportModalText}
          setLogMessagePatterns={setLogMessagePatterns}
          setLogMessageCombinationPattern={setLogMessageCombinationPattern}
          refExportModal={refExportModal}
          logMessagePatterns={logMessagePatterns}
          filterRef={filterRef}
          setErrorValue={setErrorValue}
        ></ToolBar>
        <MainText
          setCurrentLines={setCurrentLines}
          setTotalLines={setTotalLines}
          setSelectionMatch={setSelectionMatch}
          setOriginalDocOutput={setOriginalDocOutput}
          isEditMode={isEditMode}
          logMessageCombiantionPattern={logMessageCombiantionPattern}
          grokPattern={grokPattern}
          filterText={filterText}
          originalDocOutput={originalDocOutput}
          filterRef={filterRef}
          selectionMatch={selectionMatch}
          editedDoc={editedDoc}
          resolveSubPatterns={resolveSubPatterns}
        ></MainText>
        <ExportModal exportModalText={exportModalText} modalRef={refExportModal}></ExportModal>
        <div id="footer">
          <a href="https://pajda.fit.vutbr.cz/testos/logreaper">
            <i className="fab fa-gitlab"></i>
          </a>
          <img src={logo} alt="testos-logo"></img>
          <p>TESTOS</p>
        </div>
      </div>
    </div>
  );
}
export default App;
