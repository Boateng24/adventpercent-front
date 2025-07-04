import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { 
  Upload as UploadIcon, 
  Music, 
  X, 
  Check, 
  AlertCircle,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { uploadBase } from "../api/backend.api";

const Upload = () => {
  const [files, setFiles] = useState({
    audios: [],
    images: []
  });
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
    const newAudios = acceptedFiles
    .filter(file => file.type.startsWith('audio/'))
    .map(file => ({
      id: Math.random().toString(36).slice(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "",
      album: "",
      genre: "",
      status: 'pending',
      pairedImage: null, // Will store ID of paired image
      errors: {}
    }));

    const newImages = acceptedFiles
    .filter(file => file.type.startsWith('image/'))
    .map(file => ({
      id: Math.random().toString(36).slice(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setFiles(prev => ({
    audios: [...prev.audios, ...newAudios],
    images: [...prev.images, ...newImages]
  }));
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

  const pairImageWithAudio = (audioId, imageId) => {
  setFiles(prev => ({
    ...prev,
    audios: prev.audios.map(audio => 
      audio.id === audioId ? { ...audio, pairedImage: imageId || null } : audio
    )
  }));
};

  const removeFile = (id) => {
  setFiles(prev => ({
    audios: prev.audios.filter(f => f.id !== id),
    images: prev.images.filter(f => f.id !== id)
  }));
};

  const updateFileInfo = (id, field, value) => {
  setFiles(prev => ({
    ...prev,
    audios: prev.audios.map(audio => {
      if (audio.id === id) {
        const updatedAudio = { ...audio, [field]: value };
        
        // Validate required fields
        if (field === 'title' || field === 'artist') {
          const errors = { ...audio.errors };
          if (field === 'title' && !value.trim()) {
            errors.title = 'Title is required';
          } else if (field === 'title') {
            delete errors.title;
          }
          
          if (field === 'artist' && !value.trim()) {
            errors.artist = 'Artist is required';
          } else if (field === 'artist') {
            delete errors.artist;
          }
          
          updatedAudio.errors = errors;
        }
        
        return updatedAudio;
      }
      return audio;
    })
  }));
};


const validateFiles = () => {
  let isValid = true;
  
  setFiles(prev => {
    const updatedAudios = prev.audios.map(audio => {
      const errors = {};
      
      if (!audio.title.trim()) {
        errors.title = 'Title is required';
        isValid = false;
      }
      if (!audio.artist.trim()) {
        errors.artist = 'Artist is required';
        isValid = false;
      }
      
      return { ...audio, errors };
    });
    
    return { ...prev, audios: updatedAudios };
  });
  
  return isValid;
};


const handleUpload = async () => {
  if (files.audios.length === 0) {
    toast.error("Please select at least one audio file");
    return;
  }

  if (!validateFiles()) {
    toast.error("Please fix the errors before uploading");
    return;
  }

  setUploading(true);
  
  try {
    // Set all files to uploading status
    setFiles(prev => ({
      audios: prev.audios.map(a => ({ ...a, status: 'uploading' })),
      images: prev.images.map(i => ({ ...i, status: 'uploading' }))
    }));

    const formData = new FormData();

    // Add all files with their original names
    [...files.audios, ...files.images].forEach(fileData => {
      // Create a new File object to ensure the name is preserved
      const file = new File([fileData.file], fileData.file.name, {
        type: fileData.file.type
      });
      formData.append('files', file);
    });

    // Prepare metadata
    const metadata = files.audios.map(audio => ({
      title: audio.title,
      artist: audio.artist,
      album: audio.album,
      genre: audio.genre,
      audioFilename: audio.file.name,
      imageFilename: audio.pairedImage 
        ? files.images.find(img => img.id === audio.pairedImage)?.file.name
        : undefined
    }));

    formData.append('metadata', JSON.stringify(metadata));

    const response = await axios.post(`${uploadBase}/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Track progress for the first audio file (or implement per-file tracking)
        setUploadProgress(prev => ({ ...prev, [files.audios[0]?.id]: progress }));
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      toast.success(`Successfully uploaded ${files.audios.length} songs!`);
      // Clear all files after successful upload
      setFiles({ audios: [], images: [] });
      setUploadProgress({});
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(error.response?.data?.message || error.message || "Upload failed");
    // Set error status for all files
    setFiles(prev => ({
      audios: prev.audios.map(a => ({ ...a, status: 'error' })),
      images: prev.images.map(i => ({ ...i, status: 'error' }))
    }));
  } finally {
    setUploading(false);
  }
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Upload Music</h1>
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
            className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
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
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <UploadIcon className={isDragActive ? 'text-white' : 'text-gray-500'} size={28} />
              </div>
              
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Drop files here' : 'Upload your music'}
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  Drag and drop your audio files and cover images, or click to browse
                </p>
                <div className="text-xs md:text-sm text-gray-500 space-y-1">
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
      {(files.audios.length > 0 || files.images.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Files to Upload ({files.audios.length + files.images.length})
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Info size={16} className="mr-1" />
              <span>Fields marked with * are required</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Audio Files List */}
            {files.audios.map((audio) => (
              <motion.div
                key={audio.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`border rounded-lg p-4 ${
                  Object.keys(audio.errors).length > 0 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Audio File Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Music className="text-green-500" size={24} />
                    </div>
                  </div>

                  {/* Audio File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {audio.file.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(audio.status)}
                        <button
                          onClick={() => removeFile(audio.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          disabled={uploading}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      {(audio.file.size / (1024 * 1024)).toFixed(2)} MB • {audio.file.type}
                    </p>

                    {/* Progress Bar */}
                    {audio.status === 'uploading' && uploadProgress[audio.id] && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress[audio.id])}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[audio.id]}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          placeholder="Song Title"
                          value={audio.title}
                          onChange={(e) => updateFileInfo(audio.id, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            audio.errors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={uploading}
                        />
                        {audio.errors.title && (
                          <p className="mt-1 text-sm text-red-600">{audio.errors.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Artist *
                        </label>
                        <input
                          type="text"
                          placeholder="Artist Name"
                          value={audio.artist}
                          onChange={(e) => updateFileInfo(audio.id, 'artist', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            audio.errors.artist ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={uploading}
                        />
                        {audio.errors.artist && (
                          <p className="mt-1 text-sm text-red-600">{audio.errors.artist}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Album
                        </label>
                        <input
                          type="text"
                          placeholder="Album Name"
                          value={audio.album}
                          onChange={(e) => updateFileInfo(audio.id, 'album', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={uploading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Genre
                        </label>
                        <select
                          value={audio.genre}
                          onChange={(e) => updateFileInfo(audio.id, 'genre', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    </div>

                    {/* Image Pairing Section */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Image (optional)
                      </label>
                      <select
                        value={audio.pairedImage || ''}
                        onChange={(e) => pairImageWithAudio(audio.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={uploading || files.images.length === 0}
                      >
                        <option value="">No cover image</option>
                        {files.images.map(img => (
                          <option key={img.id} value={img.id}>
                            {img.file.name}
                          </option>
                        ))}
                      </select>

                      {/* Show preview if paired */}
                      {audio.pairedImage && (
                        <div className="mt-3 flex items-center space-x-2">
                          <img 
                            src={files.images.find(img => img.id === audio.pairedImage)?.preview}
                            className="h-16 w-16 object-cover rounded-lg border"
                            alt="Cover preview"
                          />
                          <span className="text-sm text-gray-600">
                            {files.images.find(img => img.id === audio.pairedImage)?.file.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Unassigned Images Section */}
            {files.images.filter(img => !files.audios.some(a => a.pairedImage === img.id)).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 border-t border-gray-200"
              >
                <h4 className="font-medium text-gray-900 mb-3">Unassigned Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.images
                    .filter(img => !files.audios.some(a => a.pairedImage === img.id))
                    .map(img => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.preview} 
                          className="h-24 w-full object-cover rounded-lg border"
                          alt="Unassigned cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => removeFile(img.id)}
                            className="p-1 bg-red-500 rounded-full text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs truncate">{img.file.name}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={uploading || files.audios.length === 0}
              className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Uploading...</span>
                </div>
              ) : (
                `Upload ${files.audios.length} Song${files.audios.length !== 1 ? 's' : ''}`
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
          className="bg-white rounded-xl shadow-lg p-4 md:p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Info className="mr-2 text-blue-500" size={16} />
                Audio Requirements
              </h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>High-quality audio files (320kbps MP3 or higher)</span>
                </li>
                 <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>Clear <strong>title</strong> and <strong>artist</strong> information required</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>Original content or proper licensing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>No explicit content without proper labeling</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Info className="mr-2 text-blue-500" size={16} />
                Cover Art Guidelines
              </h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>Square format recommended (1:1 ratio)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>Minimum 500×500 pixels resolution</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>High-quality images preferred</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>Original artwork or proper licensing</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;