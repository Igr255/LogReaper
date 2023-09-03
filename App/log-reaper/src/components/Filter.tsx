/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Filter component handles the text filtering based on the values in the input filter
 * with the combination of the selected log message patterns inside of the ToolBar component.
 * Also handles highlighting of individual Grok patterns/Parametrized regexes.
 **/

import { Button } from "@mui/material";
import { OnigRegExp } from "onigasm";
import { Dispatch, RefObject, useEffect, useState } from "react";
import "../css/Filter.css";
import CodeMirror, { BasicSetupOptions, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ViewUpdate, Decoration, EditorView } from "@codemirror/view";
import { EditorState, StateField, StateEffect } from "@codemirror/state";
import createTheme from "@uiw/codemirror-themes";
import { nanoid } from "nanoid";
import { tags as t } from "@lezer/highlight";
import { json } from "@codemirror/lang-json";
import { GrokPattern, MessagePatternData } from "../types/types";

const myTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#2a2d34",
    foreground: "white",
    caret: "yellow",
    selection: "#036dd626",
    selectionMatch: "#036dd626",
    lineHighlight: "#8a91991a",
    gutterBackground: "#3f434c",
    gutterForeground: "#ced4da",
  },
  styles: [{ tag: [t.brace], color: "#67dbb1" }],
});

type Props = {
  editedPatternName: string;
  grokPattern: GrokPattern[];
  setErrorValue: Dispatch<React.SetStateAction<string>>;
  filterRef: RefObject<ReactCodeMirrorRef>;
  filterText: string;
  setFilterText: Dispatch<React.SetStateAction<string>>;
  resolveSubPatterns: (resolvedPattern: string) => string;
  logMessagePatterns: MessagePatternData[];
  setLogMessagePatterns: Dispatch<React.SetStateAction<MessagePatternData[]>>;
  setEditedDoc: Dispatch<React.SetStateAction<string[]>>;
  logMessageCombiantionPattern: string[];
  getSavedPatterns: () => string;
  originalDocOutput: string[];
  setEditedPatternName: Dispatch<React.SetStateAction<string>>;
};

const opt: BasicSetupOptions = {
  lineNumbers: false,
  highlightActiveLine: false,
  foldGutter: false,
};

function Filter(props: Props) {
  // timeout for text filtering
  // waiting for the user to finish typing the text inside of the filter
  var editorTimer: NodeJS.Timeout;
  var editorTimerInterval: number = 1000;

  // CodeMirror extension for text highlight
  const [highlightEffect] = useState(StateEffect.define());

  const [grokPatternsRegex] = useState(/(%\{[A-Z0-9_]+(?::[A-Za-z0-9_]+)?\})/g);
  const [paramReRegex] = useState(/(%\{r\(.+?\):[A-Za-z0-9_]+?\})/g);
  const [grokAndParamReRegex] = useState(
    /(%\{r\(.+?\):[A-Za-z0-9_]+?\})|(%\{[A-Z0-9_]+(?::[A-Za-z0-9_]+)?\})/g
  );

  useEffect(() => {
    const filterDoc = async (retrievedPatterns: string) => {
      // set pattern to regex pattern
      var onigRe = new OnigRegExp(retrievedPatterns);

      var splitDoc = [...props.originalDocOutput].filter(function (str: string) {
        try {
          return onigRe.searchSync(str) != null;
        } catch (e) {
          props.setErrorValue("Invalid expression.");
          return null;
        }
      });
      props.setEditedDoc(splitDoc);
    };

    const filter = async () => {
      // retrieve saved patterns
      var retrievedPatterns = props.getSavedPatterns();
      var filterPattern = props.resolveSubPatterns(props.filterText);

      if (filterPattern != null && filterPattern) {
        // save current grok for export
        retrievedPatterns += filterPattern;
      } else {
        retrievedPatterns += props.filterText;
      }
      await filterDoc(retrievedPatterns);
    };

    filter();
  }, [props.filterText, props.logMessageCombiantionPattern, props.grokPattern]);

  const onInputEnterPressed = (event: React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // check if eneter has been pressed
    if (event.key === "Enter") {
      exportLogMessagePattern();
    }
  };

  // export patterns inside pattern filter into a log message pattern
  const exportLogMessagePattern = () => {
    // get current text (do nto wait for filterText hook)
    var view = props.filterRef?.current?.view;
    if (view !== undefined) {
      var text = view.state.doc.line(1).text;
      var matches = text.split(grokAndParamReRegex);
      var patternArray: any = [];

      if (text !== "") {
        matches.forEach((item: string) => {
          if (item !== undefined && item.length > 0) {
            var newPattern = { type: 0, value: "" };

            // assign pattern type (Grok = 1, ParamRe = 2, Re = 3)
            if (
              item.match(grokPatternsRegex) &&
              props.grokPattern.filter((grokPattern) => item.includes(grokPattern.name))
                .length > 0
            ) {
              newPattern.type = 1;
            } else if (item.match(paramReRegex)) {
              newPattern.type = 2;
            } else {
              newPattern.type = 0;
            }
            newPattern.value = item;
            patternArray.push(newPattern);
          }
        });

        var expressionValue = props.resolveSubPatterns(text);

        var newMessagePattern: MessagePatternData = {
          id: nanoid(),
          checked: false,
          name: props.editedPatternName,
          value: expressionValue,
          patterns: patternArray,
        };

        var messagePatternsCopy = [...props.logMessagePatterns];
        messagePatternsCopy.push(newMessagePattern);
        props.setLogMessagePatterns(messagePatternsCopy);
        props.setEditedPatternName("New pattern");

        if (view !== undefined) {
          view.dispatch(
            view.state.update({
              changes: { from: 0, to: view.state.doc.length, insert: "" },
            })
          );
        }
      }
    }
  };

  const changeEditorValue = (value: string) => {
    props.setFilterText(value);
  };

  useEffect(() => {
    var view = props.filterRef?.current?.view;

    if (view !== undefined || view != null) {
      // initialization of text decoretions for Grok patterns
      // and parametrized regular expressions
      var lineDecorationGrok = Decoration.mark({
        attributes: { class: "grokHighlight" },
      });
      var lineDecorationParamRe = Decoration.mark({
        attributes: { class: "paramReHighlight" },
      });

      var match: any;
      var lineDecorations = [];

      // iterate trough filter text using regex matching Grok pattern syntax
      while ((match = grokPatternsRegex.exec(view.state.doc.line(1).text)) != null) {
        // check if Grok is valid (it is inside of selected Grok pattern sets)
        var subPatternArray = props.grokPattern.filter(
          (gp: GrokPattern) => gp.name === match[0].slice(2, -1).split(":")[0]
        );

        // if the Grok pattern is valid, create a decoration on the Grok pattern's position
        if (subPatternArray.length > 0) {
          lineDecorations.push(
            lineDecorationGrok.range(match.index, match.index + match[0].length)
          );
        }
      }

      // iterate trough filter text using regex matching parametrized regular expression syntax
      while ((match = paramReRegex.exec(view.state.doc.line(1).text)) != null) {
        lineDecorations.push(
          lineDecorationParamRe.range(match.index, match.index + match[0].length)
        );
      }

      // apply decoration trough CodeMirror transactions
      view.dispatch({ effects: (highlightEffect as any).of(lineDecorations) });
    }
  }, [
    props.filterRef?.current?.view?.state,
    highlightEffect,
    grokPatternsRegex,
    paramReRegex,
    props.filterRef,
    props.grokPattern,
  ]);

  const highlightExtension = StateField.define({
    // create an empty decoration on CodeMirror editor load
    create() {
      return Decoration.none;
    },
    // this update function is called upon dispatching changes to CodeMirror's view
    update(highlight, tr) {
      highlight = highlight.map(tr.changes);

      // if a transaction with a 'highlighEffect' decoration is found
      // apply it to the text editor (with the effect specified on dispatching)
      for (let e of tr.effects) {
        if (e.value != null && e.is(highlightEffect))
          highlight = highlight.update({
            add: e.value,
            sort: true,
          });
      }

      return highlight;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  // Activate this function when a change occurs in the main text window
  const onEditorChange = async (value: string, viewUpdate: ViewUpdate) => {
    clearTimeout(editorTimer);
    editorTimer = setTimeout(() => changeEditorValue(value), editorTimerInterval);
  };

  return (
    <div id="filter">
      <div id="user-input-wrapper">
        <CodeMirror
          ref={props.filterRef}
          basicSetup={opt}
          onChange={(value: string, viewUpdate: ViewUpdate) =>
            onEditorChange(value, viewUpdate)
          }
          extensions={[
            highlightExtension,
            json(),
            EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr)),
          ]}
          theme={myTheme}
          onKeyUp={(event) => onInputEnterPressed(event)}
        />
      </div>

      <div id="button-wrapper">
        <Button variant="contained" onClick={(event) => exportLogMessagePattern()}>
          →
        </Button>
      </div>
    </div>
  );
}
export default Filter;
