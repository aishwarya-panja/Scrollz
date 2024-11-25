import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  const serverDomain =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

  useEffect(() => {
    if (access_token) {
      // make request to server to get like information
      axios
        .post(
          serverDomain + "/isliked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLike = () => {
    if (access_token) {
      //like the blog
      console.log("liked");

      setLikedByUser((preVal) => !preVal);
      !isLikedByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          serverDomain + "/like-blog",
          { _id, isLikedByUser },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // not logged in
      toast.error("Please Login to like this Blog!");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          {/* like button */}

          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? "bg-red/30 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi " + (isLikedByUser ? "fi-ss-heart" : "fi-rs-heart")
              }
            ></i>
          </button>

          <p className="text-xl text-dark-grey">{total_likes}</p>

          {/* comment button */}
          <button
            onClick={() => setCommentsWrapper((preVal) => !preVal)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-alt-dots"></i>
          </button>

          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/post?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
