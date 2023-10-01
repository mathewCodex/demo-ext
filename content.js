import { load } from "cheerio";
import { get } from "axios";

const profileUrls = [
  "https://www.linkedin.com/in/mathewcodex",
  "https://www.linkedin.com/in/stella-ladegbaye",
  "https://www.linkedin.com/in/daniella-atidigah",
];
console.log(profileUrls);
chrome.runtime.onMessage.addListener(async (message, sender, sendRes) => {
  if (message.action === "scrapeLinkedInProfiles") {
    //init an empty array for our updated data
    const profiles = [];

    async function scrapeData(url) {
      try {
        const res = await get(url);
        const html = res.data;
        const $ = load(html);

        const name = $(".pv-top-card--list:first-child h1").text().trim();
        const location = $(".pv-top-card--list:last-child .text-body-small")
          .text()
          .trim();
        const about = $(".pv-about-section .pv-about-section__summary-text")
          .text()
          .trim();
        const bio = $(".pv-about-section .pv-about-section__description")
          .text()
          .trim();
        const followerCount = $(
          ".pv-recent-activity-section .pv-recent-activity-counts li:first-child"
        )
          .text()
          .trim();
        const connectionCount = $(
          ".pv-top-card--list:last-child .text-body-xsmall"
        )
          .text()
          .trim();

        const profileData = {
          name,
          location,
          about,
          bio,
          followerCount,
          connectionCount,
        };
        profiles.push(profileData);

        // Send a message to the extension with the scraped data
        chrome.runtime.sendMessage(
          {
            action: "scrapedProfiles",
            data: profiles,
          },
          (response) => console.log(response)
        );

        const response = await fetch("http://localhost:3000/api/postData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profiles),
        });
        if (response.ok) {
          console.log(`Data fetched successfully`);
        } else {
          console.error("Error sending data");
        }
      } catch (err) {
        console.error("Error:", err.message); // Use console.error to log errors
      }
    }

    // Use Promise.all to ensure all profiles are scraped before sending the response
    try {
      await Promise.all(profileUrls.map((url) => scrapeData(url)));
      sendRes({ message: "Fetching completed" });
    } catch (err) {
      console.error("Error:", err.message); // Handle errors if any of the scraping fails
    }
  }
});
