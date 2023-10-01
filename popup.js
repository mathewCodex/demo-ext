"use-strict";
// Function that get the current Tab from chrome
// On click event to trigger the function once the content is loaded
// document.addEventListener("DOMContentLoaded", function () {
//   //get the current to display in the markup on click
//   document.getElementById("profileBtn").addEventListener("click", function () {
//     //using chrome APi to query our tab and to display the content in our HTML...
//     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
//       const profileTab = tab[0];
//       const message = { action: "getProfileData" };
//       chrome.tabs.sendMessage(profileTab.id, message);
//       // document.getElementById("curProfileRes").textContent =
//       //   "Current Tab Title: " + message;
//     });

//     // ( {

//     //   // const title = tab.title;

//     // });
//   });
// });
document.getElementById("scrapeButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const message = { action: "scrapeLinkedInProfiles" };
    chrome.tabs.sendMessage(activeTab.id, message);
  });
});
