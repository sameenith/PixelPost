import { React, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUp, Loader2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

export default function CreatePost({ open, setOpen }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { posts } = useSelector((store) => store.posts);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // This is a cleanup function. It runs when the component is removed  or when the 'preview' state changes.
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current.click();
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
  };

  const resetState = () => {
    setFile(null);
    setCaption("");
    setPreview(null);
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    console.log(file, caption);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      if (file) formData.append("image", file);

      const res = await axios.post("/api/v1/post/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        resetState();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-screen p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center text-lg font-medium">
            Create new post
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Upload and Preview Section */}
          <div className="flex flex-col items-center justify-center p-6 border-r bg-gray-50/50">
            {preview ? (
              <div className="relative w-full h-full max-h-[400px]">
                <img
                  src={preview}
                  alt="Image preview"
                  className="w-full h-full object-contain rounded-md"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 z-10 right-2 cursor-pointer rounded-full bg-black bg-opacity-50 hover:bg-opacity-75"
                  onClick={clearImage}
                >
                  <X className="h-5 w-5 text-white " />
                </Button>
              </div>
            ) : (
              <div className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <ImageUp
                    className="h-16 w-16 text-gray-400"
                    strokeWidth={1}
                  />
                  <p className="text-gray-500 text-center">
                    Add photos and videos
                  </p>
                  <Button onClick={handleSelectFileClick} asChild>
                    <span className="text-sm">Select from computer</span>
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Caption and Details Section */}
          <div className="flex flex-col p-4 space-y-4">
            <Textarea
              placeholder="Write a caption..."
              className="flex-grow resize-none border-none focus-visible:ring-0"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={8}
            />
            <Separator />

            {/* Only render this section if there is a file preview */}
            {preview && (
              <div className="flex justify-end">
                <Button
                  disabled={!file || loading}
                  onClick={createPostHandler}
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 w-28"
                >
                  {loading ? (
                    // Show this content when loading
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      <span>Wait...</span>
                    </>
                  ) : (
                    // Show this content when not loading
                    "Share"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
