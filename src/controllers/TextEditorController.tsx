import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Delta from 'quill-delta';
import Quill, { Sources } from 'quill';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { useParams } from 'react-router-dom';

interface Params {
  socket?: Socket<DefaultEventsMap, DefaultEventsMap> | any;
  quill?: Quill & any;
}

export const useTextEditorController = () => {
  const TOOLBAR_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'],
    ['image', 'blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean']
  ];

  const [state, setState] = useState<Params>({
    socket: io(''),
    quill: undefined
  });
  const { id } = useParams<any>();
  useEffect(() => {
    if (state.socket == null || state.quill == null) return;
    state.socket.once('load-document', async (document: any) => {
      console.log(document);
      await state.quill.setContents(document?.documentData);
      await state.quill.enable();
    });
    state.socket.emit('get-document', id);
  }, [state.socket, state.quill, id]);
  useEffect(() => {
    if (state.socket == null || state.quill == null) return;
    const handler = (delta: Delta, oldDelta: Delta, source: Sources) => {
      if (source !== 'user') return;
      state.socket.emit('send-changes', delta);
    };
    state.quill.on('text-change', handler);
    return () => {
      state.quill.off('text-change', handler);
    };
  }, [state.socket, state.quill]);

  useEffect(() => {
    if (state.socket == null || state.quill == null) return;
    const interval = setInterval(() => {
      state.socket.emit('save-document', state.quill.getContents());
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [state.socket, state.quill]);

  useEffect(() => {
    if (state.socket == null || state.quill == null) return;
    const handler = (delta: any) => {
      return state.quill.updateContents(delta);
    };
    console.log(state);
    state.socket.on('receive-changes', handler);
    return () => {
      state.socket.off('receive-changes', handler);
    };
  }, [state.socket, state.quill]);

  useEffect(() => {
    const soc = io('http://localhost:8080');
    setState((prevState) => ({ ...prevState, socket: soc }));
    return () => {
      soc.disconnect();
    };
  }, []);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const ql = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS }
    });
    ql.disable();
    ql.setText('Carregando...');
    return setState((prevState) => ({ ...prevState, quill: ql }));
  }, []);

  return {
    wrapperRef
  };
};
