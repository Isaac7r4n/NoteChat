import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

// Ensures the pair is always stored in the same order
const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "recipientId or memberIds is required" });
    }

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const isFriend = await Friend.findOne({ userA, userB });
      if (!isFriend) {
        return res.status(403).json({ message: "You are not friends with this user" });
      }
      return next();
    }

    // Check that the current user is friends with every member in the list
    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const friend = await Friend.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({ message: "You can only add friends to a group.", notFriends });
    }

    next();
  } catch (error) {
    console.error("Error in checkFriendship:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkGroupMembership = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Attach conversation to request so the controller doesn't need to fetch it again
    req.conversation = conversation;
    next();
  } catch (error) {
    console.error("Error in checkGroupMembership:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};