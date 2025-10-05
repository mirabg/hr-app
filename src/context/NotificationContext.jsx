import React, { createContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = useCallback((msg, ms = 3500) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), ms);
  }, []);

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <div
        className={`toast position-fixed top-0 end-0 m-3 ${
          visible ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ transition: "opacity 0.3s" }}
      >
        <div className="toast-header">
          <strong className="me-auto">Notification</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setVisible(false)}
          />
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
