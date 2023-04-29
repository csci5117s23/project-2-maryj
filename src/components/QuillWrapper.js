// This is still broken as heelllllll

import React, { useEffect, useMemo, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useAuth } from '@clerk/nextjs';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const WrappedReactQuill = forwardRef((props, forwardedRef) => {
      const quillRef = useRef(null);
      const { isLoaded, userId, sessionId, getToken } = useAuth();

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

          fileInput.addEventListener("change", () => {
            const files = fileInput.files;
            const range = quill.getSelection(true);

            if (!files || !files.length) {
              console.log("No files selected");
              return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = async () => {
              const base64Image = reader.result.split(",")[1];

              console.log("Trying upload");
              const token = await getToken({ template: "codehooks" });
              fetch("https://backend-qsum.api.codehooks.io/dev/upload-image", {
                method: "POST",
                headers: {
                  "Authorization": "Bearer " + token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: base64Image }),
              })
                .then((response) => {
                  console.log("response", response);
                  return response.json();
                })
                .then((data) => {
                  const url = data.url; // Assuming the API returns the URL of the uploaded image
                  console.log("url", url);
                  quill.insertEmbed(range.index, "image", url, "user");
                })
                .catch((error) => {
                  console.error(error);
                });
            };
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
              ["link", "image"],
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
          ref={(ref) => {
            quillRef.current = ref;
          }}
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
