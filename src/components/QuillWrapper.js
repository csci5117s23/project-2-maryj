// This is still broken as heelllllll

import React, { useEffect, useMemo, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const WrappedReactQuill = ((props, forwardedRef) => {
      const quillRef = useRef(null);

      // Custom image upload handler
      function imgHandler() {
        const quill = quillRef.current.getEditor();
        let fileInput = quill.root.querySelector("input.ql-image[type=file]");

        // to prevent duplicate initialization
        if (fileInput === null) {
          fileInput = document.createElement("input");
          fileInput.setAttribute("type", "file");
          fileInput.setAttribute(
            "accept",
            "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
          );
          fileInput.classList.add("ql-image");

          fileInput.addEventListener("change", () => {
            const files = fileInput.files;
            const range = quill.getSelection(true);

            if (!files || !files.length) {
              console.log("No files selected");
              return;
            }

            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("uid", uid);
            formData.append("img_type", "detail");
            quill.enable(false);
            console.log(files[0]);
          });
          quill.root.appendChild(fileInput);
        }
        fileInput.click();
      }

      const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              [{ font: [] }],
              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              ["bold", "italic", "underline", "strike"], // toggled buttons
              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ header: 1 }, { header: 2 }], // custom button values
              ["blockquote", "code-block"],
              ["link", "image", "video"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ align: [] }],
              ["clean"], // remove formatting button
            ],
            handlers: {
              image: imgHandler,
            },
          },
        }),
        []
      );

      return (
        <RQ
          ref={quillRef}
          modules={modules}
          {...props}
        />
      );
    });

    WrappedReactQuill.displayName = "ReactQuill";

    return WrappedReactQuill;
  },
  {
    ssr: false,
  }
);

function QuillWrapper({ value, onChange, ...props }) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default QuillWrapper;
