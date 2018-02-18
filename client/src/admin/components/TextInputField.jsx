// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";

export default function TextInputField({ label, name, rows, value, onValueChange, onRefresh, errorMessage, enabled = true }) {
  const disabled = !enabled;

  const inputComponent = rows ? (
    <textarea
      className="Control"
      name={name || label.toLocaleLowerCase()}
      rows={rows}
      value={value}
      disabled={disabled}
      placeholder={label}
      onChange={onValueChange}
    />
  ) : (
    <input
      className="Control"
      name={name || label.toLocaleLowerCase()}
      type="text"
      value={value}
      disabled={disabled}
      placeholder={label}
      onChange={onValueChange}
    />
  );
  const refreshButton = onRefresh ? (
    <i className="fa fa-refresh fa-lg Control-AddOn" onClick={enabled ? onRefresh : null} />
  ) : null;

  const errorBox = errorMessage ? <div style={{ clear: "both", backgroundColor: "red" }}>{errorMessage}</div> : null;

  return (
    <div className="EditorGroup">
      {inputComponent}
      {refreshButton}
      {errorBox}
    </div>
  );
}
