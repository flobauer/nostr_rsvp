import { useState } from "react";
import PropTypes from "prop-types";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard() {
    const text = window.location.href;
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard()
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="float-right">
      {/* Bind our handler function to the onClick button property */}
      <button
        onClick={handleCopyClick}
        className="w-14 hover:bg-gray-200 rounded-full h-14 flex items-center justify-center flex-col">
        {!isCopied && <ArrowUpOnSquareIcon className="h-7 w-7 text-gray-800" />}
        {isCopied && <span className="text-xs text-green-500">Copied!</span>}
      </button>
    </div>
  );
}

export default ShareButton;
