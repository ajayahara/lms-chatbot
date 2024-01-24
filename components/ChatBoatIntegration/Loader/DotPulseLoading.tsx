import React from "react";
import styles from "./DotPulseLoading.module.css";
export const DotPulseLoading = () => {
  return (
    <div className={styles.stage}>
      <div className={styles.dot_pulse}></div>
    </div>
  );
};
