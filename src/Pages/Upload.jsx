import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { 
  Upload as UploadIcon, 
  Music, 
  X, 
  Check, 
  AlertCircle,
  File,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "react-toastify";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Maximum size is 50MB.`);
        } else if (error.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported file type.`);
        }
      });
    });

    // Handle accepted files
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "",
      album: "",
      genre: "",
      status: 'pending',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.m4a', '.ogg'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileInfo = (id, field, value) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const simulateUpload = async (fileData) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const audioFiles = files.filter(f => f.file.type.startsWith('audio/'));
    if (audioFiles.length === 0) {
      toast.error("Please select at least one audio file");
      return;
    }

    // Validate required fields
    const invalidFiles = audioFiles.filter(f => !f.title.trim() || !f.artist.trim());
    if (invalidFiles.length > 0) {
      toast.error("Please fill in title and artist for all audio files");
      return;
    }

    setUploading(true);
    
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));

      // Simulate upload for each file
      await Promise.all(files.map(async (fileData) => {
        await simulateUpload(fileData);
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'completed' } : f
        ));
      }));

      toast.success(`Successfully uploaded ${files.length} files!`);
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({});
      }, 2000);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('audio/')) return <Music className="text-green-500" size={24} />;
    if (file.type.startsWith('image/')) return <ImageIcon className="text-blue-500" size={24} />;
    return <File className="text-gray-500" size={24} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'uploading':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Music</h1>
          <p className="text-gray-600">Share your music with the world. Upload audio files and cover images.</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ scale: isDragActive ? 1.1 : 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <UploadIcon className={isDragActive ? 'text-white' : 'text-gray-500'} size={32} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Drop files here' : 'Upload your music'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your audio files and cover images, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  <p>Supported formats: MP3, WAV, FLAC, M4A, OGG</p>
                  <p>Images: JPG, PNG, GIF, WebP</p>
                  <p>Maximum file size: 50MB</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Files to Upload ({files.length})</h2>
              
              <div className="space-y-4">
                {files.map((fileData) => (
                  <motion.div
                    key={fileData.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-4">
                      {/* File Icon/Preview */}
                      <div className="flex-shrink-0">
                        {fileData.preview ? (
                          <img 
                            src={fileData.preview} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getFileIcon(fileData.file)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {fileData.file.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(fileData.status)}
                            <button
                              onClick={() => removeFile(fileData.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              disabled={uploading}
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-3">
                          {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        {/* Progress Bar */}
                        {fileData.status === 'uploading' && uploadProgress[fileData.id] && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(uploadProgress[fileData.id])}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[fileData.id]}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Metadata Fields (only for audio files) */}
                        {fileData.file.type.startsWith('audio/') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Song Title *"
                              value={fileData.title}
                              onChange={(e) => updateFileInfo(fileData.id, 'title', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              disabled={uploading}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Artist *"
                              value={fileData.artist}
                              onChange={(e) => updateFileInfo(fileData.id, 'artist', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              disabled={uploading}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Album"
                              value={fileData.album}
                              onChange={(e) => updateFileInfo(fileData.id, 'album', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              disabled={uploading}
                            />
                            <select
                              value={fileData.genre}
                              onChange={(e) => updateFileInfo(fileData.id, 'genre', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              disabled={uploading}
                            >
                              <option value="">Select Genre</option>
                              <option value="quartet">Quartet</option>
                              <option value="chorale">Chorale</option>
                              <option value="acapella">Acapella</option>
                              <option value="oldtimers">Old Timers</option>
                              <option value="live">Live Performance</option>
                              <option value="contemporary">Contemporary</option>
                              <option value="traditional">Traditional</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upload Button */}
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Audio Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High-quality audio files (320kbps MP3 or higher)</li>
                <li>• Clear title and artist information required</li>
                <li>• Original content or proper licensing</li>
                <li>• No explicit content without proper labeling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cover Art Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Square format recommended (1:1 ratio)</li>
                <li>• Minimum 500x500 pixels</li>
                <li>• High-resolution images preferred</li>
                <li>• Original artwork or proper licensing</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;