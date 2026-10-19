import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./header";
import Body from "./Body";
import Footer from "./Footer";

const App = () => {
    return (
        <React.Fragment>
            <Header />
            <Body />
            <Footer />
        </React.Fragment>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
