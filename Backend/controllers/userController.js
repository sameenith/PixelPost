import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import Post from "../models/postModel.js";
import path from "path";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: " Email already exists. Please use another email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ userName, email, password: hashedPassword });

    res.status(201).json({
      message: " User registered successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error in registering user ", error);
    return res.status(500).json({
      message: "An error occurred during registration.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // populate each post if it is in the posts array
    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `welcome back, ${user.userName}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Error in login user ", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("token", " ", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in logout user ", error);
    return res.status(500).json({
      message: "An error occurred during logout.",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      })
      .populate("bookmarks");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in getProfile: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

// export const editProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { bio, gender } = req.body;
//     const profilePicture = req.file;

//     let cloudResponse;
//     if (profilePicture) {
//       const fileUri = getDataUri(profilePicture);
//       cloudResponse = await cloudinary.uploader.upload(fileUri);
//     }

//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({
//         message: "user not found",
//         success: false,
//       });
//     }

//     if (bio) user.bio = bio;
//     if (gender) user.gender = gender;
//     if (profilePicture) user.profilePicture = cloudResponse.secure_url;

//     await user.save();
//     return res.status(200).json({
//       message: "user updated",
//       user: user,
//       success: true,
//     });
//   } catch (error) {
//     console.log("Error in getting user profile ", error);
//     return res.status(500).json({
//       message: "An error occurred while fetching user profile.",
//       success: false,
//     });
//   }
// };

export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    // Get all possible fields from the request
    const { bio, gender, userName } = req.body;
    const { fullName } = req.body;
    const profilePictureFile = req.file;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (gender !== undefined) updateData.gender = gender;
    if (userName !== undefined) updateData.userName = userName;
    if (fullName !== undefined) updateData.fullName = fullName;

    // 2. Handle file upload separately
    if (profilePictureFile) {
      const fileUri = getDataUri(profilePictureFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      updateData.profilePicture = cloudResponse.secure_url;
    }

    // 3. Update the user and get the new document back in one step
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // This is the crucial part!
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // 4. Send the new, updated user object back to the frontend
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser, // This is now the correct, updated data
      success: true,
    });
  } catch (error) {
    console.log("Error in editProfile: ", error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const suggestedUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .limit(10); //  limit for performance

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(404).json({
        message: "No other users found.",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const loggedInUserId = req.userId; // follow karne vala
    const targetUserId = req.params.id; // jiskoFollowKrenge

    if (loggedInUserId === targetUserId) {
      return res.status(400).json({
        message: "can't follow or unfollow itself",
        success: false,
      });
    }

    const user = await User.findById(loggedInUserId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    // check whether to follow or unfollow
    const isFollowing = user.following.includes(targetUserId);
    if (isFollowing) {
      // mtlab ab unfollow karna h
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: loggedInUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed Succesfully",
        success: true,
      });
    } else {
      //  ab follow karna h
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: loggedInUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Followed Succesfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error in followOrUnfollow: ", error);
    return res.status(500).json({
      message: "An error occured on the server",
      success: false,
    });
  }
};
