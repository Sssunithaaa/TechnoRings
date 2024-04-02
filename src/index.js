import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux'
// import store from './store/store'
import { registerLicense } from "@syncfusion/ej2-base";
import { ContextProvider } from "./context/ContextProvider";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCfUx0QXxbf1x0ZFRMY1hbRnBPMyBoS35RckVgWHhecXdRRGZfVURw"
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     {/* <Provider store={store}> */}
    <ContextProvider>
      <App />
    </ContextProvider>
    {/* </Provider> */}
  </React.StrictMode>
);
