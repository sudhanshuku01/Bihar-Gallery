import { putObjectUrl, deleteObject, getObjectUrl } from "../CloudStorage.js";
import { redisClient } from "../Redis.js";
import Media from "../model/MediaModel.js";
import User from "../model/UserModel.js";
import slugify from "slugify";

export const MediaUpload = async (req, res) => {
  const { key, className, mediaType, title, description, location, tags } =
    req.body;

  const creator = req.user._id;

  const creatorAccount = await User.findById(creator);

  if (creatorAccount.postLeft <= 0) {
    return res.status(400).json({
      success: false,
      message: "You have reached limit comeback tomorrow",
    });
  }

  if (!key || !mediaType) {
    return res.status(400).json({
      success: false,
      message: "Key and mediaType is required",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }
  if (!className) {
    return res.status(400).json({
      success: false,
      message: "className is required",
    });
  }
  const slug = slugify(title, { lower: true });

  const randomNumber = Math.floor(Math.random() * 100000000);

  const slugTitle = `${slug}-${randomNumber}`;

  const newMedia = new Media({
    key,
    mediaType,
    title,
    slugTitle,
    description,
    location,
    tags,
    creator,
    className,
  });

  try {
    await newMedia.save();
    const presignedUrl = await putObjectUrl(key, mediaType);

    creatorAccount.postLeft -= 1;
    creatorAccount.totalPost += 1;

    await creatorAccount.save();

    res.status(200).json({
      success: true,
      url: presignedUrl,
      media: newMedia,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error try after some time",
    });
  }
};

export const GetAllImages = async (req, res) => {
  try {
    const { page } = req.query || 1;

    const cacheKey = `images_page_${page}`; // Use page-specific cache keys

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        totalPages: JSON.parse(cachedData).totalPages,
        Data: JSON.parse(cachedData).Data,
        cache: true,
      });
    }

    const limit = 5;
    const totalCount = await Media.countDocuments({
      mediaType: { $regex: /^image\// },
      isReviewed: true,
    });

    const totalPages = Math.ceil(totalCount / limit);
    console.log(totalPages);

    if (page > totalPages) {
      return res.status(200).json({
        success: true,
        message: "reached the maximum limit of pages",
        totalPages,
        Data: [],
      });
    }

    let skip = (page - 1) * limit;

    const images = await Media.find({
      mediaType: { $regex: /^image\// },
      isReviewed: true,
    })
      .populate("creator", "userName image")
      .skip(skip)
      .limit(limit);
    console.log(images);
    const Data = await Promise.all(
      images.map(async (image) => {
        const url = await getObjectUrl(image.key);
        return {
          url: url,
          slugTitle: image.slugTitle,
          className: image.className,
          userName: image.creator.userName,
        };
      })
    );

    // Store the result in Redis with a timeout (TTL) of 1 hour (3600 seconds)
    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify({ totalPages, Data })
    );

    res.status(200).json({
      success: true,
      totalPages,
      Data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving images", error });
  }
};

export const GetAllVideos = async (req, res) => {
  try {
    const { page } = req.query || 1;

    const cacheKey = `videos_page_${page}`; // Use page-specific cache keys

    // Check if data is cached in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        totalPages: JSON.parse(cachedData).totalPages,
        Data: JSON.parse(cachedData).Data,
        cache: true, // Indicating that data is from the cache
      });
    }

    const limit = 5;
    const totalCount = await Media.countDocuments({
      mediaType: { $regex: /^video\// },
      isReviewed: true,
    });

    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      return res.status(200).json({
        success: true,
        message: "reached the maximum limit of pages",
        totalPages,
        Data: [],
      });
    }

    let skip = (page - 1) * limit;

    const videos = await Media.find({ mediaType: { $regex: /^video\// } })
      .populate("creator", "userName image")
      .skip(skip)
      .limit(limit);

    const Data = await Promise.all(
      videos.map(async (video) => {
        const url = await getObjectUrl(video.key);
        return {
          url: url,
          slugTitle: video.slugTitle,
          className: video.className,
          userName: video.creator.userName,
        };
      })
    );

    // Store the result in Redis with a timeout (TTL) of 1 hour (3600 seconds)
    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify({ totalPages, Data })
    );

    res.status(200).json({
      success: true,
      totalPages,
      Data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving images", error });
  }
};

export const GetMediaByCreatorUserName = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 5;
    const { userName } = req.params;
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const totalCount = await Media.countDocuments({ creator: user._id });
    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      return res.status(200).json({
        success: true,
        message: "reached the maximum limit of pages",
        totalPages,
        Data: [],
      });
    }

    let skip = (page - 1) * limit;

    const medias = await Media.find({ creator: user._id })
      .skip(skip)
      .limit(limit);

    const Data = await Promise.all(
      medias.map(async (media) => {
        const url = await getObjectUrl(media.key);
        return {
          url: url,
          className: media.className,
          slugTitle: media.slugTitle,
          isReviewed: media.isReviewed,
          mediaType: media.mediaType,
        };
      })
    );
    res.status(200).json({
      success: true,
      totalPages,
      Data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving media", error });
  }
};

export const GetAllMedia = async (req, res) => {
  try {
    const { page } = req.query || 1;

    const cacheKey = `media_page_${page}`; // Create a unique cache key for each page

    // Check if data is cached in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        totalPages: JSON.parse(cachedData).totalPages,
        Data: JSON.parse(cachedData).Data,
        cache: true, // Indicating that data is from the cache
      });
    }

    const limit = 5;

    const totalCount = await Media.countDocuments({
      isReviewed: true,
    });

    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      return res.status(200).json({
        success: true,
        message: "reached the maximum limit of pages",
        totalPages,
        Data: [],
      });
    }

    let skip = (page - 1) * limit;

    const medias = await Media.find({
      isReviewed: true,
    })
      .populate("creator", "userName image")
      .skip(skip)
      .limit(limit);

    const Data = await Promise.all(
      medias.map(async (media) => {
        const url = await getObjectUrl(media.key);
        return {
          url: url,
          slugTitle: media.slugTitle,
          className: media.className,
          mediaType: media.mediaType,
          userName: media.creator.userName,
        };
      })
    );
    // Store the result in Redis with a TTL (Time-to-Live) of 1 hour (3600 seconds)
    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify({ totalPages, Data })
    );

    res.status(200).json({
      success: true,
      totalPages,
      Data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Medias", error });
  }
};

export const AdminGetAllMedia = async (req, res) => {
  try {
    const page = req.body.page || 1;

    const limit = 5;

    const totalCount = await Media.countDocuments({});

    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      return res.status(200).json({
        success: true,
        message: "reached the maximum limit of pages",
        totalPages,
        Data: [],
      });
    }

    let skip = (page - 1) * limit;

    const medias = await Media.find({})
      .populate("creator", "userName image")
      .skip(skip)
      .limit(limit);

    const Data = await Promise.all(
      medias.map(async (media) => {
        const url = await getObjectUrl(media.key);
        return {
          url: url,
          media: media,
        };
      })
    );

    res.status(200).json({
      success: true,
      totalPages,
      Data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Medias", error });
  }
};

export const GetMediaBySlugTitle = async (req, res) => {
  const { slugTitle } = req.params;
  if (!slugTitle) {
    return res.status(400).json({
      success: false,
      message: "slugTitle is required",
    });
  }
  try {
    const media = await Media.findOne({ slugTitle }).populate(
      "creator",
      "_id userName instagram"
    );
    if (!media) {
      return res.status(400).json({
        success: false,
        message: "media is not with this slugTitle",
      });
    }
    const url = await getObjectUrl(media.key);
    return res.status(200).json({
      success: true,
      Data: {
        url,
        media,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving Medias by slug name",
      error,
    });
  }
};

export const UpdateMedia = async (req, res) => {
  const { mediaId } = req.params;
  const { title, description, location, tags, ReviewedString } = req.body;

  try {
    const media = await Media.findById(mediaId);

    // Check if the media exists
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    // Update the media with the provided fields
    if (title && title !== media.title) {
      const slug = slugify(title, { lower: true });
      const randomNumber = Math.floor(Math.random() * 100000000);
      const slugTitle = `${slug}-${randomNumber}`;
      media.title = title;
      media.slugTitle = slugTitle;
    }
    if (description) {
      media.description = description;
    }
    if (location) {
      media.location = location;
    }
    if (tags) {
      media.tags = tags;
    }

    if (ReviewedString === "yes") {
      media.isReviewed = true;
    }

    await media.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Media updated successfully",
    });
  } catch (error) {
    console.error("Error updating media:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating media",
      error: error.message,
    });
  }
};
export const DeleteMedia = async (req, res) => {
  const { mediaId } = req.params;

  try {
    const deletedMedia = await Media.findByIdAndDelete(mediaId);

    if (!deletedMedia) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }
    await deleteObject(deletedMedia.key);
    // Return success response
    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      data: deletedMedia,
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting media",
      error: error.message,
    });
  }
};
