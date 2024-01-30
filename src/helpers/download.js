import axios from "axios";

const downloadFile = (src, fileName, onDownloadProgress) => {
  axios({
    url: src,
    method: "GET",
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onDownloadProgress(percentCompleted);
    },
  })
    .then((response) => {
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || src.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      onDownloadProgress(100); // Indicate that the download is complete
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
      onDownloadProgress(0); // Reset progress on error
    });
};

export default downloadFile;

// const downloadSong = (src, songName) => {
//   // Create an anchor element
//   const anchor = document.createElement("a");

//   // Set the href to the URL of the song
//   anchor.href = src;

//   // Use download attribute to set the filename
//   anchor.download = songName;

//   // Append the anchor to the body
//   document.body.appendChild(anchor);

//   // Trigger the download by simulating a click
//   anchor.click();

//   // Remove the anchor after downloading
//   document.body.removeChild(anchor);
// };

// export default downloadSong
