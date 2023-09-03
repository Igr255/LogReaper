/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Popup component handling positioning of the popup and user selection.
 **/

import { Button, List, ListItemButton, ListItemText } from "@mui/material";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { RefObject, useEffect } from "react";
import "../css/Popup.css";
import { GrokPattern } from "../types/types";

type Props = {
  filterRef: RefObject<ReactCodeMirrorRef>;
  popupRef: RefObject<HTMLDivElement>;
  selectionMatch: GrokPattern[];
};

function Popup(props: Props) {
  // hide popup if the user clicks outside of it
  // by checking if the clicked element is popup or its content
  document.onmouseup = function (e) {
    if (
      props.popupRef.current !== null &&
      (e.target as HTMLDivElement).id !== props.popupRef.current.id &&
      (e.target as HTMLDivElement).id !== props.popupRef.current.firstElementChild?.id
    ) {
      props.popupRef.current.style.visibility = "hidden";
    }
  };

  // hide the popup if the Escape key is pressed
  document.onkeyup = function (e) {
    if (
      props.popupRef.current !== null &&
      e.key === "Escape" &&
      (e.target as HTMLDivElement).id !== props.popupRef?.current?.id
    ) {
      props.popupRef.current.style.visibility = "hidden";
    }
  };

  useEffect(() => {
    var selection = window.getSelection && window.getSelection();

    // check if selection was made inside the main text window
    var isCodeMirrorParent = selection?.anchorNode?.parentElement?.closest("#main-text");

    if (selection && selection.rangeCount > 0 && isCodeMirrorParent != null) {
      // getting the start and end of selection and also its range
      var r = window!.getSelection()!.getRangeAt(0).getBoundingClientRect();

      var width = 0;
      if (selection.rangeCount) {
        var range = selection.getRangeAt(0).cloneRange();
        if (range.getBoundingClientRect) {
          var rect = range.getBoundingClientRect();

          // calculate the are of the selection
          width = rect.right - rect.left;

          // if there is a selection make the popup visible at the coordinates
          // otherwise hide the popup (or do not show it)
          if (props.popupRef != null && props.popupRef.current != null) {
            if (props.selectionMatch.length > 0) {
              var popupTopPosition = rect.bottom - props.popupRef.current.offsetHeight;
              var popupTopPositionOverFlow = rect.top;

              props.popupRef.current.style.left = r.x + 25 + width + "px";
              props.popupRef.current.style.position = "absolute";
              props.popupRef.current.style.opacity = "1";

              var topEdgeInRange =
                popupTopPosition >= 0 && popupTopPosition <= window.innerHeight;
              if (!topEdgeInRange)
                props.popupRef.current.style.top = popupTopPositionOverFlow + "px";
              else props.popupRef.current.style.top = popupTopPosition + "px";

              props.popupRef.current.style.visibility = "visible";
            } else {
              props.popupRef.current.style.visibility = "hidden";
              props.popupRef.current.style.opacity = "0";
            }
          }
        }
      }
    }
  }, [props.selectionMatch, props.popupRef]);

  // upon selecting a Grok pattern from the popup menu
  // update the filter's text, appending the selected Grok pattern
  // to its end
  const createNewPattern = (event: any, value: string) => {
    event.preventDefault();
    var view = props.filterRef?.current?.view;
    if (view !== undefined) {
      view.dispatch(
        view.state.update({
          changes: { from: view.state.doc.length, insert: value },
        })
      );
    }
  };

  return (
    <div id="popup" ref={props.popupRef}>
      <div id="popup-content">
        <List dense={true} sx={{ padding: "0px" }}>
          {props.selectionMatch.map((grok: GrokPattern) => (
            <ListItemButton
              key={grok.name}
              onClick={(event) => createNewPattern(event, "%{" + grok.name + "}")}
              sx={{
                fontSize: "5px",
                height: "1.5rem",
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                border: "1px solid black",
              }}
            >
              <ListItemText primary={grok.name} />
            </ListItemButton>
          ))}
        </List>
      </div>
      <Button
        id="popup-regex-button"
        onClick={(event) =>
          createNewPattern(
            event,
            "%{r(" +
              window
                .getSelection()!
                .toString()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
              "):_}"
          )
        }
      >
        Use as regex
      </Button>
    </div>
  );
}
export default Popup;
