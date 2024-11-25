import fetch from "node-fetch";

// In setWebhook.ts
const setWebhook = async () => {
  const url = `https://api.telegram.org/bot7393611597:AAEucebp0SicD06PY--xzr-tT226AXk8i78/setWebhook?url=https://https://turgergame-e658fc07bd50.herokuapp.com/your-webhook-path`;
  await fetch(url);
  console.log("Webhook set successfully");
};

export default setWebhook;
