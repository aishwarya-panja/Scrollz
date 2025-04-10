import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/BlogPage";

const CommentField = ({ action }) => {
  let {
    blog: { _id, author: {_id: blog_author } },
  } = useContext(BlogContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const [comment, setComment] = useState("");

  const serverDomain =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Login first to leave a Comment !!!");
    }

    if (!comment.length) {
      return toast.error("Write something to comment !!!");
    }

    axios.post(serverDomain + "/add-comment", {
      _id, blog_author, comment
    }, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    .then(({ data }) => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment here..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
