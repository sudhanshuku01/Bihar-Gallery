export function determineSize(file: File) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

    const fileType = file.type;

    // Check if the file is an image
    if (fileType.startsWith("image")) {
      // Create a new image element
      const img = new Image();

      // Set the source of the image to the file
      img.src = URL.createObjectURL(file);

      // Once the image has loaded
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Determine the size based on the dimensions
        let size = "";

        const aspectRatio = width / height;

        if (aspectRatio > 1.5) {
          size = "wide";
        } else if (aspectRatio < 0.75) {
          size = "tall";
        } else if (width >= 1000 && height >= 1000) {
          size = "big";
        } else {
          size = "small";
        }

        // Resolve with the size
        resolve(size);
      };

      // If there's an error loading the image
      img.onerror = () => {
        reject("Error loading image");
      };
    } else if (fileType.startsWith("video")) {
      // Create a new video element
      const video = document.createElement("video");

      // Set the source of the video to the file
      video.src = URL.createObjectURL(file);

      // Once the video metadata has loaded
      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;

        let size = "";

        const aspectRatio = width / height;

        if (aspectRatio > 1.5) {
          size = "wide";
        } else if (aspectRatio < 0.75) {
          size = "tall";
        } else if (width >= 1000 && height >= 1000) {
          size = "big";
        } else {
          size = "small";
        }

        resolve(size);
      };

      // If there's an error loading the video
      video.onerror = () => {
        reject("Error loading video");
      };
    } else {
      reject("Unsupported file type");
    }
  });
}
