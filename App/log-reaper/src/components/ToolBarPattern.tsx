/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Component for a single log message pattern, storing its data.
 **/

import "../css/ToolBar.css";
import "../css/App.css";
import Checkbox from "@mui/material/Checkbox";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import { nanoid } from "nanoid";
import { MessagePatternData } from "../types/types";

type Props = {
  logMessagePattern: MessagePatternData;
  onSetLogMessagePatternAsFilter: (event: any, logMessagePattern: MessagePatternData) => void;
  onLogMessagePatternSelection: (event: any, logMessagePattern: MessagePatternData) => void;
  onEditLogMessagePattern: (event: any, logMessagePattern: MessagePatternData) => void;
};

// component for every single log message pattern inside the toolbar
function ToolBarPattern(props: Props) {
  return (
    <div className="tool-bar-pattern">
      <div className="pattern-edit">
        <Button
          variant="contained"
          style={{
            borderRadius: 5,
            margin: 0,
            padding: 0,
          }}
          onClick={(event) =>
            props.onSetLogMessagePatternAsFilter(event, props.logMessagePattern)
          }
        >
          ←
        </Button>
      </div>
      <input
        value={props.logMessagePattern.name}
        onChange={(event) => props.onEditLogMessagePattern(event, props.logMessagePattern)}
        type="text"
        className="pattern-name"
        name="pattern-name"
      />
      <div className="pattern-selection">
        <Checkbox
          sx={{
            color: "#37975c",
            padding: 0,
            "&.Mui-checked": {
              color: "#37975c",
              padding: 0,
            },
          }}
          onChange={(event) =>
            props.onLogMessagePatternSelection(event, props.logMessagePattern)
          }
        />
      </div>
      <TreeView
        className="pattern-values"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="1" label="Message pattern data" className="pattern-value">
          {props.logMessagePattern.patterns.map((pt: any) => (
            <div className="log-message-patterns" key={nanoid()}>
              <div
                className={
                  pt.type === 0
                    ? "pattern-type"
                    : pt.type === 1
                    ? "pattern-type grokHighlight"
                    : "pattern-type paramReHighlight"
                }
              >
                {pt.type === 0 ? "Re" : pt.type === 1 ? "Grok" : "PRe"}
              </div>
              <div className="pattern-text">{'"' + pt.value + '"'}</div>
            </div>
          ))}
        </TreeItem>
      </TreeView>
    </div>
  );
}
export default ToolBarPattern;
