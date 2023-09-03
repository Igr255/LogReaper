/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Component for selecting individual grok sets.
 * The grok sets that are displayed in this components can be set in App component.
 **/

import { Checkbox } from "@mui/material";
import { nanoid } from "nanoid";
import { Dispatch } from "react";
import "../css/GrokSetSelection.css";
import { GrokPatternSet } from "../types/types";

type Props = {
  grokPatternSets: GrokPatternSet[];
  setGrokPatternSets: Dispatch<React.SetStateAction<GrokPatternSet[]>>;
};

function GrokSetSelection(props: Props) {
  const onSetSelectionChange = async (event: any, set: GrokPatternSet) => {
    // check if the checkbox was activated/deactivated
    // and set the GrokSets pattern state to activated
    set.isActive = event.target.checked ? true : false;
    var patternSetsCopy = [...props.grokPatternSets];
    const index = props.grokPatternSets.findIndex((pattern) => pattern.name === set.name);
    patternSetsCopy[index] = set;
    props.setGrokPatternSets(patternSetsCopy);
  };

  return (
    <div id="side-bar">
      <div id="side-bar-title">Available Grok sets</div>
      <div id="side-bar-data">
        {props.grokPatternSets.map((set: GrokPatternSet) => (
          <div className="pattern-set" key={nanoid()}>
            <div className="pattern-set-data">
              <div>{set.name}</div>
              <Checkbox
                className="set-checkbox"
                checked={set.isActive ? set.isActive : false}
                onChange={(event) => onSetSelectionChange(event, set)}
                sx={{
                  marginLeft: "auto",
                  color: "#37975c",
                  padding: 0,
                  "&.Mui-checked": {
                    color: "#37975c",
                    padding: 0,
                  },
                }}
              ></Checkbox>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default GrokSetSelection;
