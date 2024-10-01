import React from "react";
import { themes } from "./images";

export const template = ({
  name,
  username,
}: {
  name: string;
  username: string;
}) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center", 
    height: "100vh",
    width: "100vw",
    background: themes.jsconf.backgroundImage,
  }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "351px",
      gap: "16px",
      marginTop: "260px",
      marginLeft: "130px;"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        width: "90%",
        margin: "0 auto",
        fontSize: name.length >= 20 ? "24px" : "34px",
        fontWeight: 600,
        fontFamily: "Barlow",
        color: "white",
        height: name.length >= 20 ? "28px" : "34px",
        overflow: "hidden"
      }}>
        {name.slice(0, 40)}
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: 700,
        fontFamily: "Inconsolata",
        color: "#F0E040",
        height: "22px",
        overflow: "hidden"
      }}>
        @{username}
      </div>       
    </div>
  </div>
);