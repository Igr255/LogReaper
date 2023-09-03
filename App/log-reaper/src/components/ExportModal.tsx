/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: A modal vindow displaying the processed YAML from the Toolbar component.
 **/

import { Button } from "@mui/material";
import { RefObject } from "react";
import "../css/ExportModal.css";

type Props = {
  modalRef: RefObject<HTMLDivElement>;
  exportModalText: string;
};

function ExportModal(props: Props) {
  // hides the modal window when X is clicked
  const onModalClose = () => {
    if (props.modalRef.current !== null) props.modalRef.current.style.visibility = "hidden";
  };

  return (
    <div id="export-modal" ref={props.modalRef}>
      <div id="modal-background">
        <div id="modal-content">
          <div id="modal-controls">
            <Button onClick={(event) => onModalClose()}>X</Button>
          </div>
          <textarea readOnly id="modal-text" defaultValue={props.exportModalText}></textarea>
        </div>
      </div>
    </div>
  );
}
export default ExportModal;
