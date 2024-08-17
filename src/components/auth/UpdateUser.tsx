import React, {
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import user_IMG from "../../images/username.png";
import { UserTypes } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";

interface UpdateUserProps {
  user: UserTypes;
  setUser: Dispatch<SetStateAction<UserTypes | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateUser: React.FC<UpdateUserProps> = ({
  user,
  setUser,
  setIsModalOpen,
}) => {
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState(false);
  const [updatedFullName, setUpdatedFullName] = useState<string>("");
  const [updatedAddress, setUpdatedAddress] = useState<string>("");
  const [updatedInstagram, setUpdatedInstagram] = useState<string>("");
  const [updatedAbout, setUpdatedAbout] = useState<string>("");

  const [updatedImage, setUpdatedImage] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setUpdatedFullName(user.fullName);
      setUpdatedAddress(user.address || "");
      setUpdatedInstagram(user.instagram || "");
      setUpdatedAbout(user.about || "");
    }
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toastMessage("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toastMessage("File size should be less than 5MB.");
        return;
      }
      setUpdatedImage(file);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (updatedAddress) formData.append("address", updatedAddress.trim());
    if (updatedInstagram) formData.append("instagram", updatedInstagram.trim());
    if (updatedAbout) formData.append("about", updatedAbout.trim());
    if (updatedImage) formData.append("image", updatedImage);
    setLoading(true);
    setProgress(20);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-user/${user._id}`,
        formData
      );
      setProgress(70);
      if (response && response.data.success) {
        toastMessage(response.data.message);
        setUser((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            fullName: updatedFullName || prevData.fullName,
            address: updatedAddress || prevData.address,
            instagram: updatedInstagram || prevData.instagram,
            about: updatedAbout || prevData.about,
          };
        });
      } else {
        toastMessage(response.data.message);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toastMessage(error.response.data.message);
      } else {
        toastMessage("Something went wrong!");
      }
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setProgress(100);
      setLoading(false);
    }
  };
  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      icon: icon,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <div className="updateuser">
      <div className="updateuser-close">
        <span onClick={() => setIsModalOpen(false)}></span>
        <span onClick={() => setIsModalOpen(false)}></span>
      </div>
      <div className="updateuser-image">
        {updatedImage ? (
          <img src={URL.createObjectURL(updatedImage)} alt="img-user" />
        ) : (
          <img
            src={
              `${import.meta.env.VITE_API_BASE_URL}/api/auth/user/getimage/${
                user._id
              }`
                ? `${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/auth/user/getimage/${user._id}`
                : user_IMG
            }
            alt="img-user"
          />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={updatedFullName}
            onChange={(e) => setUpdatedFullName(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={updatedAddress}
            onChange={(e) => setUpdatedAddress(e.target.value)}
          />
        </div>
        <div>
          <label>InstagramId:</label>
          <input
            type="text"
            value={updatedInstagram}
            onChange={(e) => setUpdatedInstagram(e.target.value)}
          />
        </div>
        <div>
          <label>About:</label>
          <input
            type="text"
            value={updatedAbout}
            onChange={(e) => setUpdatedAbout(e.target.value)}
          />
        </div>
        <div>
          <label>Image:</label>
          <input accept="image/*" type="file" onChange={handleImageChange} />
        </div>
        <button disabled={loading} type="submit">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
