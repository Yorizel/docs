import React from 'react';
import TextEditor from './components/textEditor';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'}>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path={'/documents/:id'}>
          <TextEditor />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
