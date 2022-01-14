import React from "react";
import BaseView from "./core/BaseView";

function Home() {
  return (
    <BaseView titleString={"Home"} descriptionString={"Welcome to HomePage"}>
      <iframe
        width="600"
        height="320"
        src="https://datastudio.google.com/embed/reporting/d559f4b2-6d97-4255-9066-43c5b04b0811/page/qxZhC"
        frameborder="0"
        style={{ border: "0px" }}
        allowfullscreen
      ></iframe>
    </BaseView>
  );
}

export default Home;
