import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import Loader from "../components/Loader";
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setloading] = useState(true);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const serverDomain =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

  useEffect(() => {
    if (!blog_id) {
      return setloading(false);
    }

    axios
      .post(serverDomain + "/get-blog", { blog_id, draft: true, mode: "edit" })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setloading(false);
      })
      .catch((err) => {
        setBlog(null);
        setloading(false);
      });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
