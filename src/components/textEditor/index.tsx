import React from 'react';
import 'quill/dist/quill.snow.css';
import { useTextEditorController } from '../../controllers/TextEditorController';

function TextEditor() {
  const { wrapperRef } = useTextEditorController();
  return (
    <div ref={wrapperRef} className={'container '}>
      <></>
    </div>
  );
}

export default TextEditor;
