import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/BlogCards";
import NoDataMessage from "../components/NoDataMessage";
import LoadMoreDataBtn from "../components/LoadMoreData";
import axios from "axios";
import { filterPaginationData } from "../common/Filter-pagination-data";
import UserCard from "../components/UserCard";

const SearchPage = () => {
  let { query } = useParams();

  let [blogs, setBlog] = useState(null);
  let [users, setUsers] = useState(null);

  const serverDomain =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(serverDomain + "/search-blogs", { query, page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlog(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = () => {
    axios
      .post(serverDomain + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlog(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Searching results for "${query}"`, "Accounts matched"]}
          defaultHidden={["Accounts matched"]}
        >
          <>
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No blogs published yet" />
            )}
            <LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      {/* In search page - Accounts Matched section only in larger screens */}

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">Users related to search <i className="fi fi-rr-user mt-1"></i></h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
