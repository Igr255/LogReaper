/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Component of the main text window of the application (line count setting, popup calling, line hitboxes).
 **/

import "../css/MainText.css";
import { OnigRegExp } from "onigasm";
import CodeMirror, { BasicSetupOptions, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration, ViewUpdate } from "@codemirror/view";
import { Dispatch, RefObject, useEffect, useRef, useState } from "react";
import Popup from "./Popup";
import { GrokPattern } from "../types/types";

// theme for main text window
const myTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#2a2d34",
    foreground: "white",
    caret: "yellow",
    selection: "#FFFFFF64",
    selectionMatch: "#FFFFFF24",
    lineHighlight: "#8a91991a",
    gutterBackground: "#3f434c",
    gutterForeground: "#ced4da",
  },
  styles: [],
});

type Props = {
  filterRef: RefObject<ReactCodeMirrorRef>;
  filterText: string;
  grokPattern: GrokPattern[];
  logMessageCombiantionPattern: string[];
  editedDoc: string[];
  setSelectionMatch: Dispatch<React.SetStateAction<GrokPattern[]>>;
  selectionMatch: GrokPattern[];
  setOriginalDocOutput: Dispatch<React.SetStateAction<string[]>>;
  originalDocOutput: string[];
  setCurrentLines: Dispatch<React.SetStateAction<number>>;
  setTotalLines: Dispatch<React.SetStateAction<number>>;
  isEditMode: boolean;
  resolveSubPatterns: (resolvedPattern: string) => string;
};

function MainText(props: Props) {
  const refMain = useRef<ReactCodeMirrorRef>({});
  const refPopup = useRef<HTMLDivElement>(null);
  const [hitboxEffect] = useState(StateEffect.define());
  const basicSetup: BasicSetupOptions = { foldGutter: false };
  const { resolveSubPatterns, setSelectionMatch, setCurrentLines, setTotalLines } = props;

  // add event to the main text window for selection checking
  useEffect(() => {
    var popupTimer: any;
    var popupInterval: number = 500;

    // check if string matches an GROK pattern
    const getRecommendedGrok = (textToMatch: string): GrokPattern[] => {
      var matchedPatterns = [];

      for (var i = 0; i < props.grokPattern.length; i++) {
        // compare pattern to the entire selected string
        var reVal = "^(" + resolveSubPatterns(props.grokPattern[i].value) + ")$";
        var onigRe = new OnigRegExp(reVal);
        var matches = onigRe.searchSync(textToMatch);

        // if selected text is a GROK, change its value to already parsed GROK (nested GROKS have been replaced with RE)
        if (matches != null && matches.length > 0) {
          props.grokPattern[i].value = reVal.slice(1, -1);
          matchedPatterns.push(props.grokPattern[i]);
        }
      }

      // prioritize the best match
      return matchedPatterns;
    };

    // this function is called when the user highlights a specific part of the text
    const checkForSelection = async (event: any) => {
      event.stopPropagation();
      var text = "";

      // check that the selection was made inside of the main text window and not anywhere else
      if (
        document.activeElement?.closest("#" + refMain.current.editor?.parentElement?.id) !=
        null
      ) {
        text = window.getSelection()!.toString();
        // display popup only if the highlight is on a single line
        if (!text.includes("\n") && text !== "" && text !== null && text !== undefined) {
          setSelectionMatch(getRecommendedGrok(text));
        }
      }
    };

    document.onselectionchange = function (event: any) {
      popupTimer = setTimeout(() => checkForSelection(event), popupInterval);
    };

    return () => {
      clearTimeout(popupTimer);
    };
  }, [props.grokPattern, resolveSubPatterns, setSelectionMatch]);

  // setting lines on change of document
  useEffect(() => {
    setCurrentLines(props.originalDocOutput.length);
    setTotalLines(props.originalDocOutput.length);
  }, [setCurrentLines, setTotalLines, props.originalDocOutput]);

  // update the document in the main text window after it was filtered
  useEffect(() => {
    var view = refMain?.current.view;
    if (view !== undefined) {
      view.dispatch(
        view.state.update({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: props.editedDoc.join("\n"),
          },
        })
      );
      setCurrentLines(props.editedDoc.length);
    }
  }, [props.editedDoc, setCurrentLines]);

  // update hitboxes(red lines on each text line) on the main text window
  useEffect(() => {
    var view = refMain?.current.view;
    var activeLogMessagePatterns = props.logMessageCombiantionPattern;

    if (view !== undefined && activeLogMessagePatterns.length !== 0) {
      var selected_lines: any = [];
      var currentCmDoc = view?.state.doc;

      if (
        view !== null &&
        view !== undefined &&
        currentCmDoc !== null &&
        currentCmDoc !== undefined
      ) {
        // line number starts from 1, so indexing is moved by 1
        // iterate trough every line of the text
        for (var i = 1; i < currentCmDoc.lines + 1; i++) {
          var currentLine = view.state.doc.line(i);
          var opacity = 0;

          // iterate trough selected log message patterns
          // when a pattern matches the text on the line the hitbox opacity's alpha channel
          // is incremented by 0.3
          for (var j = 0; j < activeLogMessagePatterns.length; j++) {
            var onigRe = new OnigRegExp(activeLogMessagePatterns[j]);
            try {
              if (onigRe.searchSync(currentLine.text) != null) {
                opacity += 0.3;
                if (opacity >= 1) {
                  break;
                }
              }
            } catch (e) {}
          }

          // set gradient to create a hitbox on the current line
          var bgStyle =
            "background: linear-gradient(90deg, rgba(253,29,29," +
            opacity +
            ") 0.3%, rgba(252,176,69,0) 0.3%)";
          var line_decoration = Decoration.line({
            attributes: { style: bgStyle },
          });
          selected_lines.push(line_decoration.range(currentLine.from));
        }

        view.dispatch({ effects: (hitboxEffect as any).of(selected_lines) });
      }
    }
  }, [refMain?.current?.view?.state, hitboxEffect, props.logMessageCombiantionPattern]);

  // update the text in the edit mode
  const changeEditorValue = (value: string) => {
    if (props.filterText === "" && props.logMessageCombiantionPattern.length === 0) {
      var newValue = value.split("\n");
      props.setOriginalDocOutput(newValue);
    }
  };

  // highlight extension for main text (same as in the filter component)
  const hitboxExtension = StateField.define({
    create() {
      return Decoration.none;
    },
    update(hitbox, tr) {
      hitbox = hitbox.map(tr.changes);

      for (let e of tr.effects) {
        if (e.value != null && e.is(hitboxEffect))
          hitbox = hitbox.update({
            add: e.value,
            sort: true,
          });
      }

      return hitbox;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  return (
    <div id="main-text">
      <CodeMirror
        ref={refMain}
        height="200px"
        value={props.originalDocOutput.join("\n")}
        onChange={(value: string, viewUpdate: ViewUpdate) => changeEditorValue(value)}
        theme={myTheme}
        extensions={[hitboxExtension]}
        basicSetup={basicSetup}
        readOnly={!props.isEditMode}
      />
      <Popup
        filterRef={props.filterRef}
        popupRef={refPopup}
        selectionMatch={props.selectionMatch}
      ></Popup>
    </div>
  );
}
export default MainText;
