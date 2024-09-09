import axios from "axios";
import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface blogeditorProps {
  html: string;
  setHtml: Dispatch<SetStateAction<string>>;
}
const BlogEditor: React.FC<blogeditorProps> = ({ html, setHtml }) => {
  const quill = useRef<ReactQuill | null>(null);

  const imageHandler = useCallback(async () => {
    const imageUrlKey = prompt("Enter the URL key of the image");

    if (imageUrlKey && quill.current) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/blog/getImage?key=${imageUrlKey}`
        );

        const signedUrl = response.data;

        const quillEditor = quill.current.getEditor();
        const range = quillEditor.getSelection(true);

        quillEditor.insertEmbed(range.index, "image", signedUrl);
      } catch (error) {
        console.error("Error fetching or inserting image:", error);
      }
    }
  }, []);

  const handleEditorChange = (content: string) => {
    setHtml(content);
  };
  console.log(html);
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    };
  }, [imageHandler]);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <div className="blogeditor">
      <p className="title">Editor Content</p>
      <ReactQuill
        ref={(el) => {
          quill.current = el;
        }}
        className="quilleditor"
        theme="snow"
        value={html} // Bind the HTML content
        formats={formats}
        modules={modules}
        onChange={handleEditorChange} // Update both HTML and CSS content
      />
    </div>
  );
};

export default BlogEditor;
