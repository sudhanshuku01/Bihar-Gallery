import "./style/App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LazyLoader from "./components/general/LazyLoader";
const Home = lazy(() => import("./components/general/Home"));
const MediaUpload = lazy(() => import("./components/general/MediaUpload"));
const Blog = lazy(() => import("./components/general/Blog"));
const Gallery = lazy(() => import("./components/general/Gallery"));

const GoogleAuth = lazy(
  () => import("./components/auth/GoogleAuthComplete")
);
const Login = lazy(() => import("./components/auth/Login"));
const SignUp = lazy(() => import("./components/auth/SignUp"));

const ErrorPage = lazy(() => import("./components/general/ErrorPage"));
const UserProfile = lazy(() => import("./components/auth/UserProfile"));
const GalleryImages = lazy(() => import("./components/gallery/GalleryImages"));
const GalleryVideos = lazy(() => import("./components/gallery/GalleryVideos"));
const GalleryLeaderBoard = lazy(
  () => import("./components/gallery/GalleryLeaderBoard")
);
const AdminMediaReview = lazy(
  () => import("./components/admin/AdminMediaReview")
);
const SignUpSuccessful = lazy(
  () => import("./components/auth/SignUpSuccessful")
);
const BlogPage = lazy(() => import("./components/blog/BlogPage"));
const BlogSearchPage = lazy(() => import("./components/blog/BlogSearchPage"));
const PrivacyPolicy = lazy(() => import("./components/admin/PrivacyPolicy"));
const AboutUs = lazy(() => import("./components/admin/AboutUs"));
const ContactUs = lazy(() => import("./components/admin/ContactUs"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const MediaPage = lazy(() => import("./components/general/MediaPage"));
const AdminBlog = lazy(() => import("./components/admin/AdminBlog"));

const App = () => {
  return (
    <>
      <Suspense fallback={<LazyLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:userName" element={<UserProfile />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/login" element={<Login />} />
          <Route
            path="/user/signup/successful"
            element={<SignUpSuccessful />}
          />
          <Route path="/user/googleauth" element={<GoogleAuth />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />

          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/images" element={<GalleryImages />} />
          <Route path="/gallery/videos" element={<GalleryVideos />} />
          <Route path="/gallery/leaderboard" element={<GalleryLeaderBoard />} />
          <Route path="/media/:slugTitle" element={<MediaPage />} />
          <Route path="/media-upload" element={<MediaUpload />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slugTitle" element={<BlogPage />} />
          <Route path="/blog/search" element={<BlogSearchPage />} />

          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="/admin/media" element={<AdminMediaReview />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
