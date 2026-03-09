import api from "./api";

export const getLeaderBoardApi = async () => {
  try {
    const res = await api.post(
      "/api/v1/common/orders/leader-board/",
      {}
    );
    return res.data;
  } catch (err) {
    console.error("Leaderboard fetch failed", err);
    return { status: false };
  }
};
