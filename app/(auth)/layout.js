import React from "react";

function layout({ children }) {
  return (
    <div className="flex justify-center items-center pt-40">{children}</div>
  );
}

export default layout;
