export const authMe = async (req, res) => {
  try {
    const user = req.user; // data from authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("error when running authMe", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
}